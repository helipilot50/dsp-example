import { useQuery } from '@apollo/client';
import React, { HTMLAttributes } from 'react';
import { ALL_COUNTRIES } from '../graphql/common.graphql';
import { AllCountriesQuery, AllCountriesQueryVariables, Country } from '../graphql/types';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, TextField } from '@mui/material';
import { ErrorNofification } from './error/ErrorBoundary';



export interface CountriesChooserProps {

  id: string;
  open?: boolean;
  disabled?: boolean;
  onToggle?: () => void;
  selectedValues: Country[];
  countryChange?: (countries: Country[]) => void;

}

function CountriesChooser({
  id,
  open,
  disabled,
  onToggle,
  selectedValues,
  countryChange
}: CountriesChooserProps) {
  //countries
  const { data, loading, error } = useQuery<AllCountriesQuery, AllCountriesQueryVariables>(ALL_COUNTRIES, {
    fetchPolicy: 'cache-first',
  });
  const elements = React.useMemo(
    () => data?.countries as Country[] || [] as Country[],
    [data],
  );

  const inputValues: Country[] = React.useMemo(
    () => selectedValues,
    [selectedValues],
  );


  if (error) {
    console.error('[CountriesChooser] error', error);
    return (<div>Failed to load countries with error: ${error.message}</div>);
  }
  if (loading)
    return (<div>Loading countries...</div>);


  console.log('[CountriesChooser] countries', elements);
  console.log('[CountriesChooser] inputValues', inputValues);

  return (
    <>
      {error && <ErrorNofification error={error} />}
      <Autocomplete
        id={id}
        disabled={disabled}
        open={open}
        onOpen={onToggle}
        onClose={onToggle}
        multiple
        size='medium'
        options={elements}
        value={inputValues}
        onChange={(event: any, newValue: any) => {
          console.log('[CountriesChooser] onChange', newValue);
          countryChange && countryChange(newValue as Country[]);
        }}
        autoHighlight
        getOptionLabel={(option: Country) => option.name}
        isOptionEqualToValue={(option: Country, value: Country) => option.code === value.code}
        renderOption={(props: HTMLAttributes<HTMLLIElement>, option: Country) => (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            <img
              loading="lazy"
              width="20"
              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
              alt=""
            />
            {option.name}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            // label="Country"
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


export default CountriesChooser;