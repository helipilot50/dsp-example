import { useQuery } from '@apollo/client';
import { ACCOUNTS_LIST, Account, AccountsQuery, AccountsQueryVariables } from 'not-dsp-graphql';
import React, { HTMLAttributes, useId, useMemo } from 'react';
import { ErrorNofification, ErrorNofification } from './error/ErrorBoundary';
import { Autocomplete, Box, LinearProgress, TextField } from '@mui/material';

export function AccountChooser(props: {
  open?: boolean;
  disabled?: boolean;
  onToggle?: () => void;
  selectedValues: Account[];
  chosenAccounts?: (retailers: Account[]) => void;
}) {
  const id = useId();
  const { data, error, loading } = useQuery<AccountsQuery, AccountsQueryVariables>(
    ACCOUNTS_LIST,
    {
      fetchPolicy: 'cache-first',
    }
  );

  const elements = useMemo(
    () => data?.accounts as Account[] || [] as Account[],
    [data],
  );

  const inputValues: Account[] = useMemo(
    () => props.selectedValues || [],
    [props.selectedValues],
  );
  return (
    <>
      {error && <ErrorNofification error={error} />}
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
          console.log('[AccountChooser] onChange', newValue);
          props.chosenAccounts && props.chosenAccounts(newValue as Account[]);
        }}
        autoHighlight
        getOptionLabel={(option: Account) => {
          console.log('[AccountChooser] getOptionLabel', option);
          return option.name as string;
        }}
        isOptionEqualToValue={(option: Account, value: Account) => option.id === value.id}
        renderOption={(props: HTMLAttributes<HTMLLIElement>, option: Account) => (
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
