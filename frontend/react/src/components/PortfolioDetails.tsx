import { Alert, AlertTitle, Button, Card, CardActions, CardContent, CardHeader, FormControl, FormLabel, LinearProgress, Snackbar, Stack, TextField } from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import React, { useEffect, useMemo, useState } from 'react';
import { ErrorNofification } from './error/ErrorBoundary';
import { useNavigate, useParams } from 'react-router-dom';
import { Account, Brand, LIST_PORTFOLIOS, MAP_PORTFOLIO_ACCOUNTS, MAP_PORTFOLIO_BRANDS, MAP_PORTFOLIO_USERS, MapAccountsToPortfolioMutation, MapAccountsToPortfolioMutationVariables, MapBrandsToPortfolioMutation, MapBrandsToPortfolioMutationVariables, MapUsersToPortfolioMutation, MapUsersToPortfolioMutationVariables, NEW_PORTFOLIO, NewPortfolioMutation, NewPortfolioMutationVariables, PORTFOLIO_ACCOUNTS_MODIFIED, PORTFOLIO_BRANDS_MODIFIED, PORTFOLIO_DETAILS, PORTFOLIO_USERS_MODIFIED, Portfolio, PortfolioAccountsModifiedSubscription, PortfolioAccountsModifiedSubscriptionVariables, PortfolioBrandsModifiedSubscription, PortfolioBrandsModifiedSubscriptionVariables, PortfolioQuery, PortfolioQueryVariables, PortfolioUsersModifiedSubscription, PortfolioUsersModifiedSubscriptionVariables, User } from 'not-dsp-graphql';
import { ApolloError, useMutation, useQuery, useSubscription } from '@apollo/client';
import { UserChooser } from './UserChooser';
import { AccountChooser } from './AccountChooser';
import { BrandChooser } from './BrandChooser';
import { useErrorBoundary } from 'react-error-boundary';
import { SNACKBAR_AUTOHIDE_DURATION } from '../lib/utility';

export function PortfolioDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const [isNew] = useState(params.portfolioId === 'new');
  const portfolioId = useMemo(() => {
    return params.portfolioId || 'new';
  }, [params.portfolioId]);
  const [portfolio, setPortfolio] = useState<Portfolio>({
    id: 'no-id',
    name: '',
    description: '',
    users: [],
    brands: [],
    accounts: [],
  });

  const [newPortfolio, { loading: createLoading, error: createError }] = useMutation<NewPortfolioMutation, NewPortfolioMutationVariables>(
    NEW_PORTFOLIO);
  const [mapUsers, { loading: mapUsersLoading, error: mapUsersError }] = useMutation<MapUsersToPortfolioMutation, MapUsersToPortfolioMutationVariables>(
    MAP_PORTFOLIO_USERS);
  const [mapAccounts, { loading: mapAccountsLoading, error: mapAccountsError }] = useMutation<MapAccountsToPortfolioMutation, MapAccountsToPortfolioMutationVariables>(
    MAP_PORTFOLIO_ACCOUNTS);
  const [mapBrands, { loading: mapBrandsLoading, error: mapBrandsError }] = useMutation<MapBrandsToPortfolioMutation, MapBrandsToPortfolioMutationVariables>(
    MAP_PORTFOLIO_BRANDS);

  const { data, loading, error } = useQuery<PortfolioQuery, PortfolioQueryVariables>(PORTFOLIO_DETAILS,
    {
      variables: {
        portfolioId
      },
      skip: isNew,
    });
  if (error) showBoundary(error);

  useEffect(() => {
    if (!isNew && data) {
      console.debug('[PortfolioDetails.useEffect] data', data);
      setPortfolio(data.portfolio as Portfolio);
    }
  }, [data, isNew]);

  function handleInputChange(e: any) {
    const { name, value } = e.target;
    setPortfolio({
      ...portfolio,
      [name]: value,
    });
  }

  function createPortfolio() {
    console.debug('[PortfolioDetails.createPortfolio] args');
    newPortfolio({
      variables: {
        portfolio: {
          name: portfolio.name as string,
          description: portfolio.description as string,
          brandIds: portfolio.brands?.map(b => b ? b.id : null) || [],
          accountIds: portfolio.accounts?.map(a => a ? a.id : null) || [],
          userIds: portfolio.users?.map(u => u ? u.id : null) || [],
        }
      },
      refetchQueries: [{
        query: LIST_PORTFOLIOS
      }],
      onCompleted: (data: NewPortfolioMutation) => {
        console.debug('[PortfolioDetails.createPortfolio]  completed', data);
        navigate(-1);
      },
      onError: (error: ApolloError) => {
        console.error('[PortfolioDetails.createPortfolio] error', error);
        if (error) showBoundary(error);
      }
    });
  }

  function updatePortfolio() {
    alert('[PortfolioDetails.updatePortfolio] Method not implemented.');
    navigate(-1);
  }


  function onFormSubmit() {
    console.debug('[PortfolioDetails.onFormSubmit] portfolio', portfolio);
    if (isNew) {
      createPortfolio();
    } else {
      updatePortfolio();
    }
  }

  function chosenUsers(users: User[]) {
    console.debug('[PortfolioDetails.chosenUsers]', users);

    setPortfolio({
      ...portfolio,
      users: users
    });
    if (!isNew) {
      mapUsers({
        variables: {
          portfolioId: portfolio.id as string,
          userIds: users.map(u => u.id),
        },
        refetchQueries: [{
          query: PORTFOLIO_DETAILS,
          variables: {
            portfolioId: portfolio.id
          }
        }],
        onCompleted: (data: NewPortfolioMutation) => {
          console.debug('[PortfolioDetails.chosenUsers]  completed', data);
        },
        onError: (error: ApolloError) => {
          console.error('[PortfolioDetails.chosenUsers] error', error);
          if (error) showBoundary(error);
        }
      });
    }
  }

  function chosenBrands(brands: Brand[]) {
    console.debug('[PortfolioDetails.chosenBrands]', brands);
    setPortfolio({
      ...portfolio,
      brands: brands,
    });
    if (!isNew) {
      mapBrands({
        variables: {
          portfolioId: portfolio.id as string,
          brandIds: brands.map(b => b.id),
        },
        refetchQueries: [{
          query: PORTFOLIO_DETAILS,
          variables: {
            portfolioId: portfolio.id
          }
        }],
        onCompleted: (data: NewPortfolioMutation) => {
          console.debug('[PortfolioDetails.chosenBrands]  completed', data);

        },
        onError: (error: ApolloError) => {
          console.error('[PortfolioDetails.chosenBrands] error', error);
          if (error) showBoundary(error);
        }
      });
    }
  }

  function chosenAccounts(accounts: Account[]) {
    console.debug('[PortfolioDetails.chosenAccounts]', accounts);
    setPortfolio({
      ...portfolio,
      accounts: accounts,
    });
    if (!isNew) {
      mapAccounts({
        variables: {
          portfolioId: portfolio.id as string,
          accountIds: accounts.map(a => a.id),
        },
        refetchQueries: [{
          query: PORTFOLIO_DETAILS,
          variables: {
            portfolioId: portfolio.id
          }
        }],
        onCompleted: (data: NewPortfolioMutation) => {
          console.debug('[PortfolioDetails.chosenAccounts]  completed', data);

        },
        onError: (error: ApolloError) => {
          console.error('[PortfolioDetails.chosenAccounts] error', error);
          if (error) showBoundary(error);
        }
      });
    }

  }
  console.debug('[PortfolioDetails] portfolio', portfolio);
  return (
    <Card elevation={6}
    >
      <CardHeader
        title={`Portfolio: ${portfolioId}`} />
      <CardActions >
        {isNew && <Button type="submit" variant='contained' onClick={onFormSubmit}>Create</Button>}
      </CardActions>
      <CardContent

        component="form"
        noValidate
        autoComplete="off"
      >
        {!isNew && <UsersModified portfolioId={portfolio.id as string} />}
        {!isNew && <BrandsModified portfolioId={portfolio.id as string} />}
        {!isNew && <AccountsModified portfolioId={portfolio.id as string} />}
        {(loading || createLoading || mapUsersLoading) && <LinearProgress variant="query" />}
        <Stack spacing={2}>
          <TextField
            label="Name"
            name="name"
            id='name'
            value={portfolio.name}
            onChange={handleInputChange}
            size='small'
          />
          <TextField
            rows={5}
            multiline
            label="Description"
            name='description'
            id='description'
            value={portfolio.description as string}
            onChange={handleInputChange}
          />
          <UserChooser selectedValues={portfolio.users as User[]} chosenUsers={chosenUsers} />
          <AccountChooser selectedValues={portfolio.accounts as Account[]} chosenAccounts={chosenAccounts} />
          <BrandChooser selectedValues={portfolio.brands as Brand[]} chosenBrands={chosenBrands} />
        </Stack>
      </CardContent>
    </Card>
  );
}

export function UsersModified(props: { portfolioId: string; }) {
  const { data } = useSubscription<PortfolioUsersModifiedSubscription, PortfolioUsersModifiedSubscriptionVariables>(PORTFOLIO_USERS_MODIFIED,
    {
      variables: {
        portfolioId: props.portfolioId
      }
    });
  const [state, setState] = useState({ open: false, message: '' });
  useMemo(() => {
    if (data) {
      console.log('***', data);
      setState({ open: true, message: `Users for ${data?.portfolioUsersModified?.name} modified at ${new Date().toLocaleString()}` });
    }
  }, [data]);
  function onClose() {
    setState({ open: false, message: '' });
  }
  console.debug('[UsersModified] data props', data, props);
  return (
    <Snackbar open={state.open}
      autoHideDuration={SNACKBAR_AUTOHIDE_DURATION}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Alert onClose={onClose}>
        <AlertTitle>{state.message} </AlertTitle>
      </Alert>
    </Snackbar >
  );
}

export function BrandsModified(props: { portfolioId: string; }) {
  const { data } = useSubscription<PortfolioBrandsModifiedSubscription, PortfolioBrandsModifiedSubscriptionVariables>(PORTFOLIO_BRANDS_MODIFIED,
    {
      variables: {
        portfolioId: props.portfolioId
      }
    });
  const [state, setState] = useState({ open: false, message: '' });
  useMemo(() => {
    if (data) {
      console.log('***', data);
      setState({ open: true, message: `Brands for ${data?.portfolioBrandsModified?.name} modified at ${new Date().toLocaleString()}` });
    }
  }, [data]);
  function onClose() {
    setState({ open: false, message: '' });
  }
  console.debug('[BrandsModified] data props', data, props);
  return (
    <Snackbar open={state.open}
      autoHideDuration={SNACKBAR_AUTOHIDE_DURATION}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Alert onClose={onClose}>
        <AlertTitle>{state.message} </AlertTitle>
      </Alert>
    </Snackbar >
  );
}

export function AccountsModified(props: { portfolioId: string; }) {
  const { data } = useSubscription<PortfolioAccountsModifiedSubscription, PortfolioAccountsModifiedSubscriptionVariables>(PORTFOLIO_ACCOUNTS_MODIFIED,
    {
      variables: {
        portfolioId: props.portfolioId
      }
    });
  const [state, setState] = useState({ open: false, message: '' });
  useMemo(() => {
    if (data) {
      console.log('***', data);
      setState({ open: true, message: `Accounts for ${data?.portfolioAccountsModified?.name} modified at ${new Date().toLocaleString()}` });
    }
  }, [data]);
  function onClose() {
    setState({ open: false, message: '' });
  }
  console.debug('[AccountsModified] data props', data, props);
  return (
    <Snackbar open={state.open}
      autoHideDuration={SNACKBAR_AUTOHIDE_DURATION}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Alert onClose={onClose}>
        <AlertTitle>{state.message} </AlertTitle>
      </Alert>
    </Snackbar >
  );
}