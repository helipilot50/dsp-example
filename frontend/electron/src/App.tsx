// import './App.css';
import { GlobalStyle } from './AppStyle';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export function App() {
  return (
    <>
      <GlobalStyle />
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Button variant="text" onClick={() => {
            console.log('clicked');
          }}>xs=8</Button>
        </Grid>
        <Grid item xs={4}>
          <Button>xs=4</Button>
        </Grid>
        <Grid item xs={4}>
          <Button>xs=4</Button>
        </Grid>
        <Grid item xs={8}>
          <Button>xs=8</Button>
        </Grid>
      </Grid>
    </>
  );
};
