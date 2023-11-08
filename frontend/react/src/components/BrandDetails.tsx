import React from 'react';
import {
  Paper, TextField, Link,
  LinearProgress, Stack, Card, CardHeader, CardContent,
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { BrandQuery, BrandQueryVariables } from 'not-dsp-graphql';
import { BRAND_DETAILS } from 'not-dsp-graphql';
import { ErrorNofification } from './error/ErrorBoundary';
import { useErrorBoundary } from 'react-error-boundary';

export function BrandDetails() {
  const params = useParams();
  const { showBoundary } = useErrorBoundary();

  const { data, loading, error } = useQuery<BrandQuery, BrandQueryVariables>(BRAND_DETAILS,
    {
      variables: {
        brandId: params.brandId || 'no-id',
      }
    });

  console.debug('params', params);
  if (error) showBoundary(error);
  return (

    <Card elevation={6}
      sx={{
        '& .MuiTextField-root': { mt: 1, width: '55ch' },
      }}>
      <CardHeader
        title={'Brand'}
        subheader={<Link
          href={(data && data.brand && data.brand.website) ? data.brand.website : ''}
          target='_blank'>website</Link>}
      />
      <CardContent
        component="form"
        noValidate
        autoComplete="off">
        {loading && <LinearProgress variant="query" />}
        <Stack spacing={1}>
          <TextField
            label="ID"
            value={(data && data.brand) ? data?.brand?.id : ''}
            InputProps={{
              readOnly: true,
            }}
            size='small' />
          <TextField
            label="Name"
            value={(data && data.brand) ? data?.brand?.name : ''}
            InputProps={{
              readOnly: true,
            }}
            size='small' />


          <TextField
            label="Country"
            value={(data && data.brand) ? data?.brand?.country : ''}
            InputProps={{
              readOnly: true,
            }}
            size='small' />
          <TextField
            label="Industry"
            value={(data && data.brand) ? data?.brand?.industry : ''}
            InputProps={{
              readOnly: true,
            }}
            size='small' />
          <TextField
            label="Founded in"
            value={(data && data.brand) ? data?.brand?.foundedIn : ''}
            InputProps={{
              readOnly: true,
            }}
            size='small' />
          <TextField
            label="Founded by"
            value={(data && data.brand) ? data?.brand?.foundedBy : ''}
            InputProps={{
              readOnly: true,
            }}
            size='small' />
          <TextField
            label="Rank"
            value={(data && data.brand) ? data?.brand?.rank : ''}
            InputProps={{
              readOnly: true,
            }}
            size='small' />
          <TextField
            label="Rating"
            value={(data && data.brand) ? data?.brand?.rating : ''}
            InputProps={{
              readOnly: true,
            }}
            size='small' />
          <TextField
            label="Brand Value USD(m)"
            value={(data && data.brand) ? data?.brand?.brandValue : ''}
            InputProps={{
              readOnly: true,
            }}
            size='small' />
        </Stack>
      </CardContent>
    </Card>
  );
}
