import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router';
import { LINEITEMS_ACTIVATE, LINEITEM_LIST, LINEITEMS_PAUSE } from 'not-dsp-graphql';
import { DataGrid, GridColDef, GridRowSelectionModel, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Button, ButtonGroup, Card, CardContent, CardHeader, Paper, Typography } from '@mui/material';
import {
  MutationActivateLineitemsArgs, LineitemsQuery,
  LineitemsQueryVariables, Scalars, ActivateLineitemsMutation
} from 'not-dsp-graphql';
import { dateFormatter } from '../lib/utility';
import { useEffect, useState } from 'react';
import { LIMIT_DEFAULT } from '../lib/ListDefaults';
import { ErrorNofification } from './error/ErrorBoundary';


const columns: GridColDef[] = [
  // { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 110,
  },
  {
    field: 'startDate',
    headerName: 'Start Date',
    width: 110,
    valueGetter: (params: GridValueGetterParams) => dateFormatter(params.row.startDate)
  },
  {
    field: 'endDate',
    headerName: 'End Date',
    width: 110,
    valueGetter: (params: GridValueGetterParams) => dateFormatter(params.row.endDate)
  },
  {
    field: 'budget',
    headerName: 'Budget',
    type: 'number',
    width: 110,
    valueGetter: (params: GridValueGetterParams) => (params.row.budget) ? params.row.budget.amount : 0,
  },
];

export interface LineitemListProps {
  campaignId?: Scalars['ID'];
}

export function LineitemList(props: LineitemListProps) {
  const params = useParams();
  const navigate = useNavigate();

  // const accountId = params.accountId;
  // const campaignId = params.campaignId;

  const [selection, setSelection] = useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: LIMIT_DEFAULT,
  });
  const { data, error, loading } = useQuery<LineitemsQuery, LineitemsQueryVariables>(LINEITEM_LIST, {
    variables: {
      campaignId: (props.campaignId) ? props.campaignId : (params.campaignId) ? params.campaignId : 'no-id',
      offset: paginationModel.page * paginationModel.pageSize,
      limit: paginationModel.pageSize
    }
  });
  // activate Lineitems
  const [activateLineitems] = useMutation<ActivateLineitemsMutation, MutationActivateLineitemsArgs>(LINEITEMS_ACTIVATE,
    {
      variables: {
        lineitemIds: selection.map((s) => s.toString()),
      },
      refetchQueries: [
        {
          query: LINEITEM_LIST,
          variables: {
            campaignId: (props.campaignId) ? props.campaignId : (params.campaignId) ? params.campaignId : 'no-id',
            offset: paginationModel.page * paginationModel.pageSize,
            limit: paginationModel.pageSize
          },
        },
      ],
    }
  );
  // pause Lineitems
  const [pauseLineitems] = useMutation<ActivateLineitemsMutation, MutationActivateLineitemsArgs>(LINEITEMS_PAUSE,
    {

      refetchQueries: [
        {
          query: LINEITEM_LIST,
          variables: {
            campaignId: (props.campaignId) ? props.campaignId : (params.campaignId) ? params.campaignId : 'no-id',
            offset: paginationModel.page * paginationModel.pageSize,
            limit: paginationModel.pageSize
          },
        },
      ],
    }
  );
  const [rowCountState, setRowCountState] = useState(
    data?.lineitems?.totalCount || 0,
  );
  useEffect(() => {
    setRowCountState((prevRowCountState: any) =>
      (data?.lineitems?.totalCount)
        ? data?.lineitems?.totalCount
        : prevRowCountState,
    );
  }, [data?.lineitems?.totalCount, setRowCountState]);






  function activate() {
    console.debug("[LineitemListComponent.activate]", selection);
    activateLineitems({
      variables: {
        lineitemIds: selection.map((s) => s.toString()),
      }
    });
  }

  function pause() {
    console.debug("[LineitemListComponent.pause]", selection);
    pauseLineitems({
      variables: {
        lineitemIds: selection.map((s) => s.toString()),
      }
    });
  }
  function selectionCanged(selection: GridRowSelectionModel) {
    console.debug("[LineitemListComponent.selectionCanged]", selection);
    setSelection(selection);
  }

  function addLineitem() {
    navigate(`lineitems/new`);
  }

  console.log('Lineitem list', params, data);
  return (
    <Card elevation={6}>
      <CardHeader title={'Lineitems'} />
      <CardHeader subheader={'Click on a Lineitem to see details'} />

      <CardContent >
        {error && <ErrorNofification error={error} />}
        <ButtonGroup variant="contained" aria-label="activation-group">
          <Button onClick={addLineitem}>New</Button>
          <Button onClick={activate}>Activate</Button>
          <Button onClick={pause}>Pause</Button>
        </ButtonGroup>
        <DataGrid
          rows={(data?.lineitems) ? data?.lineitems?.lineitems : [] as any}
          columns={columns}
          loading={loading}
          rowCount={rowCountState}
          pageSizeOptions={[LIMIT_DEFAULT]}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          checkboxSelection
          onRowClick={(row) => {
            navigate(`lineitems/${row.row.id}`);
          }
          }
          onRowSelectionModelChange={selectionCanged}
        />
      </CardContent>
    </Card>
  );
}

