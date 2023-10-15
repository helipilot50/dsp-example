import { Collapse, Alert, AlertTitle } from "@mui/material";
import { useState, useEffect } from "react";

export function Notify(props: { message?: string | undefined; }) {
  // experimental and buggy

  const [state, setState] = useState<{ open: boolean; message: string | undefined; }>({
    open: false,
    message: props.message
  });
  console.log('[Notify] props', props);

  useEffect(() => {
    if (props.message && props.message.length > 0)
      setState({ open: true, message: props.message });
    const timeId = setTimeout(() => {
      // After 5 seconds close and clear
      setState({ open: false, message: undefined });
    }, 5000);

    return () => {
      clearTimeout(timeId);
    };
  }, [props.message]);

  console.log('[Notify] state', state);

  return (
    <Collapse in={state.open}>
      <Alert onClose={() => {
        setState({ open: false, message: undefined });
      }}>
        <AlertTitle>{`${state.message} at ${new Date().toLocaleString()}`}</AlertTitle>
      </Alert>
    </Collapse >
  );
}