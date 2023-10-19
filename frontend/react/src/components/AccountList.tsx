
import { useQuery, useSubscription } from '@apollo/client';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ACCOUNTS_LIST, ACCOUNT_CREATED } from '../graphql/accounts.graphql';
import { useNavigate } from 'react-router';
import { AccountCreatedSubscription, AccountCreatedSubscriptionVariables, AccountsQuery, AccountsQueryVariables } from '../graphql/types';
import { Typography, Paper, Box, Button, Alert, AlertTitle, Collapse, Snackbar } from '@mui/material';
import { LIMIT_DEFAULT } from '../lib/ListDefaults';
import { useState, useMemo, useEffect } from 'react';
import { SNACKBAR_AUTOHIDE_DURATION } from '../lib/utility';


const columns: GridColDef[] = [
  // { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 150,
    valueGetter: (params) => {
      return params.row.type;
    },
  },
  {
    field: 'currency',
    headerName: 'Currency',
    type: 'number',
    width: 110,
    valueGetter: (params) => {
      return params.row.currency?.code;
    },
  },
];

export function AccountsMain() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>Accounts</Typography>
      <AccountList />
    </div>
  );
}

export function AccountList() {
  const navigate = useNavigate();
  const { data, error, loading } = useQuery<AccountsQuery, AccountsQueryVariables>(
    ACCOUNTS_LIST
  );


  return (
    <Paper square={false}
      elevation={6}>
      <Box m={2}>
        {error && <p>Error: {error.message}</p>}
        <Typography variant="h6" gutterBottom>Click on an account to see details</Typography>
        <AccountCreated />
        <Button variant='contained' onClick={() => navigate('new')}>New Account</Button>
        <DataGrid
          sx={{ minHeight: 400 }}
          rows={(data && data.accounts) ? data.accounts : []}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: LIMIT_DEFAULT,
              },
            },
          }}
          pageSizeOptions={[LIMIT_DEFAULT]}
          // checkboxSelection
          onRowClick={(row) => navigate(`${row.row.id}`)}
        />
      </Box>
    </Paper>
  );
}

export function AccountCreated() {
  const { data: created } = useSubscription<AccountCreatedSubscription, AccountCreatedSubscriptionVariables>(ACCOUNT_CREATED);

  const [state, setState] = useState({ open: false, message: '' });
  useMemo(() => {
    if (created) {
      setState({ open: true, message: created?.accountCreated?.name + ' created at ' + new Date().toLocaleString() });
      console.log('[AccountCreated] created', created);
    }
  }, [created]);

  function onClose() {
    setState({ open: false, message: '' });
  }


  return (
    <Snackbar open={state.open}
      autoHideDuration={SNACKBAR_AUTOHIDE_DURATION}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Alert onClose={onClose}>
        <AlertTitle>Account {state.message} </AlertTitle>
      </Alert>
    </Snackbar >
  );
}

