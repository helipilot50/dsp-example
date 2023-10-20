import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { ApolloProvider } from '@apollo/client/react';

import { clerkConfig } from './components/auth/clerkConfig';
import { ClerkProvider } from '@clerk/clerk-react';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { client } from './lib/apollo';
import { ErrorBoundary } from './components/error/ErrorBoundary';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ClerkProvider {...clerkConfig}>
        <ApolloProvider client={client}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <App />
          </LocalizationProvider>
        </ApolloProvider>
      </ClerkProvider>
    </ErrorBoundary>
  </React.StrictMode>

);


