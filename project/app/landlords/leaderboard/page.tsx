'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LandlordLeaderboard from '@/components/landlords/leaderboard';

export default function LandlordLeaderboardPage() {
  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-4" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Landlord Leaderboard</h1>
        <p className="text-muted-foreground">Top-rated landlords in our community</p>
      </div>

      <LandlordLeaderboard />
    </div>
  );
}
