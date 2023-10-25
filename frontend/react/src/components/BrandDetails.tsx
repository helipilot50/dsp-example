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

export function BrandDetails() {
  const params = useParams();

  const { data, loading, error } = useQuery<BrandQuery, BrandQueryVariables>(BRAND_DETAILS,
    {
      variables: {
        brandId: params.brandId || 'no-id',
      }
    });

  console.log('params', params);
  return (
    <Paper square={false}
      elevation={6}
      sx={{
        '& .MuiTextField-root': { m: 1, width: '55ch' },
      }}>
      <Card>
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
          {error && <ErrorNofification error={error} />}
          <Stack spacing={1}>
            <TextField
              label="ID"
              value={(data && data.brand) ? data?.brand?.id : ''}
              InputProps={{
                readOnly: true,
              }} />
            <TextField
              label="Name"
              value={(data && data.brand) ? data?.brand?.name : ''}
              InputProps={{
                readOnly: true,
              }} />


            <TextField
              label="Country"
              value={(data && data.brand) ? data?.brand?.country : ''}
              InputProps={{
                readOnly: true,
              }} />
            <TextField
              label="Industry"
              value={(data && data.brand) ? data?.brand?.industry : ''}
              InputProps={{
                readOnly: true,
              }} />
            <TextField
              label="Founded in"
              value={(data && data.brand) ? data?.brand?.foundedIn : ''}
              InputProps={{
                readOnly: true,
              }} />
            <TextField
              label="Founded by"
              value={(data && data.brand) ? data?.brand?.foundedBy : ''}
              InputProps={{
                readOnly: true,
              }} />
            <TextField
              label="Rank"
              value={(data && data.brand) ? data?.brand?.rank : ''}
              InputProps={{
                readOnly: true,
              }} />
            <TextField
              label="Rating"
              value={(data && data.brand) ? data?.brand?.rating : ''}
              InputProps={{
                readOnly: true,
              }} />
            <TextField
              label="Brand Value USD(m)"
              value={(data && data.brand) ? data?.brand?.brandValue : ''}
              InputProps={{
                readOnly: true,
              }} />
          </Stack>
        </CardContent>
      </Card>
    </Paper>
  );
}
