
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { ACCOUNTS_LIST, ACCOUNT_NEW, ACCOUNT_DETAILS, MAP_ACCOUNT_RETAILERS, AccountFee } from 'not-dsp-graphql';
import {
  Accordion, AccordionDetails, AccordionSummary,
  TextField, Typography, LinearProgress, Stack, Paper,
  Button, FormLabel, MenuItem, Select, FormControl, Card, CardContent, CardHeader, CardActions, Divider,
} from '@mui/material';

import { CampaignList } from './CampaignList';
import {
  Account, AccountQuery, AccountQueryVariables,
  AccountType, NewAccountMutation, NewAccountMutationVariables,
  CurrencyCode, NewAccount, Country, Retailer, MapAccountRetailersMutation, MapAccountRetailersMutationVariables
} from 'not-dsp-graphql';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useMemo, useState } from 'react';

import CountriesChooser from './CountriesChooser';
import { RetailersChooser } from './RetailersChooser';
import { ErrorNofification } from './error/ErrorBoundary';
import { AccountFees } from './AccountFees';
import { useErrorBoundary } from 'react-error-boundary';




export function AccountDetails() {
  const params = useParams();
  const { showBoundary } = useErrorBoundary();
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

  console.debug('[AccountDetails] params', params);


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
    console.debug('useEffect', params.accountId);
    if (!isNew) {
      setAccountId(params.accountId as string);
    }
  }, [params.accountId]);

  console.debug('[AccountDetails] data, isNew, accountId', data, isNew, accountId);
  console.debug('[AccountDetails] createData', createData);
  console.debug('[AccountDetails] mappedRetailers, mappedLoading, mappedError', mappedRetailers, mappedLoading, mappedError);

  useEffect(() => {
    if (data && data.account) {
      console.debug('account data', data);
      setAccount(data.account as Account);

    }
  }, [data]);

  function updateAccount() {
    console.debug('updating account', account);
  }

  function newAccount(account: NewAccount) {
    console.debug('[AccountDetails.newAccount]', account);
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
    console.debug('submitting', account);
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

  console.debug('params', params);

  if (data && data.account) {
    console.debug('[AccountDetails] account data', data);
  }

  const countries: Country[] = useMemo(
    () => account.countries as Country[] || [] as Country[],
    [data?.account, account],
  );
  if (error) showBoundary(error);
  if (createError) showBoundary(createError);
  if (mappedError) showBoundary(mappedError);
  return (

    <Card
      elevation={6}
    >
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
        <Stack spacing={2}>
          <TextField
            variant='outlined'
            required
            id="name"
            name="name"
            label="Name"
            fullWidth
            autoComplete="name"
            value={account.name}
            onChange={handleInputChange}
            size='small'
          />
          <Stack direction="row" >
            <Select id="type" name="type" value={account.type} onChange={handleInputChange}
              size='small'
              label="Type"
              sx={{ width: '50%' }}
            >
              <MenuItem key={AccountType.Demand} value={AccountType.Demand}>Demand</MenuItem>
              <MenuItem key={AccountType.Supply} value={AccountType.Supply}>Supply</MenuItem>
            </Select>
            <Select id="currency" name="currency"
              label="Currency"
              value={account.currency?.code}
              onChange={handleInputChange}
              required
              size='small'
              sx={{ width: '50%', ml: 1 }}
            >
              {Object.values(CurrencyCode).map((currency: any) => {
                return <MenuItem key={currency} value={currency}>{currency}</MenuItem>;
              })
              }
            </Select>
          </Stack>

          {data && data.account && data.account.fee && <AccountFees fee={data.account.fee as AccountFee} />}
          <CountriesChooser
            id='account-countries'
            selectedValues={countries}
            countryChange={(countries: Country[]) => {
              console.debug('[AccountDetails] selected countries', countries);

              setAccount({
                ...account,
                countries: countries,
              });
            }}
          />
          {!isNew && <RetailersChooser id='account-retailers'
            selectedValues={account.retailers as Retailer[]}
            retailersChange={(retailers: Retailer[]) => {
              console.debug('[AccountDetails] selected retailers', retailers);

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
          />}

        </Stack>
        <Divider sx={{ mt: 1 }} />
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
            <CampaignList accountId={params.accountId} allowCreate />
          </AccordionDetails>}
        </Accordion>}

      </CardContent>
    </Card>
  );
}

