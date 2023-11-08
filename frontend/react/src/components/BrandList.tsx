import { useQuery } from '@apollo/client';
import { Alert, AlertTitle, Box, Card, CardContent, CardHeader, Paper, Snackbar, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { BRANDS_LIST } from 'not-dsp-graphql';
import { BrandsQuery, BrandsQueryVariables, BrandList as Brands } from 'not-dsp-graphql';
import { LIMIT_DEFAULT, OFFSET_DEFAULT } from '../lib/ListDefaults';
import { ErrorBoundary, ErrorNofification } from './error/ErrorBoundary';
import { useErrorBoundary } from 'react-error-boundary';

const columns: GridColDef[] = [
  // { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
  },
  {
    field: 'brandValue',
    headerName: 'Brand Value USD',
    width: 150,
  },
  {
    field: 'country',
    headerName: 'Country',
    width: 150,
  },
  {
    field: 'industry',
    headerName: 'Industry',
    width: 450,
  },


];

export function BrandList() {
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const [brandList, setBrandList] = useState<Brands>({ brands: [], offset: OFFSET_DEFAULT, limit: LIMIT_DEFAULT, totalCount: LIMIT_DEFAULT });
  const { data, error, loading, fetchMore } = useQuery<BrandsQuery, BrandsQueryVariables>(
    BRANDS_LIST,
    {
      variables: {
        offset: brandList.offset,
        limit: brandList.limit,
      },
      fetchPolicy: 'cache-first',
    }
  );

  useEffect(() => {
    if (data && data.brands) {
      setBrandList({
        offset: data.brands.offset || OFFSET_DEFAULT,
        limit: data.brands.limit || LIMIT_DEFAULT,
        totalCount: data.brands.totalCount || LIMIT_DEFAULT,
        brands: data.brands.brands || []
      });
    }
  }, [data]);

  function fetchNext(offset: number, limit: number) {
    console.debug("[BrandList.fetchNext]",
      offset, limit);
    fetchMore({
      variables: {
        offset,
        limit
      },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        if (!fetchMoreResult) return prev;
        console.debug("[BrandList.fetchNext.updateQuery]",
          prev,
          fetchMoreResult);
        setBrandList({
          offset: fetchMoreResult.brands.offset || brandList.offset,
          limit: fetchMoreResult.brands.limit || brandList.limit,
          totalCount: fetchMoreResult.brands.totalCount || brandList.totalCount,
          brands: fetchMoreResult.brands.brands || []
        });
      }
    });
    return;
  }


  console.debug('[BrandList] result', data, error, loading);
  console.debug('[BrandList] pagination', brandList);
  if (error) showBoundary(error);
  return (
    <ErrorBoundary>
      <Card elevation={6}>
        <CardHeader title={'Brands'} />
        <CardHeader subheader={'Click on a Brand to see details'} />
        <CardContent>
          <DataGrid
            className='DataGrid'
            rows={(brandList && brandList.brands) ? brandList.brands : []}
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
            rowHeight={25}
            rowCount={brandList.totalCount || LIMIT_DEFAULT}
            pageSizeOptions={[LIMIT_DEFAULT]}
            paginationMode="server"
            onPaginationModelChange={({ pageSize, page }) => {
              console.debug("[BrandList.onPaginationModelChange]", page, pageSize);
              fetchNext(pageSize * page, pageSize);
            }}
            onRowClick={(row) => navigate(`${row.row.id}`)}
          />
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
}
