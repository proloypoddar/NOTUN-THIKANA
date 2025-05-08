'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Home, User, CreditCard, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function PaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  
  // Fetch booking details
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(`/housing/${params.id}/payment`));
      return;
    }
    
    if (status === 'authenticated') {
      const fetchBooking = async () => {
        try {
          const response = await fetch(`/api/bookings/${params.id}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch booking');
          }
          
          const data = await response.json();
          setBooking(data);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching booking:', error);
          toast({
            title: 'Error',
            description: 'Failed to load booking details. Please try again.',
            variant: 'destructive',
          });
          setIsLoading(false);
        }
      };
      
      fetchBooking();
    }
  }, [params.id, router, status, toast]);
  
  // Handle payment submission
  const handlePayment = async () => {
    if (!phoneNumber || !transactionId) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking._id,
          amount: booking.totalAmount,
          paymentMethod,
          notes: `Payment via ${paymentMethod}. Phone: ${phoneNumber}, Transaction ID: ${transactionId}`,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Payment failed');
      }
      
      const data = await response.json();
      
      toast({
        title: 'Payment successful',
        description: `Your payment of ${booking.totalAmount} BDT has been processed successfully.`,
      });
      
      // Redirect to booking details
      router.push(`/dashboard/bookings/${booking._id}`);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: 'Payment failed',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="container py-8">
        <Button variant="ghost" className="mb-4" asChild>
          <Link href={`/housing/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Property
          </Link>
        </Button>
        
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-32" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  // Show error if booking not found
  if (!booking) {
    return (
      <div className="container py-8">
        <Button variant="ghost" className="mb-4" asChild>
          <Link href={`/housing/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Property
          </Link>
        </Button>
        
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
              Booking Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>The booking you are looking for does not exist or you do not have permission to view it.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/housing">Browse Properties</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-4" asChild>
        <Link href={`/housing/${booking.property._id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Property
        </Link>
      </Button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Complete Your Payment</h1>
        <p className="text-muted-foreground">Secure payment for your booking</p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <div className="flex items-center space-x-2 rounded-md border p-4">
                  <RadioGroupItem value="bkash" id="bkash" />
                  <Label htmlFor="bkash" className="flex flex-1 items-center gap-2">
                    <img src="/images/bkash.png" alt="bKash" className="h-8 w-8" />
                    bKash
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-4">
                  <RadioGroupItem value="nagad" id="nagad" />
                  <Label htmlFor="nagad" className="flex flex-1 items-center gap-2">
                    <img src="/images/nagad.png" alt="Nagad" className="h-8 w-8" />
                    Nagad
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-4">
                  <RadioGroupItem value="rocket" id="rocket" />
                  <Label htmlFor="rocket" className="flex flex-1 items-center gap-2">
                    <img src="/images/rocket.png" alt="Rocket" className="h-8 w-8" />
                    Rocket
                  </Label>
                </div>
              </RadioGroup>
              
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="01XXXXXXXXX" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transaction">Transaction ID</Label>
                  <Input 
                    id="transaction" 
                    placeholder="Enter transaction ID" 
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handlePayment} 
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? 'Processing...' : `Pay ${booking.totalAmount} BDT`}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{booking.property.title}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div>{format(new Date(booking.startDate), 'MMM d, yyyy')}</div>
                  <div>to {format(new Date(booking.endDate), 'MMM d, yyyy')}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Landlord: {booking.landlord.name}</span>
              </div>
              
              <Separator />
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Total Amount</span>
                  <span className="font-bold">{booking.totalAmount} BDT</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Status</span>
                  <span>{booking.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
