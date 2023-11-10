import { Collapse, Alert, AlertTitle, Snackbar } from '@mui/material';
import React, { ReactNode } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { ErrorBoundary as EB } from 'react-error-boundary';

export interface ErrorNotificationProps {
  error: any;
  resetErrorBoundary?: () => void;
}

export function ErrorBoundary({ children }: { children: ReactNode; }) {
  return (
    <EB FallbackComponent={ErrorNofification}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
      onError={(error, info) => {
        console.error(error, info);
      }}
    >
      {children}
    </EB>
  );
}


export function ErrorNofification({ error, resetErrorBoundary }: ErrorNotificationProps) {
  const { resetBoundary, } = useErrorBoundary();
  const [open, setOpen] = React.useState(true);

  function onClose() {
    setOpen(false);
    resetBoundary();
    if (resetErrorBoundary)
      resetErrorBoundary();
  }


  return (
    <Snackbar open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Alert onClose={onClose}
        severity='error'>
        <AlertTitle>{error.message}</AlertTitle>
        <Collapse in={open}>
          <pre>{error.stack}</pre>
        </Collapse>
      </Alert>
    </Snackbar >


  );
}