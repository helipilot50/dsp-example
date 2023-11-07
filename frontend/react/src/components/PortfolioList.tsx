import React, { useState } from 'react';
import { LIST_PORTFOLIOS, PortfoliosQuery, PortfoliosQueryVariables } from 'not-dsp-graphql';
import { DataGrid, GridColDef, GridRowSelectionModel, GridValueGetterParams } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router';
import { Card, CardHeader, CardActionArea, ButtonGroup, Button, CardContent } from '@mui/material';
import { LIMIT_DEFAULT } from '../lib/ListDefaults';
import { ErrorNofification } from './error/ErrorBoundary';

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
  },
  {
    field: 'description',
    headerName: 'Description',
    minWidth: 350,

  },
];


export function PortfolioList() {
  const navigate = useNavigate();
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);

  const { data, error, loading } = useQuery<PortfoliosQuery, PortfoliosQueryVariables>(LIST_PORTFOLIOS, {
    fetchPolicy: 'cache-first',
  });
  function selectionCanged(selection: GridRowSelectionModel) {
    console.debug("[LineitemListComponent.selectionCanged]", selection);
    setSelection(selection);
  }
  function addPortfolio() {
    navigate('new');
  }
  if (error) console.error(error);
  if (data) console.debug("[PortfolioList]", data);
  return (
    <Card elevation={6}>
      <CardHeader title={'Portfolios'} />
      <CardHeader subheader={'Click on a Portfolio to see details'} />
      <CardActionArea sx={{ ml: 2 }}>
        <ButtonGroup variant="contained" aria-label="activation-group">
          <Button onClick={addPortfolio}>New portfolio</Button>
        </ButtonGroup>
      </CardActionArea>
      <CardContent >
        {error && <ErrorNofification error={error} />}

        <DataGrid
          sx={{ minHeight: 100 }}
          className='DataGrid'
          rows={(data?.portfolios) ? data?.portfolios : [] as any}
          columns={columns}
          loading={loading}
          rowHeight={25}
          onRowClick={(row) => {
            navigate(`${row.row.id}`);
          }
          }
          onRowSelectionModelChange={selectionCanged}
        />
      </CardContent>
    </Card>
  );
}
