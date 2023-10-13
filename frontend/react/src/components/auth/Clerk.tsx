import { UserButton, SignInButton } from '@clerk/clerk-react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
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
        />
      </SignedOut>
    </>
  );
}
