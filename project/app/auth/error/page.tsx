'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function AuthError() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('An unknown error occurred');

  useEffect(() => {
    const error = searchParams.get('error');

    if (error) {
      switch (error) {
        case 'CredentialsSignin':
          setErrorMessage('Invalid email or password. Please try again.');
          break;
        case 'OAuthAccountNotLinked':
          setErrorMessage('This email is already associated with another account. Please sign in using your original provider.');
          break;
        case 'OAuthSignin':
        case 'OAuthCallback':
          setErrorMessage('There was a problem with the OAuth sign in. Please try again.');
          break;
        case 'Callback':
          setErrorMessage('There was a problem with the authentication callback. Please try again.');
          break;
        case 'AccessDenied':
          setErrorMessage('Access denied. You do not have permission to access this resource.');
          break;
        case 'Verification':
          setErrorMessage('The verification token is invalid or has expired. Please try again.');
          break;
        default:
          setErrorMessage(`Authentication error: ${error}`);
      }
    }
  }, [searchParams]);

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
          </div>
          <CardDescription>
            There was a problem signing you in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signin">Try Again</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
