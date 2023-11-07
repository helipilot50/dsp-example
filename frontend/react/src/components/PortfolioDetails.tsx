import { Button, Card, CardActions, CardContent, CardHeader, FormControl, FormLabel, LinearProgress, Stack, TextField } from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import React, { useMemo, useState } from 'react';
import { ErrorNofification } from './error/ErrorBoundary';
import { useNavigate, useParams } from 'react-router-dom';
import { Account, Brand, LIST_PORTFOLIOS, NEW_PORTFOLIO, NewPortfolioMutation, NewPortfolioMutationVariables, PORTFOLIO_DETAILS, Portfolio, PortfolioQuery, PortfolioQueryVariables, User } from 'not-dsp-graphql';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { UserChooser } from './UserChooser';
import { AccountChooser } from './AccountChooser';
import { BrandChooser } from './BrandChooser';

export function PortfolioDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const [isNew] = useState(params.portfolioId === 'new');
  const portfolioId = useMemo(() => {
    return params.portfolioId || 'new';
  }, [params.portfolioId]);
  const [portfolio, setPortfolio] = useState<Portfolio>({
    id: '',
    name: '',
    description: '',
    users: [],
    brands: [],
    accounts: [],
  });

  const [newPortfolio, { loading: createLoading, error: createError }] = useMutation<NewPortfolioMutation, NewPortfolioMutationVariables>(
    NEW_PORTFOLIO);

  const { data, loading, error } = useQuery<PortfolioQuery, PortfolioQueryVariables>(PORTFOLIO_DETAILS,
    {
      variables: {
        portfolioId
      },
      skip: isNew,
    });

  function createPortfolio() {

    console.log('[PortfolioDetails.createPortfolio] args');
    newPortfolio({
      variables: {
        name: 'New Portfolio',
        description: 'New Portfolio Description',
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
    console.log('[PortfolioDetails.chosenUsers]', users);
    setPortfolio({
      ...portfolio,
      users: users,
    });
  }

  function chosenBrands(brands: Brand[]) {
    console.log('[PortfolioDetails.chosenBrands]', brands);
    setPortfolio({
      ...portfolio,
      brands: brands,
    });
  }

  function chosenAccounts(accounts: Account[]) {
    console.log('[PortfolioDetails.chosenAccounts]', accounts);
    setPortfolio({
      ...portfolio,
      accounts: accounts,
    });
  }

  return (
    <Card elevation={6}
      sx={{
        '& .MuiTextField-root': { m: 1, width: '50ch' },
      }}>
      <CardHeader
        title={`Portfolio: ${portfolioId}`} />
      <CardActions sx={{ ml: 2 }}>
        {isNew && <Button type="submit" variant='contained' onClick={onFormSubmit}>Create</Button>}
      </CardActions>
      <CardContent
        component="form"
        noValidate
        autoComplete="off"
      >
        {(loading || createLoading) && <LinearProgress variant="query" />}
        {error && <ErrorNofification error={error} />}
        {createError && <ErrorNofification error={createError} />}
        {/* {mappedError && <ErrorNofification error={mappedError} />} */}
        <Stack>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <TextField
              name="name"
              id='name'
              value={portfolio.name}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <TextareaAutosize minRows={5}
              name='description'
              id='description'
              defaultValue={portfolio.description as string}

            />
          </FormControl>
          <FormControl>
            <FormLabel>Users</FormLabel>
            <UserChooser selectedValues={portfolio.users as User[]} chosenUsers={chosenUsers} />
          </FormControl>
          <FormControl>
            <FormLabel>Accounts</FormLabel>
            <AccountChooser selectedValues={portfolio.accounts as Account[]} chosenAccounts={chosenAccounts} />
          </FormControl>
          <FormControl>
            <FormLabel>Brands</FormLabel>
            <BrandChooser selectedValues={portfolio.brands as Brand[]} chosenBrands={chosenBrands} />
          </FormControl>
        </Stack>
      </CardContent>
    </Card>
  );
}
