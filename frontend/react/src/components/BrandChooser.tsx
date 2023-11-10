import { Autocomplete, Box, LinearProgress, TextField } from '@mui/material';
import { BRANDS_LIST, Brand, BrandsQuery, BrandsQueryVariables, PRODUCT_LIST, Sku, SkusQuery, SkusQueryVariables } from 'not-dsp-graphql';
import React, { HTMLAttributes, useId, useMemo } from 'react';
import { ErrorNofification } from './error/ErrorBoundary';
import { useQuery } from '@apollo/client';
import { OFFSET_DEFAULT } from '../lib/ListDefaults';
import { useErrorBoundary } from 'react-error-boundary';

export function BrandChooser(props: {
  open?: boolean;
  disabled?: boolean;
  onToggle?: () => void;
  selectedValues: Brand[];
  chosenBrands?: (retailers: Brand[]) => void;
}) {
  const id = useId();
  const { showBoundary } = useErrorBoundary();
  const { data, error, loading } = useQuery<BrandsQuery, BrandsQueryVariables>(
    BRANDS_LIST,
    {
      variables: {
        offset: OFFSET_DEFAULT,
        limit: 1000
      },
      fetchPolicy: 'cache-first',
    }
  );

  const elements = useMemo(
    () => data?.brands?.brands as Brand[] || [] as Brand[],
    [data],
  );

  const inputValues: Brand[] = useMemo(
    () => props.selectedValues || [],
    [props.selectedValues],
  );
  if (error) showBoundary(error);
  return (
    <>
      {loading && <LinearProgress variant="query" />}
      <Autocomplete
        id={id}
        disabled={props.disabled}
        open={props.open}
        onOpen={props.onToggle}
        onClose={props.onToggle}
        multiple
        size='small'
        options={elements}
        value={inputValues}
        onChange={(event: any, newValue: any) => {
          console.debug('[ProductChooser] onChange', newValue);
          props.chosenBrands && props.chosenBrands(newValue as Brand[]);
        }}
        autoHighlight
        getOptionLabel={(option: Brand) => {
          console.debug('[ProductChooser] getOptionLabel', option);
          return option.name as string;
        }}
        isOptionEqualToValue={(option: Brand, value: Brand) => option.id === value.id}
        renderOption={(props: HTMLAttributes<HTMLLIElement>, option: Brand) => (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            {option.name}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            label='Brands'
            {...params}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        )}

      />
    </>
  );
}

