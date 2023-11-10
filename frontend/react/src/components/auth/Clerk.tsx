import { UserButton, SignInButton } from '@clerk/clerk-react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Button } from '@mui/material';
import React from 'react';



export default function Clerk() {
  return (
    <>
      <SignedIn>
        <UserButton
          afterSignOutUrl='/' />
      </SignedIn>
      <SignedOut>
        <SignInButton mode='modal'
          afterSignInUrl='/'
        >
          <Button variant='contained' color='secondary'>
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
