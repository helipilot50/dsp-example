import { Collapse, Alert, AlertTitle, Snackbar } from '@mui/material';
import React, { ReactNode } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { ErrorBoundary as EB } from 'react-error-boundary';

interface ErrorNotificationProps {
  error: any;
  resetErrorBoundary?: () => void;
}

export function ErrorBoundary({ children }: { children: ReactNode; }) {
  return (
    <EB FallbackComponent={ErrorNofification}
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
        <AlertTitle>Account {error.message} </AlertTitle>
      </Alert>
    </Snackbar >


  );
}