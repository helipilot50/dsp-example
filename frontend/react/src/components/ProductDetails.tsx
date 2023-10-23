
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import {
  Box, Card, CardContent, CardHeader, FormControl,
  LinearProgress, Paper, TextField
} from '@mui/material';
import { SkuQuery, SkuQueryVariables } from '../graphql/types';
import { PRODUCT_DETAILS } from '../graphql/products.graphql';
import { Scalars } from '../graphql/types';
import { ErrorNofification } from './error/ErrorBoundary';

export interface ProductDetailsProps {
  skuKey?: Scalars['ID'];
}

export function ProductDetails(props: ProductDetailsProps) {
  const params = useParams();

  const { data, loading, error } = useQuery<SkuQuery, SkuQueryVariables>(PRODUCT_DETAILS,
    {
      variables: {
        skuKey: (props.skuKey) ? props.skuKey : params.skuKey || 'no-id',
      }
    });

  console.log('params', params);
  return (
    <Paper
      square={false}
      elevation={6} >
      <Card>
        <CardHeader
          title={'PRODUCT'}
        />
        <CardContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '55ch' },
            }}
            noValidate
            autoComplete="off"
            m={2}
          >
            {loading && <LinearProgress variant="query" />}
            {error && <ErrorNofification error={error} />}
            <FormControl >
              <TextField
                label="Key"
                value={(data && data.sku) ? data?.sku?.skuKey : ''}
                InputProps={{
                  readOnly: true,
                }} />
              <TextField
                label="Name"
                value={(data && data.sku) ? data?.sku?.name : ''}
                multiline={true}
                rows={2} />
              <TextField
                label="Description"
                value={(data && data.sku) ? data?.sku?.description : ''}
                multiline={true}
                rows={5} />
              <TextField
                label="Price"
                value={(data && data.sku) ? data?.sku?.price : 0}
                type='number' />
              <TextField
                label="Quantity"
                value={(data && data.sku) ? data?.sku?.quantity : 0}
                type='number'
              />
            </FormControl >
          </Box>
        </CardContent>
      </Card>
    </Paper>
  );
}
