import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React, { HTMLAttributes } from 'react';
import { Retailer, RetailersQuery, RetailersQueryVariables } from 'not-dsp-graphql';
import { useQuery } from '@apollo/client';
import { RETAILER_LIST } from 'not-dsp-graphql';
import { OFFSET_DEFAULT } from '../lib/ListDefaults';
import { ErrorNofification } from './error/ErrorBoundary';
import { LinearProgress } from '@mui/material';

export function RetailersChooser(props: {
  id: string;
  open?: boolean;
  disabled?: boolean;
  onToggle?: () => void;
  selectedValues: Retailer[];
  retailersChange?: (retailers: Retailer[]) => void;
}) {
  // Retailers
  const { data, loading, error } = useQuery<RetailersQuery, RetailersQueryVariables>(RETAILER_LIST,
    {
      variables: {
        offset: OFFSET_DEFAULT,
        limit: 1000,
      },
      fetchPolicy: 'cache-first'
    }
  );

  console.log('[RetailersChooser] props', props);

  const elements = React.useMemo(
    () => data?.retailers.retailers as Retailer[] || [] as Retailer[],
    [data],
  );

  const inputValues: Retailer[] = React.useMemo(
    () => props.selectedValues || [],
    [props.selectedValues],
  );

  console.log('[RetailersChooser] inputValues', inputValues);


  if (error) return (<ErrorNofification error={error} />);

  return (
    <>
      {loading && <LinearProgress variant="query" />}
      <Autocomplete
        id={props.id}
        disabled={props.disabled}
        open={props.open}
        onOpen={props.onToggle}
        onClose={props.onToggle}
        multiple
        size='small'
        options={elements}
        value={inputValues}
        onChange={(event: any, newValue: any) => {
          console.log('[RetailersChooser] onChange', newValue);
          props.retailersChange && props.retailersChange(newValue as Retailer[]);
        }}
        autoHighlight
        getOptionLabel={(option: Retailer) => {
          console.log('[RetailersChooser] getOptionLabel', option);
          return option.name;
        }}
        isOptionEqualToValue={(option: Retailer, value: Retailer) => option.id === value.id}
        renderOption={(props: HTMLAttributes<HTMLLIElement>, option: Retailer) => (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            {option.name}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
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
