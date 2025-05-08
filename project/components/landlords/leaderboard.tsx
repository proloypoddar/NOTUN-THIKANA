'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Star, RefreshCw, MessageSquare, Home, Award, TrendingUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LandlordRating {
  cleanliness: number;
  communication: number;
  value: number;
  location: number;
  accuracy: number;
}

interface Landlord {
  id: string;
  name: string;
  email: string;
  image: string;
  phone?: string;
  createdAt: string;
  rating: number;
  totalRatings: number;
  categories: LandlordRating;
  propertyCount: number;
  totalBookings: number;
  completedBookings: number;
}

export default function LandlordLeaderboard() {
  const { toast } = useToast();
  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');

  const fetchLandlords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/landlords/leaderboard?sortBy=${sortBy}&limit=20`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch landlord leaderboard');
      }
      
      const data = await response.json();
      setLandlords(data.leaderboard);
    } catch (error) {
      console.error('Error fetching landlord leaderboard:', error);
      toast({
        title: 'Error',
        description: 'Failed to load landlord leaderboard. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLandlords();
  }, [sortBy]);

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-500';
    if (rating >= 4.0) return 'text-emerald-500';
    if (rating >= 3.5) return 'text-blue-500';
    if (rating >= 3.0) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getPositionBadge = (index: number) => {
    if (index === 0) return <Badge className="bg-yellow-500">🥇 1st</Badge>;
    if (index === 1) return <Badge className="bg-gray-400">🥈 2nd</Badge>;
    if (index === 2) return <Badge className="bg-amber-700">🥉 3rd</Badge>;
    return <Badge variant="outline">{index + 1}th</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Landlord Leaderboard</CardTitle>
          <CardDescription>
            Top-rated landlords based on tenant reviews and ratings
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Overall Rating</SelectItem>
              <SelectItem value="cleanliness">Cleanliness</SelectItem>
              <SelectItem value="communication">Communication</SelectItem>
              <SelectItem value="value">Value</SelectItem>
              <SelectItem value="location">Location</SelectItem>
              <SelectItem value="accuracy">Accuracy</SelectItem>
              <SelectItem value="properties">Property Count</SelectItem>
              <SelectItem value="bookings">Booking Count</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchLandlords} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : landlords.length > 0 ? (
          <div className="space-y-4">
            {landlords.map((landlord, index) => (
              <div
                key={landlord.id}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getPositionBadge(index)}
                  </div>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={landlord.image} alt={landlord.name} />
                    <AvatarFallback>{landlord.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{landlord.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Star className={`h-4 w-4 mr-1 ${getRatingColor(landlord.rating)}`} />
                        <span className={getRatingColor(landlord.rating)}>
                          {landlord.rating.toFixed(1)}
                        </span>
                        <span className="ml-1">({landlord.totalRatings} reviews)</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-1" />
                        <span>{landlord.propertyCount} properties</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center gap-1">
                          <div className="rounded-full bg-primary/10 p-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-xs">Communication</span>
                          <span className="text-sm font-medium">{landlord.categories.communication.toFixed(1)}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Communication rating: {landlord.categories.communication.toFixed(1)}/5</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center gap-1">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Award className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-xs">Value</span>
                          <span className="text-sm font-medium">{landlord.categories.value.toFixed(1)}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Value for money rating: {landlord.categories.value.toFixed(1)}/5</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center gap-1">
                          <div className="rounded-full bg-primary/10 p-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-xs">Bookings</span>
                          <span className="text-sm font-medium">{landlord.completedBookings}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Completed bookings: {landlord.completedBookings}/{landlord.totalBookings}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/landlords/${landlord.id}`}>
                      View Profile
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No landlords found.</p>
            <p className="text-sm mt-1">Check back later for landlord ratings and reviews.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
