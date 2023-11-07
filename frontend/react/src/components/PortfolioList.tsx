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
    width: 110,
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
    navigate('portfolios/new');
  }
  return (
    <Card elevation={6}>
      <CardHeader title={'Prrtfolios'} />
      <CardHeader subheader={'Click on a Portfolio to see details'} />
      <CardActionArea sx={{ ml: 2 }}>
        <ButtonGroup variant="contained" aria-label="activation-group">
          <Button onClick={addPortfolio}>New portfolio</Button>
        </ButtonGroup>
      </CardActionArea>
      <CardContent >
        {error && <ErrorNofification error={error} />}

        <DataGrid
          className='DataGrid'
          rows={(data?.portfolios) ? data?.portfolios : [] as any}
          columns={columns}
          loading={loading}
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
