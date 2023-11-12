import { Autocomplete, Box, LinearProgress, TextField } from '@mui/material';
import { PRODUCT_LIST, Sku, SkusQuery, SkusQueryVariables } from 'not-dsp-graphql';
import React, { HTMLAttributes, useId, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { LIMIT_DEFAULT, OFFSET_DEFAULT } from '../lib/ListDefaults';
import { ErrorNofification } from './error/ErrorBoundary';
import { useErrorBoundary } from 'react-error-boundary';

export function ProductChooser(props: {
  open?: boolean;
  disabled?: boolean;
  onToggle?: () => void;
  selectedValues: Sku[];
  retailersChange?: (retailers: Sku[]) => void;
}) {
  const id = useId();
  const { showBoundary } = useErrorBoundary();
  const { data, error, loading } = useQuery<SkusQuery, SkusQueryVariables>(
    PRODUCT_LIST,
    {
      variables: {
        offset: OFFSET_DEFAULT,
        limit: 1000
      },
      fetchPolicy: 'cache-first',
    }
  );

  const elements = useMemo(
    () => data?.skus?.skus as Sku[] || [] as Sku[],
    [data],
  );

  const inputValues: Sku[] = useMemo(
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
          // console.debug('[ProductChooser] onChange', newValue);
          props.retailersChange && props.retailersChange(newValue as Sku[]);
        }}
        autoHighlight
        getOptionLabel={(option: Sku) => {
          // console.debug('[ProductChooser] getOptionLabel', option);
          return option.name as string;
        }}
        isOptionEqualToValue={(option: Sku, value: Sku) => option.skuKey === value.skuKey}
        renderOption={(props: HTMLAttributes<HTMLLIElement>, option: Sku) => (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            {option.name}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            label="Products"
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

