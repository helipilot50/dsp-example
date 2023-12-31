import {
  RetailersQuery,
  RetailersQueryVariables,
  RetailerList as Retailers,
} from 'not-dsp-graphql';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Card, CardContent, CardHeader } from '@mui/material';
import { QueryResult, useQuery } from '@apollo/client';
import { RETAILER_LIST } from 'not-dsp-graphql';
import { useEffect, useState } from 'react';
import { LIMIT_DEFAULT, OFFSET_DEFAULT } from '../lib/ListDefaults';
import { ErrorNofification } from './error/ErrorBoundary';
import { useErrorBoundary } from 'react-error-boundary';

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
    field: 'countryOfOrigin',
    headerName: 'Country of Origin',
    width: 200,
    valueGetter: (params) => {
      return params.row.countryOfOrigin;
    },
  }

];



export function AllRetailerList() {
  const allRetailersQuery: QueryResult<RetailersQuery> = useQuery<RetailersQuery, RetailersQueryVariables>(RETAILER_LIST,
    {
      variables: {
        offset: OFFSET_DEFAULT,
        limit: LIMIT_DEFAULT,
      },
      fetchPolicy: 'cache-first'
    }
  );
  return (
    <RetailerList query={allRetailersQuery} />
  );
}

export function RetailerList(props: { query: QueryResult<RetailersQuery, RetailersQueryVariables>; }) {
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const [retailerList, setRetailerList] = useState<Retailers>({ retailers: [], offset: OFFSET_DEFAULT, limit: LIMIT_DEFAULT, totalCount: LIMIT_DEFAULT });
  const { data, error, loading, fetchMore } = props.query;

  useEffect(() => {
    if (data && data.retailers) {
      setRetailerList({
        offset: data.retailers.offset || OFFSET_DEFAULT,
        limit: data.retailers.limit || LIMIT_DEFAULT,
        totalCount: data.retailers.totalCount || LIMIT_DEFAULT,
        retailers: data.retailers.retailers || []
      });
    }
  }, [data]);

  function fetchNext(offset: number, limit: number) {
    console.debug("[RetailerList.fetchNext]",
      offset, limit);
    fetchMore({
      variables: {
        offset,
        limit
      },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        if (!fetchMoreResult) return prev;
        console.debug("[RetailerList.fetchNext.updateQuery]",
          prev,
          fetchMoreResult);
        setRetailerList({
          offset: fetchMoreResult.retailers.offset || retailerList.offset,
          limit: fetchMoreResult.retailers.limit || retailerList.limit,
          totalCount: fetchMoreResult.retailers.totalCount || retailerList.totalCount,
          retailers: fetchMoreResult.retailers.retailers || []
        });
      }
    });
    return;
  }
  if (error) showBoundary(error);
  console.debug('[RetailerList] result', data, error, loading);
  console.debug('[RetailerList] pagination', retailerList);

  return (
    <Card elevation={6} >
      <CardHeader title={'Retailers'} />
      <CardHeader subheader={'Click on a Retailer to see details'} />
      <CardContent>
        <DataGrid
          sx={{ minHeight: '400px' }}
          className='DataGrid'
          rows={(retailerList.retailers) ? retailerList.retailers : []}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: LIMIT_DEFAULT,
                page: OFFSET_DEFAULT / LIMIT_DEFAULT,
              },
            },
          }}
          rowCount={retailerList.totalCount || 0}
          rowHeight={25}
          paginationMode='server'
          pageSizeOptions={[LIMIT_DEFAULT]}
          onPaginationModelChange={({ pageSize, page }) => {
            console.debug("[RetailerList.onPaginationModelChange]", page, pageSize);
            fetchNext(pageSize * page, pageSize);
          }}
          onRowClick={(row) => navigate(`${row.row.id}`)}
        />
      </CardContent>
    </Card>
  );
}
