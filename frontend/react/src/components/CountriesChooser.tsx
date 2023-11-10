import { useQuery } from '@apollo/client';
import React, { HTMLAttributes } from 'react';
import { ALL_COUNTRIES } from 'not-dsp-graphql';
import { AllCountriesQuery, AllCountriesQueryVariables, Country } from 'not-dsp-graphql';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, TextField } from '@mui/material';
import { ErrorNofification } from './error/ErrorBoundary';
import { useErrorBoundary } from 'react-error-boundary';



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
  const { showBoundary } = useErrorBoundary();
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
    showBoundary(error);
  }
  if (loading)
    return (<div>Loading countries...</div>);


  console.debug('[CountriesChooser] countries', elements);
  console.debug('[CountriesChooser] inputValues', inputValues);

  return (
    <>
      <Autocomplete
        id={id}
        disabled={disabled}
        open={open}
        onOpen={onToggle}
        onClose={onToggle}
        multiple
        placeholder='Add country...'
        size='medium'
        options={elements}
        value={inputValues}
        onChange={(event: any, newValue: any) => {
          console.debug('[CountriesChooser] onChange', newValue);
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
            label='Countries'
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