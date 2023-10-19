import {
  TextField, LinearProgress,
  Paper, Button, ButtonGroup, Stack, Alert, AlertTitle,
  Collapse, Card, CardContent, CardHeader,
  CardActions, Snackbar
} from '@mui/material';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DateRange, SingleInputDateRangeField } from '@mui/x-date-pickers-pro';
import { useNavigate, useParams } from 'react-router-dom';
import {
  LINEITEMS_ACTIVATE, LINEITEMS_PAUSE, LINEITEM_DETAILS,
  LINEITEM_LIST, LINEITEM_ACTIVATED, LINEITEM_NEW, LINEITEM_PAUSED
} from '../graphql/campaigns.graphql';
import { useMutation, useQuery, useSubscription, ApolloError } from '@apollo/client';
import {
  ActivateLineitemsMutation, BudgetType, Lineitem, LineitemActivatedSubscription,
  LineitemActivatedSubscriptionVariables, LineitemPausedSubscription, LineitemPausedSubscriptionVariables,
  LineitemQuery, LineitemQueryVariables, LineitemStatus, MutationActivateLineitemsArgs,
  MutationPauseLineitemsArgs,
  NewLineitem, NewLineitemMutation, NewLineitemMutationVariables, PauseLineitemsMutation
} from '../graphql/types';
import { useMemo, useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { SNACKBAR_AUTOHIDE_DURATION } from '../lib/utility';

export function LineitemDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const accountId = params.accountId;
  const campaignId = params.campaignId;
  const [isNew] = useState(params.lineitemId === 'new');

  const lineitemId = useMemo(() => {
    return params.lineitemId || 'new';
  }, [params.lineitemId]);

  const [lineitem, setLineitem] = useState<Lineitem>({
    id: '',
    name: '',
    status: LineitemStatus.Paused,
  });

  // Create Lineitem
  const [addLineitem] = useMutation<NewLineitemMutation, NewLineitemMutationVariables>(
    LINEITEM_NEW);


  // Lineitem details
  const { data, loading, error } = useQuery<LineitemQuery, LineitemQueryVariables>(LINEITEM_DETAILS,
    {
      variables: {
        lineitemId
      },
      skip: isNew,
    });

  useEffect(() => {
    if (data && data.lineitem) {
      console.log('[LineitemDetails] data', data);
      setLineitem({
        ...data.lineitem,
        startDate: new Date(data.lineitem.startDate || ''),
        endDate: new Date(data.lineitem.endDate || '')
      } as Lineitem);
    }
  }, [data]);

  const [activateLineitem] = useMutation<ActivateLineitemsMutation, MutationActivateLineitemsArgs>(LINEITEMS_ACTIVATE,
    {
      refetchQueries: [
        {
          query: LINEITEM_DETAILS,
          variables: {
            lineitemId
          }
        },
        {
          query: LINEITEM_LIST,
          variables: {
            limit: 100,
            offset: 0,
            campaignId: (data) ? data.lineitem?.campaign?.id : '',
          },
        }
      ],
    }
  );
  // pause Lineitem
  const [pauseLineitem] = useMutation<PauseLineitemsMutation, MutationPauseLineitemsArgs>(LINEITEMS_PAUSE,
    {
      refetchQueries: [
        {
          query: LINEITEM_DETAILS,
          variables: {
            lineitemId
          }
        },
        {
          query: LINEITEM_LIST,
          variables: {
            limit: 100,
            offset: 0,
            campaignId: (data) ? data.lineitem?.campaign?.id : '',
          },
        }
      ],
    }
  );

  function activate() {
    console.debug("[LineitemDetails.activate] lineitemId", lineitemId);
    activateLineitem({
      variables: {
        lineitemIds: [params.lineitemId as string],
      },
    });
  }

  function pause() {
    console.debug("[LineitemDetails.pause] lineitemId", lineitemId);
    pauseLineitem({
      variables: {
        lineitemIds: [params.lineitemId as string],
      },

    });
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setLineitem({
      ...lineitem,
      [name]: value,
    });
  };

  function onFormSubmit() {
    console.debug('[LineitemDetails.onFormSubmit] lineitem', lineitem);
    if (isNew) {
      createLineitem();
    } else {
      updateLineitem();
    }
  }
  function updateLineitem() {
    alert('[LineitemDetails.updateLineitem] Method not implemented.');
    navigate(-1);
  }

  function createLineitem() {
    const newLineitem: NewLineitem = {
      name: lineitem?.name || '',
      startDate: lineitem?.startDate || new Date(),
      endDate: lineitem?.endDate || new Date(),
      budget: {
        amount: 0,
        isCapped: false,
        type: BudgetType.Total
      },
      pages: []
    };
    console.debug('[LineitemDetails.createLineitem] newLineitem', newLineitem, campaignId, accountId);
    addLineitem({
      mutation: LINEITEM_NEW,
      variables: {
        campaignId: campaignId as string,
        lineitem: newLineitem
      },
      refetchQueries: [{
        query: LINEITEM_LIST,
      }],
      onCompleted: (data: NewLineitemMutation) => {
        console.debug('[LineitemDetails.createLineitem]  completed', data);
        setLineitem(data?.newLineitem as Lineitem);
        navigate(-1);
      },
      onError: (error: ApolloError) => {
        alert(`[LineitemDetails.createLineitem] error: ${error} `);
        console.error('[LineitemDetails.createLineitem] error', error);
      }
    });

  }
  const dates: DateRange<Dayjs> = [dayjs(lineitem.startDate || new Date()), dayjs(lineitem.endDate || new Date())];

  console.log('[LineitemDetails] params data', params, data);
  return (
    <Paper square={false}
      elevation={6}
      sx={{
        '& .MuiTextField-root': { m: 1, width: '50ch' },
      }}
    >
      <Card >
        <CardHeader
          title={`Lineitem: ${lineitemId}`}
          subheader={`for campaign: ${(data) ? data.lineitem?.campaign?.name : ''}`}
        />
        <CardActions>
          <ButtonGroup variant="contained" aria-label="activation-group">
            <Button type='submit'>{isNew ? 'Create' : 'Save'}</Button>
            {!isNew && <Button onClick={activate}>Activate</Button>}
            {!isNew && <Button onClick={pause} >Pause</Button>}
          </ButtonGroup>
        </CardActions>
        <CardContent component="form"
          onSubmit={onFormSubmit}
          noValidate
          autoComplete="off"
        >
          {!isNew && <LineItemActivated lineitemId={lineitem.id} />}
          {!isNew && <LineItemPaused lineitemId={lineitem.id} />}
          {loading && <LinearProgress variant="query" />}
          {error && <p>Error: {error.message}</p>}

          <Stack>
            <TextField
              label="Name"
              name="name"
              id='name'
              value={lineitem.name}
              onChange={handleInputChange} />
            <TextField
              name='status'
              id='status'
              label="Status"
              value={lineitem.status}
              InputProps={{
                readOnly: true,
              }}
            />
            <DateRangePicker
              label="Start - End"
              slots={{ field: SingleInputDateRangeField }}
              localeText={{ start: 'start date', end: 'end date' }}
              value={dates}
              onChange={(newValue: DateRange<Dayjs>) => {
                console.log('[LineitemDetails] new DateRange', newValue);
                const startDate = newValue[0]?.toDate();
                const endDate = newValue[1]?.toDate();
                setLineitem({
                  ...lineitem,
                  startDate: startDate,
                  endDate: endDate
                });
              }}
            />

            <TextField
              label="Budget"
              value={(lineitem.budget) ? lineitem.budget.amount : 0}
              type='number' />
          </Stack>
        </CardContent>
      </Card>
    </Paper >
  );
}

export function LineItemActivated(props: { lineitemId: string; }) {
  // Lineitem Activation
  const { data: activated } = useSubscription<LineitemActivatedSubscription, LineitemActivatedSubscriptionVariables>(LINEITEM_ACTIVATED,
    {
      variables: {
        lineitemId: props.lineitemId
      }
    });
  const [state, setState] = useState({ open: false, message: '' });
  useMemo(() => {
    if (activated) {
      setState({ open: true, message: activated?.lineitemActivated.name + ' activated at ' + new Date().toLocaleString() });
    }
  }, [activated]);

  function onClose() {
    setState({ open: false, message: '' });
  }

  console.log('[LineItemActivated] activated', activated);


  return (
    <Snackbar open={state.open}
      autoHideDuration={SNACKBAR_AUTOHIDE_DURATION}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Alert onClose={onClose} severity='success'>
        <AlertTitle>Lineitem {state.message} </AlertTitle>
      </Alert>
    </Snackbar >
  );
}


export function LineItemPaused(props: { lineitemId: string; }) {
  // Lineitem Paused
  const { data: paused } = useSubscription<LineitemPausedSubscription, LineitemPausedSubscriptionVariables>(LINEITEM_PAUSED,
    {
      variables: {
        lineitemId: props.lineitemId
      }
    });
  const [state, setState] = useState({ open: false, message: '' });
  useMemo(() => {
    if (paused) {
      setState({ open: true, message: paused?.lineitemPaused.name + ' paused at ' + new Date().toLocaleString() });
    }
  }, [paused]);
  function onClose() {
    setState({ open: false, message: '' });
  }


  console.log('[LineItemPaused] paused', paused);

  return (
    <Snackbar open={state.open}
      autoHideDuration={SNACKBAR_AUTOHIDE_DURATION}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Alert onClose={onClose}>
        <AlertTitle>Lineitem {state.message} </AlertTitle>
      </Alert>
    </Snackbar >
  );
}

