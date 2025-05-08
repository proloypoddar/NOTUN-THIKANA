'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentHistory from '@/components/payment/payment-history';
import { useToast } from '@/components/ui/use-toast';

export default function PaymentsPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('history');

  if (status === 'loading') {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container py-8">
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your payment history and make payments.
          </p>
          <Button asChild>
            <Link href="/auth/signin?callbackUrl=/payments">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-4" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground">Manage your payments and view transaction history</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Payment History
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Pending Payments
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="space-y-6">
          <PaymentHistory />
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-6">
          <div className="grid gap-6">
            {/* This would be populated with pending payments that need to be paid */}
            <div className="text-center py-12 text-muted-foreground">
              <p>You have no pending payments.</p>
              <p className="text-sm mt-1">When you book a property, pending payments will appear here.</p>
              <Button className="mt-4" asChild>
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
