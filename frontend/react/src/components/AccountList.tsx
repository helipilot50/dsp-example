
import { useQuery, useSubscription } from '@apollo/client';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ACCOUNTS_LIST, ACCOUNT_CREATED } from 'not-dsp-graphql';
import { useNavigate } from 'react-router';
import { AccountCreatedSubscription, AccountCreatedSubscriptionVariables, AccountsQuery, AccountsQueryVariables } from 'not-dsp-graphql';
import { Button, Alert, AlertTitle, Collapse, Snackbar, Card, CardContent, CardHeader, CardActions } from '@mui/material';
import { LIMIT_DEFAULT } from '../lib/ListDefaults';
import { useState, useMemo, useEffect } from 'react';
import { SNACKBAR_AUTOHIDE_DURATION } from '../lib/utility';
import { ErrorBoundary } from 'react-error-boundary';
import { useErrorBoundary } from 'react-error-boundary';
import { ErrorNofification } from './error/ErrorBoundary';


const columns: GridColDef[] = [
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
      return `${params.row.currency?.symbol} ${params.row.currency?.code}`;
    },
  },
];

export interface AccountListProps {
  retailerId?: string;
  allowCreate?: boolean;
}

export function AccountList(props: AccountListProps) {
  const navigate = useNavigate();
  const { data, error, loading } = useQuery<AccountsQuery, AccountsQueryVariables>(
    ACCOUNTS_LIST,
    {
      variables: {
        retailerId: props.retailerId || null,
      },
    }
  );

  return (

    <Card elevation={6}>
      <CardHeader title={'Accounts'} />
      <CardHeader subheader={'Click on a Account to see details'} />
      {props.allowCreate && <CardActions sx={{ ml: 2 }}>
        <Button variant='contained' onClick={() => navigate('new')}>New Account</Button>
      </CardActions>}
      <CardContent>
        <AccountCreated />
        {error && <ErrorNofification error={error} />}
        <DataGrid
          className='DataGrid'
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
          onRowClick={(row) => navigate(`${row.row.id}`)}
        />
      </CardContent>
    </Card>
  );
}

export function AccountCreated() {
  const { showBoundary } = useErrorBoundary();
  const { data: created } = useSubscription<AccountCreatedSubscription, AccountCreatedSubscriptionVariables>(ACCOUNT_CREATED, {
    onError(error) {
      showBoundary(error);
    },
  });

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

