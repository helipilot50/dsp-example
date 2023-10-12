import { useEffect, useRef } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import OktaAuth, { toRelativeUrl } from "@okta/okta-auth-js";
import { useOktaAuth } from "@okta/okta-react";
import OktaSignIn from '@okta/okta-signin-widget';

export { LoginCallback } from '@okta/okta-react';

const oktaOptions = {
  issuer: process.env.REACT_APP_OKTA_ISSUER,
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  redirectUri: `${window.location.origin}/login/callback`,
  scopes: ['openid', 'profile', 'email'],
  pkce: true
};

export const oktaAuth = new OktaAuth(oktaOptions);
console.log('OKTA auth', oktaOptions);

export function restoreOriginalUri(_oktaAuth: OktaAuth, originalUri: string) {
  const navigate = useNavigate();
  navigate(originalUri);
}


export function PrivateRoute({ children }: { children: React.ReactElement; }) {

  const { authState } = useOktaAuth();
  const loggedin = authState?.isAuthenticated;

  if (loggedin) {
    // render the wrapped page
    return children;
  }
  else {
    // user not logged in, redirect to the Login page which is unprotected
    return <Navigate to={'/login'} />;
  }
}

type OktaSignInWidgetProps = {
  onSuccess: (tokens: any) => void;
  onError: (err: any) => void;
};


export function OktaSignInWidget({ onSuccess, onError }: OktaSignInWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!widgetRef.current) {
      return;
    }

    const widget = new OktaSignIn(oktaAuth);

    // Search for URL Parameters to see if a user is being routed to the application to recover password
    //  var searchParams = new URL(window.location.href).searchParams;
    //  widget.otp = searchParams.get('otp');
    //  widget.state = searchParams.get('state');
    widget.showSignInToGetTokens({
      el: widgetRef.current.id,
    }).then(onSuccess).catch(onError);

    return () => widget.remove();
  }, [onSuccess, onError]);

  return (<div ref={widgetRef} />);
}


// https://github.com/oktadev/okta-react-typescript-redux-example

// https://github.com/okta/samples-js-react