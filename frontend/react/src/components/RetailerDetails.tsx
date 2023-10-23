
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card, CardContent, CardHeader, LinearProgress,
  Paper, Stack, TextField, Typography
} from '@mui/material';
// import FormControl from '@mui/material/FormControl';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { RetailerQuery, RetailerQueryVariables } from '../graphql/types';
import { RETAILER_DETAILS } from '../graphql/retailer.graphql';
import { CampaignList } from './CampaignList';
import { ErrorNofification } from './error/ErrorBoundary';
import { AccountList } from './AccountList';

export function RetailerDetails() {
  const params = useParams();

  const { data, loading, error } = useQuery<RetailerQuery, RetailerQueryVariables>(RETAILER_DETAILS,
    {
      variables: {
        retailerId: params.retailerId || 'no-id',
      }
    });

  console.log('params', params);
  return (
    <Paper square={false}
      elevation={6}
      sx={{
        '& .MuiTextField-root': { m: 1, width: '55ch' },
      }}>
      <Card>
        <CardHeader
          title={'Retailer'}
        />
        <CardContent
          component="form"
          noValidate
          autoComplete="off"
        >
          {loading && <LinearProgress variant="query" />}
          {error && <ErrorNofification error={error} />}
          <Stack >
            <TextField
              label="ID"
              value={(data && data.retailer) ? data?.retailer?.id : ''}
              InputProps={{
                readOnly: true,
              }} />
            <TextField
              label="Name"
              value={(data && data.retailer) ? data?.retailer?.name : ''} />
            <TextField
              label="Status"
              value={(data && data.retailer) ? data?.retailer?.status : ''}
              InputProps={{
                readOnly: true,
              }} />
            <TextField
              label="Country of Origin"
              value={(data && data.retailer) ? data?.retailer?.countryOfOrigin : ''}
              InputProps={{
                readOnly: true,
              }} />
            <TextField
              label="Ranking"
              value={(data && data.retailer) ? data?.retailer?.rank : ''}
              InputProps={{
                readOnly: true,
              }} />
            <TextField
              label="Retail Revenue (m) USD"
              value={(data && data.retailer) ? data?.retailer?.retailRevenue : ''}
              InputProps={{
                readOnly: true,
              }} />
            <TextField
              label="Operational Format"
              value={(data && data.retailer) ? data?.retailer?.operationalFormat : ''}
              InputProps={{
                readOnly: true,
              }} />
            <TextField
              label="Number countries of operation"
              value={(data && data.retailer) ? data?.retailer?.countriesOfOperation : ''}
              InputProps={{
                readOnly: true,
              }} />
          </Stack>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="campaigns-content"
              id="campaigns-header"
            >
              <Typography>Campaigns</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <CampaignList retailerId={params.retailerId} />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="accounts-content"
              id="accounts-header"
            >
              <Typography>Accounts</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <AccountList retailerId={params.retailerId} />
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    </Paper >
  );
}
