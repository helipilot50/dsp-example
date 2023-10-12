import './App.css';
import {
  HashRouter as Router,
} from 'react-router-dom';

import { Nav } from './components/Nav';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';

import { ApolloProvider } from '@apollo/client/react';
import { client } from './lib/apollo';
import { clerkConfig } from './components/auth/clerkConfig';
import { ClerkProvider } from '@clerk/clerk-react';


function App() {

  return (
    <ApolloProvider client={client}>
      <ClerkProvider {...clerkConfig}>
        <Router>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Nav />
          </LocalizationProvider>
        </Router>
      </ClerkProvider>
    </ApolloProvider >
  );
}

export default App;


