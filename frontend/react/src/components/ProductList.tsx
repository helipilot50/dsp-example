
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import { SkusQuery, SkusQueryVariables, SkuList as Skus } from 'not-dsp-graphql';
import { Card, CardContent, CardHeader } from '@mui/material';
import { PRODUCT_LIST } from 'not-dsp-graphql';
import { OFFSET_DEFAULT, LIMIT_DEFAULT } from '../lib/ListDefaults';
import { useSearchParams } from 'react-router-dom';
import { ErrorNofification } from './error/ErrorBoundary';
import { useErrorBoundary } from 'react-error-boundary';

const columns: GridColDef[] = [
  {
    field: 'skuKey', headerName: 'Key', width: 90, valueGetter: (params) => {
      return params.row.skuKey;
    },
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 200,

  },
  {
    field: 'description',
    headerName: 'Description',
    minWidth: 500,
  },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 110,
    valueGetter: (params) => {
      return params.row.price;
    },
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    type: 'number',
    width: 110,
    valueGetter: (params) => {
      return params.row.quantity;
    },
  },
];

export function ProductsList() {
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const [searchParams, setSearchParams] = useSearchParams({ offset: OFFSET_DEFAULT.toString(), limit: LIMIT_DEFAULT.toString() });
  const [skuList, setSkuList] = useState<Skus>({ skus: [], offset: OFFSET_DEFAULT, limit: LIMIT_DEFAULT, totalCount: LIMIT_DEFAULT });
  const { data, error, loading, fetchMore } = useQuery<SkusQuery, SkusQueryVariables>(
    PRODUCT_LIST,
    {
      variables: {
        offset: skuList.offset,
        limit: skuList.limit
      },
      fetchPolicy: 'cache-first',
    }
  );

  useEffect(() => {
    if (data && data.skus) {
      setSearchParams({
        offset: data.skus.offset?.toString() || OFFSET_DEFAULT.toString(),
        limit: data.skus.limit?.toString() || LIMIT_DEFAULT.toString(),
      });
      setSkuList({
        offset: data.skus.offset || OFFSET_DEFAULT,
        limit: data.skus.limit || LIMIT_DEFAULT,
        totalCount: data.skus.totalCount || LIMIT_DEFAULT,
        skus: data.skus.skus || []
      });
    }
  }, [data]);

  function fetchNext(offset: number, limit: number) {
    console.debug("[SkuList.fetchNext]",
      offset, limit);
    fetchMore({
      variables: {
        offset,
        limit
      },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        if (!fetchMoreResult) return prev;
        console.debug("[SkuListComponent.fetchNext.updateQuery]",
          prev,
          fetchMoreResult);
        setSkuList({
          offset: fetchMoreResult.skus.offset || skuList.offset,
          limit: fetchMoreResult.skus.limit || skuList.limit,
          totalCount: fetchMoreResult.skus.totalCount || skuList.totalCount,
          skus: fetchMoreResult.skus.skus || []
        });
      }
    });
    return;
  }

  if (error) showBoundary(error);
  console.debug('[SkuList] result', data, error, loading);
  console.debug('[SkuList] pagination', skuList);
  console.debug('[SkuList] searchParams', searchParams);

  return (
    <Card elevation={6}>
      <CardHeader title={'Products'} />
      <CardHeader subheader={'Click on a Product to see details'} />
      <CardContent>
        <DataGrid
          className='DataGrid'
          rows={(skuList.skus) ? skuList.skus.map(value => {
            return {
              id: value?.skuKey,
              ...value
            };
          }) : []}
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
          rowCount={skuList.totalCount || 0}
          rowHeight={25}
          paginationMode='server'
          pageSizeOptions={[LIMIT_DEFAULT]}
          onPaginationModelChange={({ pageSize, page }) => {
            console.debug("[SkuList.onPaginationModelChange]", page, pageSize);
            fetchNext(pageSize * page, pageSize);
          }}
          onRowClick={(row) => navigate(`${row.row.id}`)}
        />
      </CardContent>
    </Card>
  );
}
