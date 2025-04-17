'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function AuthError() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const errorParam = searchParams.get('error');
    
    if (errorParam === 'CredentialsSignin') {
      setError('Invalid email or password. Please try again.');
    } else if (errorParam === 'OAuthAccountNotLinked') {
      setError('Email already in use with a different provider.');
    } else if (errorParam === 'OAuthSignin') {
      setError('Error signing in with OAuth provider.');
    } else if (errorParam === 'OAuthCallback') {
      setError('Error during OAuth callback.');
    } else if (errorParam === 'AccessDenied') {
      setError('Access denied. You do not have permission to sign in.');
    } else if (errorParam === 'Verification') {
      setError('The token has expired or is invalid.');
    } else {
      setError('An unknown error occurred during authentication.');
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
          <p className="text-sm text-muted-foreground">{error}</p>
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
