import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { ApolloProvider } from '@apollo/client/react';
import { client } from './lib/apollo';
import { clerkConfig } from './components/auth/clerkConfig';
import { ClerkProvider } from '@clerk/clerk-react';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ClerkProvider {...clerkConfig}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <App />
        </LocalizationProvider>
      </ClerkProvider>
    </ApolloProvider >
  </React.StrictMode>

);


