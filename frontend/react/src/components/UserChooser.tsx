import { useQuery } from '@apollo/client';
import { LinearProgress, Autocomplete, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { USER_LIST, User, UsersQuery, UsersQueryVariables } from 'not-dsp-graphql';
import React, { HTMLAttributes, useId, useMemo } from 'react';
import { ErrorNofification } from './error/ErrorBoundary';
import { useErrorBoundary } from 'react-error-boundary';

export function UserChooser(props: {
  open?: boolean;
  disabled?: boolean;
  onToggle?: () => void;
  selectedValues: User[];
  chosenUsers?: (users: User[]) => void;
}) {
  const id = useId();
  const { showBoundary } = useErrorBoundary();
  const { data, error, loading } = useQuery<UsersQuery, UsersQueryVariables>(
    USER_LIST,
    {
      fetchPolicy: 'cache-first',
    }
  );
  if (error) showBoundary(error);

  const elements = useMemo(
    () => data?.users as User[] || [] as User[],
    [data],
  );

  const inputValues: User[] = useMemo(
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
          console.debug('[ProductChooser] onChange', newValue);
          props.chosenUsers && props.chosenUsers(newValue as User[]);
        }}
        autoHighlight
        getOptionLabel={(option: User) => {
          console.debug('[ProductChooser] getOptionLabel', option);
          return option.firstName + ' ' + option.lastName as string;
        }}
        isOptionEqualToValue={(option: User, value: User) => option.id === value.id}
        renderOption={(props: HTMLAttributes<HTMLLIElement>, option: User) => (
          <Box component="li" sx={{ '& > img': { flexShrink: 0 } }} {...props}>
            {option.firstName + ' ' + option.lastName}
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