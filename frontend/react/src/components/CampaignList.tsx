import { useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router';
import { CAMPAIGNS_LIST } from '../graphql/campaigns.graphql';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Button, Paper, Typography } from '@mui/material';
import { dateFormatter } from '../lib/utility';
import { CampaignsQuery, CampaignsQueryVariables, CampaignList as Campaigns } from '../graphql/types';
import { LIMIT_DEFAULT, OFFSET_DEFAULT } from '../lib/ListDefaults';
import { useEffect, useState } from 'react';
import { ErrorNofification } from './error/ErrorBoundary';


const columns: GridColDef[] = [
  // { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
    valueGetter: (params: GridValueGetterParams) => params.row.name
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 150,
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
  // {
  //   field: 'budget.amount',
  //   headerName: 'Budget',
  //   type: 'number',
  //   width: 110,
  //   valueGetter: (params: GridValueGetterParams) => params.row.budget.amount,
  // },
];

export interface CampaignListProps {
  accountId?: string;
  retailerId?: string;
}
export function CampaignList(props: CampaignListProps) {
  const params = useParams();
  const navigate = useNavigate();
  const [campaignList, setCampaignList] = useState<Campaigns>({ campaigns: [], page: OFFSET_DEFAULT, size: LIMIT_DEFAULT, totalCount: LIMIT_DEFAULT });
  const { data, error, loading, fetchMore } = useQuery<CampaignsQuery, CampaignsQueryVariables>(CAMPAIGNS_LIST, {
    variables: {
      accountId: (props.accountId) ? props.accountId : (params.accountId) ? params.accountId : undefined,
      retailerId: (props.retailerId) ? props.retailerId : (params.retailerId) ? params.retailerId : undefined,
      brandId: (params.brandId) ? params.brandId : undefined,
      page: OFFSET_DEFAULT,
      size: LIMIT_DEFAULT
    },
    fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (data && data.campaigns) {
      setCampaignList({
        page: data.campaigns.page || OFFSET_DEFAULT,
        size: data.campaigns.size || LIMIT_DEFAULT,
        totalCount: data.campaigns.totalCount || LIMIT_DEFAULT,
        campaigns: data.campaigns.campaigns || []
      });
    }
  }, [data]);

  function fetchNext(offset: number, limit: number) {
    console.debug("[CampaignList.fetchNext]",
      offset, limit);
    fetchMore({
      variables: {
        offset,
        limit
      },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        if (!fetchMoreResult) return prev;
        console.debug("[CampaignList.fetchNext.updateQuery]",
          prev,
          fetchMoreResult);
        setCampaignList({
          page: fetchMoreResult.campaignList.offset || campaignList.page,
          size: fetchMoreResult.campaignList.limit || campaignList.size,
          totalCount: fetchMoreResult.campaignList.totalCount || campaignList.totalCount,
          campaigns: fetchMoreResult.campaignList.brands || []
        });
      }
    });
    return;
  }


  console.log('[CampaignList] result', data, error, loading);
  console.log('[CampaignList] pagination', campaignList);
  return (
    <Paper square={false}
      elevation={6}>
      {error && <ErrorNofification error={error} />}
      <Box m={2}>
        <Typography variant="h6" gutterBottom>Click on a Campaign to see details</Typography>
        <Button variant='contained' onClick={() => navigate(`campaigns/new`)}>New Campaign</Button>
        <DataGrid
          rows={(campaignList.campaigns) ? campaignList.campaigns : []}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: LIMIT_DEFAULT,
                page: OFFSET_DEFAULT
              },
            },
          }}
          pageSizeOptions={[LIMIT_DEFAULT]}
          paginationMode="server"
          onPaginationModelChange={({ pageSize, page }) => {
            console.debug("[CampaignList.onPaginationModelChange]", page, pageSize);
            fetchNext(pageSize * page, pageSize);
          }}
          checkboxSelection
          onRowClick={(row) => {
            navigate(`campaigns/${row.row.id}`);
          }
          }
        />
      </Box>
    </Paper>
  );
}

