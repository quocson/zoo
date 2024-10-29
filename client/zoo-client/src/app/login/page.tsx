'use client'
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import  { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-northeast-1_UIKUJ27Hp",
      userPoolClientId: "66rkt2qrjlokagfl6ssc4of7p1",
      identityPoolId: "ap-northeast-1:887f92f3-1b5b-441b-9f42-0c72eb4109e1",
      loginWith: {
        username: true,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: true,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
})

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
            <TokenDisplay/>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

function TokenDisplay() {
    const { authStatus } = useAuthenticator();
    const [token, setToken] = useState<string | undefined>(undefined);
    useEffect(() => {        
        if(authStatus == 'authenticated')
            fetchAuthSession().then(t => setToken(t.tokens?.idToken?.toString()));
    },[])
    return(<div>{token}</div>)
}