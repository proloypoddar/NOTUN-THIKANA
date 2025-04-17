'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Users, Filter, List, Map, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock events data with coordinates
const mockEvents = [
  {
    id: 1,
    title: 'Community Meetup',
    description: 'Join us for our monthly community gathering',
    date: '2025-04-15',
    time: '18:00',
    location: 'Central Community Center',
    coordinates: { lat: 23.8103, lng: 90.4125 }, // Dhaka coordinates
    attendees: 45,
    category: 'social',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Tech Workshop',
    description: 'Learn the basics of web development',
    date: '2025-04-20',
    time: '14:00',
    location: 'Innovation Hub',
    coordinates: { lat: 23.8223, lng: 90.4265 }, // Slightly different coordinates
    attendees: 30,
    category: 'education',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Cultural Festival',
    description: 'Celebrate local culture with music, food, and art',
    date: '2025-04-25',
    time: '12:00',
    location: 'City Park',
    coordinates: { lat: 23.8003, lng: 90.4025 }, // Another location in Dhaka
    attendees: 120,
    category: 'culture',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
  },
];

export default function EventsMapPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-4" asChild>
        <Link href="/events">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>
      </Button>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Nearby Events</h1>
          <p className="text-muted-foreground">Discover events happening around you</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/events">
              <List className="mr-2 h-4 w-4" />
              List View
            </Link>
          </Button>
          <Button asChild>
            <Link href="/events/map">
              <Map className="mr-2 h-4 w-4" />
              Map View
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:max-w-xs"
        />
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="this-week">This Week</TabsTrigger>
          <TabsTrigger value="free">Free Entry</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="h-[500px] overflow-hidden">
            <CardContent className="p-0">
              {/* In a real app, this would be a Google Maps component */}
              <div className="relative h-full w-full bg-muted">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <Map className="mx-auto h-16 w-16 text-muted-foreground" />
                    <p className="mt-4 text-lg font-medium">Map View</p>
                    <p className="text-sm text-muted-foreground">
                      In a real application, this would display a Google Maps view with event pins.
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      For this demo, please imagine the events are displayed on a map here.
                    </p>
                  </div>
                </div>

                {/* Mock map pins for visualization */}
                <div className="absolute left-1/4 top-1/3 cursor-pointer" onClick={() => setSelectedEvent(1)}>
                  <div className={`h-6 w-6 rounded-full ${selectedEvent === 1 ? 'bg-primary' : 'bg-primary/70'} p-1 shadow-lg transition-all hover:scale-110`}>
                    <MapPin className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
                <div className="absolute left-2/3 top-1/4 cursor-pointer" onClick={() => setSelectedEvent(2)}>
                  <div className={`h-6 w-6 rounded-full ${selectedEvent === 2 ? 'bg-primary' : 'bg-primary/70'} p-1 shadow-lg transition-all hover:scale-110`}>
                    <MapPin className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
                <div className="absolute left-1/2 top-2/3 cursor-pointer" onClick={() => setSelectedEvent(3)}>
                  <div className={`h-6 w-6 rounded-full ${selectedEvent === 3 ? 'bg-primary' : 'bg-primary/70'} p-1 shadow-lg transition-all hover:scale-110`}>
                    <MapPin className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Events Near You</h2>
          <div className="space-y-4">
            {mockEvents.map((event) => (
              <Card
                key={event.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedEvent === event.id ? 'border-primary' : ''
                }`}
                onClick={() => setSelectedEvent(event.id)}
              >
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold">{event.title}</h3>
                    <Badge>{event.category}</Badge>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">{event.description}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button size="sm" className="w-full" asChild>
                      <Link href={`/events/${event.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
