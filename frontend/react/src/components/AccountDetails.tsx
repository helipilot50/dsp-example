
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { ACCOUNTS_LIST, ACCOUNT_NEW, ACCOUNT_DETAILS, MAP_ACCOUNT_RETAILERS } from '../graphql/accounts.graphql';
import {
  Accordion, AccordionDetails, AccordionSummary,
  TextField, Typography, LinearProgress, Stack, Paper,
  Button, FormLabel, MenuItem, Select, FormControl, Card, CardContent, CardHeader, CardActions,
} from '@mui/material';

import { CampaignList } from './CampaignList';
import {
  Account, AccountQuery, AccountQueryVariables,
  AccountType, NewAccountMutation, NewAccountMutationVariables,
  CurrencyCode, NewAccount, Country, Retailer, MapAccountRetailersMutation, MapAccountRetailersMutationVariables
} from '../graphql/types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useMemo, useState } from 'react';

import CountriesChooser from './CountriesChooser';
import { RetailersChooser } from './RetailersChooser';
import { ErrorNofification } from './error/ErrorBoundary';




export function AccountDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const [isNew] = useState(params['accountId'] === undefined);
  const [accountId, setAccountId] = useState(params.accountId || 'new');
  // account state
  const [account, setAccount] = useState<Account>({
    id: '',
    name: '',
    type: AccountType.Demand,
    currency: {
      code: CurrencyCode.Usd,
      name: 'US Dollar',
      symbol: '$'
    }
  });

  console.log('[AccountDetails] params', params);


  // Create Account
  const [addAccount, { data: createData, loading: createLoading, error: createError }] = useMutation<NewAccountMutation, NewAccountMutationVariables>(
    ACCOUNT_NEW);

  const [mapRetailers, { data: mappedRetailers, loading: mappedLoading, error: mappedError }] = useMutation<MapAccountRetailersMutation, MapAccountRetailersMutationVariables>(MAP_ACCOUNT_RETAILERS);

  // Fetch Account
  const { data, loading, error } = useQuery<AccountQuery, AccountQueryVariables>(ACCOUNT_DETAILS, {
    fetchPolicy: 'cache-first',
    variables: {
      accountId: accountId,
    },
    skip: isNew,
  });
  useEffect(() => {
    console.log('useEffect', params.accountId);
    if (!isNew) {
      setAccountId(params.accountId as string);
    }
  }, [params.accountId]);

  console.log('[AccountDetails] data, isNew, accountId', data, isNew, accountId);
  console.log('[AccountDetails] createData', createData);
  console.log('[AccountDetails] mappedRetailers, mappedLoading, mappedError', mappedRetailers, mappedLoading, mappedError);

  useEffect(() => {
    if (data && data.account) {
      console.log('account data', data);
      setAccount(data.account as Account);

    }
  }, [data]);

  function updateAccount() {
    console.log('updating account', account);
  }

  function newAccount(account: NewAccount) {
    console.log('[AccountDetails.newAccount]', account);
    addAccount({
      variables: {
        account: account
      },
      refetchQueries: [{
        query: ACCOUNTS_LIST,
      }],
      onCompleted: (data: NewAccountMutation) => {
        console.debug('[AccountDetails.newAccount]  completed', data);
        setAccount(data?.newAccount as Account);
        navigate(-1);
      },
      onError: (error: ApolloError) => {
        alert(`[AccountDetails.newAccount] error: ${error} `);
        console.error('[AccountDetails.newAccount] error', error);
      }
    });
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setAccount({
      ...account,
      [name]: value,
    });
  };


  function onSubmit(e: any) {
    e.preventDefault();
    console.log('submitting', account);
    if (isNew) {

      newAccount({
        name: account.name,
        type: account.type || AccountType.Demand,
        currency: account.currency?.code || CurrencyCode.Usd,
        allowBrandedKeywords: false,
        countries: (account.countries) ? account.countries?.map((country: any) => country.code) : [],
      });
    } else {
      updateAccount();
    }
  }

  console.log('params', params);

  if (data && data.account) {
    console.log('[AccountDetails] account data', data);
  }

  const countries: Country[] = useMemo(
    () => account.countries as Country[] || [] as Country[],
    [data?.account, account],
  );

  return (

    <Paper square={false}
      elevation={6}
      sx={{ width: '800px', minWidth: '400px' }}
    >
      <Card>
        <CardHeader
          title={`Account: ${account.id}`} />
        <CardActions>
          {isNew && <Button type="submit" variant='contained' onClick={onSubmit}>Create</Button>}
        </CardActions>
        <CardContent
          component="form"
          noValidate
          autoComplete="off"
        >
          {(loading || createLoading) && <LinearProgress variant="query" />}
          {error && <ErrorNofification error={error} />}
          {createError && <ErrorNofification error={createError} />}
          <Stack >
            <FormControl>
              <FormLabel>Name</FormLabel>
              <TextField
                variant='outlined'
                required
                id="name"
                name="name"
                fullWidth
                autoComplete="name"
                value={account.name}
                onChange={handleInputChange}

              />
            </FormControl>
            <FormControl>
              <FormLabel>Type</FormLabel>
              <Select id="type" name="type" value={account.type} onChange={handleInputChange}
                label="Type" required
              >
                <MenuItem key={AccountType.Demand} value={AccountType.Demand}>Demand</MenuItem>
                <MenuItem key={AccountType.Supply} value={AccountType.Supply}>Supply</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Currency</FormLabel>
              <Select id="currency" name="currency"
                value={account.currency?.code}
                onChange={handleInputChange}
                label="Currency" required
              >
                {Object.values(CurrencyCode).map((currency: any) => {
                  return <MenuItem key={currency} value={currency}>{currency}</MenuItem>;
                })
                }
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Countries</FormLabel>
              <CountriesChooser
                id='account-countries'
                selectedValues={countries}
                countryChange={(countries: Country[]) => {
                  console.log('[AccountDetails] selected countries', countries);

                  setAccount({
                    ...account,
                    countries: countries,
                  });
                }}
              />
            </FormControl>
            {!isNew && <FormControl>
              <FormLabel>Retailers</FormLabel>
              <RetailersChooser id='account-retailers'
                selectedValues={account.retailers as Retailer[]}
                retailersChange={(retailers: Retailer[]) => {
                  console.log('[AccountDetails] selected retailers', retailers);

                  mapRetailers({
                    variables: {
                      accountId: accountId,
                      retailerIds: retailers.map((retailer: Retailer) => retailer.id),
                    },
                    refetchQueries: [{
                      query: ACCOUNT_DETAILS,
                      variables: {
                        accountId: accountId,
                      }
                    }],
                    onCompleted: (data: any) => {
                      console.debug('[AccountDetails.mapRetailers]  completed', data);
                      setAccount({
                        ...account,
                        retailers: retailers,
                      });
                    },
                    onError: (error: ApolloError) => {
                      alert(`[AccountDetails.mapRetailers] error: ${error} `);
                      console.error('[AccountDetails.mapRetailers] error', error);
                    }
                  });

                }}
              />
            </FormControl>}
          </Stack>

          {!isNew && <Accordion
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Campaigns</Typography>
            </AccordionSummary>
            {data?.account && <AccordionDetails>
              <CampaignList accountId={params.accountId} />
            </AccordionDetails>}
          </Accordion>}

        </CardContent>
      </Card>
    </Paper>
  );
}

