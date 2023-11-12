
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import {
  Box, Card, CardContent, CardHeader, FormControl,
  LinearProgress, Paper, Stack, TextField
} from '@mui/material';
import { SkuQuery, SkuQueryVariables } from 'not-dsp-graphql';
import { PRODUCT_DETAILS } from 'not-dsp-graphql';
import { Scalars } from 'not-dsp-graphql';
import { ErrorNofification } from './error/ErrorBoundary';
import { useErrorBoundary } from 'react-error-boundary';

export interface ProductDetailsProps {
  skuKey?: Scalars['ID'];
}

export function ProductDetails(props: ProductDetailsProps) {
  const params = useParams();
  const { showBoundary } = useErrorBoundary();

  const { data, loading, error } = useQuery<SkuQuery, SkuQueryVariables>(PRODUCT_DETAILS,
    {
      variables: {
        skuKey: (props.skuKey) ? props.skuKey : params.skuKey || 'no-id',
      }
    });
  if (error) showBoundary(error);

  console.debug('params', params);
  return (
    <Card elevation={6}>
      <CardHeader
        title={'PRODUCT'}
      />
      <CardContent
        component="form"
        noValidate
        autoComplete="off"
      >
        {loading && <LinearProgress variant="query" />}
        <Stack spacing={2}>
          <TextField
            label="SKU Key"
            value={(data && data.sku) ? data?.sku?.skuKey : ''}
            InputProps={{
              readOnly: true,
            }}
            size='small' />
          <TextField
            label="Name"
            value={(data && data.sku) ? data?.sku?.name : ''}
            multiline={true}
            rows={2}
            size='small' />
          <TextField
            label="Description"
            value={(data && data.sku) ? data?.sku?.description : ''}
            multiline={true}
            rows={5}
            size='small' />
          <Stack direction='row' sx={{ width: '100%' }}>
            <TextField sx={{ width: '50%' }}
              label="Price"
              value={(data && data.sku) ? data?.sku?.price : 0}
              type='number'
              size='small' />
            <TextField sx={{ ml: 1, width: '50%' }}
              label="Quantity"
              value={(data && data.sku) ? data?.sku?.quantity : 0}
              type='number'
              size='small'
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
