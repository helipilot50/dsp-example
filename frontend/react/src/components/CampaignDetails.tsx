import {
  Accordion, AccordionDetails, AccordionSummary, Box, Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  LinearProgress, MenuItem, Paper,
  Stack, TextField, Typography,
} from '@mui/material';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DateRange, SingleInputDateRangeField } from '@mui/x-date-pickers-pro';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CAMPAIGNS_LIST, CAMPAIGN_DETAILS, CAMPAIGN_NEW } from 'not-dsp-graphql';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { LineitemList } from './LineitemList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  NewCampaign,
  NewCampaignMutation, NewCampaignMutationVariables,
  Campaign, CampaignType, CampaignStatus, BudgetType
} from 'not-dsp-graphql';
import dayjs, { Dayjs } from 'dayjs';
import { ErrorNofification } from './error/ErrorBoundary';
import { useErrorBoundary } from 'react-error-boundary';

export function CampaignDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();

  const [isNew] = useState(params['campaignId'] === 'new');
  const [campaignId] = useState(params.campaignId || 'new');
  // campaign state
  const [campaign, setCampaign] = useState<Campaign>({
    id: '',
    name: '',
    type: CampaignType.CommerceDisplay,
    status: CampaignStatus.Inactive,
  });
  const accountId = useMemo(() => {
    return params.accountId as string;
  }, [params.accountId]);

  // Create Campaign
  const [addCampaign, { error: createError }] = useMutation<NewCampaignMutation, NewCampaignMutationVariables>(
    CAMPAIGN_NEW);

  // Fetch Campaign
  const { data, loading, error } = useQuery(CAMPAIGN_DETAILS,
    {
      variables: {
        campaignId: campaignId
      },
      skip: isNew,
    });

  useEffect(() => {
    if (data && data.campaign) {
      console.debug('[CampaignDetails] data', data);
      setCampaign({
        ...data.campaign,
        startDate: new Date(data.campaign.startDate),
        endDate: new Date(data.campaign.endDate),
      } as Campaign);
    }
  }, [data]);

  function updateCampaign() {
    console.debug('[CampaignDetails.updateCampaign] updating ', campaignId);
  }

  function newCampaign(newCampaign: NewCampaign) {
    console.debug('[CampaignDetails.newCampaign]', newCampaign);
    addCampaign({
      variables: {
        advertiserId: accountId,
        campaign: newCampaign
      },
      refetchQueries: [{
        query: CAMPAIGNS_LIST,
        variables: {
          advertiserId: accountId,
        }
      }],
      onCompleted: (data: NewCampaignMutation) => {
        console.debug('[CampaignDetails.newCampaign]  completed', data);
        setCampaign(data?.newCampaign as Campaign);
        navigate(-1);
      },
      onError: (error: ApolloError) => {
        alert(`[CampaignDetails.newCampaign] error: ${error} `);
        console.error('[CampaignDetails.newCampaign] error', error);
      }
    });
  }

  function onSubmit(e: any) {
    e.preventDefault();
    console.debug('[CampaignDetails.onSubmit] submitting', campaign, isNew);
    if (isNew) {

      const aNewCampaign: NewCampaign = {
        name: campaign.name || '',
        startDate: campaign.startDate || new Date(),
        endDate: campaign.endDate || new Date(),
        type: campaign.type,
        budget: {
          isCapped: false,
          type: BudgetType.Total,
          amount: 0
        }
      };
      newCampaign(aNewCampaign);
    } else {
      updateCampaign();
    }
  }

  const handleInputChange = (e: any) => {
    const { id, name, value } = e.target;
    setCampaign({
      ...campaign,
      [(name) ? name : id]: value,
    });
  };

  if (error) showBoundary(error);
  if (createError) showBoundary(createError);
  console.debug('[CampaignDetails] campaign', campaign);
  const dates: DateRange<Dayjs> = [dayjs(campaign.startDate || new Date()), dayjs(campaign.endDate || new Date())];
  return (
    <Paper square={false}
      elevation={6}>
      <Card>
        <CardHeader
          title={`Campaign: ${(data) ? data.campaign.id : ''}`}
        />
        <CardActions>
          <Button type="submit" variant='contained'>{isNew ? 'Create' : 'Save'}</Button>
        </CardActions>
        <CardContent component="form"
          onSubmit={onSubmit}
          noValidate
          autoComplete="off">
          {loading && <LinearProgress variant="query" />}

          <Stack spacing={1} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              name='name'
              id="name"
              fullWidth
              required
              value={campaign.name}
              onChange={handleInputChange}
              size='small' />
            <Stack direction="row"  >
              <TextField id="type" name="type"
                select
                value={campaign.type}
                onChange={handleInputChange}
                label="Type"
                required
                size='small'
                sx={{ width: '50%' }}
              >
                {Object.values(CampaignType).map((type: any) => {
                  return <MenuItem key={type} value={type}>{type.toString()}</MenuItem>;
                })
                }
              </TextField>
              {!isNew && <TextField id="status" name="status"
                select
                value={campaign.status}
                onChange={handleInputChange}
                label="Status"
                required
                size='small'
                sx={{ width: '50%', ml: 1 }}
              >
                {Object.values(CampaignStatus).map((status: any) => {
                  return <MenuItem key={status} value={status}>{status.toString()}</MenuItem>;
                })
                }
              </TextField>}
            </Stack>
            <DateRangePicker
              slots={{ field: SingleInputDateRangeField }}
              label="Start - End"
              localeText={{ start: 'start date', end: 'end date' }}
              value={dates}
              onChange={(newValue: DateRange<Dayjs>) => {
                console.debug('[LineitemDetails] new DateRange', newValue);
                const startDate = newValue[0]?.toDate();
                const endDate = newValue[1]?.toDate();
                setCampaign({
                  ...campaign,
                  startDate: startDate,
                  endDate: endDate
                });
              }}
            />
            {!isNew && <TextField
              label="Budget"
              value={campaign.budget?.amount || 0}
              type='number'
              onChange={handleInputChange}
              size='small' />}
          </Stack>
          {!isNew && <Accordion sx={{ mt: 1 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Lineitems</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <LineitemList campaignId={params.campaignId} />
            </AccordionDetails>
          </Accordion>}
        </CardContent>
      </Card>
    </Paper>
  );
}
