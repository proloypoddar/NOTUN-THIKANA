'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Calendar, Clock, Filter, List, MapPin, Users } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EventsMapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Sample events data
  const events = [
    {
      id: 1,
      title: "Community Meetup",
      description: "Join us for our monthly community gathering where we'll discuss local issues and share experiences.",
      date: "2025-04-15",
      time: "18:00",
      location: "Central Community Center",
      address: "123 Main Street, Downtown",
      attendees: 45,
      category: "social",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop",
      coordinates: [40.7128, -74.0060]
    },
    {
      id: 2,
      title: "Tech Workshop",
      description: "Learn the basics of web development in this hands-on workshop for beginners.",
      date: "2025-04-20",
      time: "14:00",
      location: "Innovation Hub",
      address: "456 Tech Avenue, Innovation District",
      attendees: 30,
      category: "education",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop",
      coordinates: [40.7328, -74.0060]
    },
    {
      id: 3,
      title: "Cultural Festival",
      description: "Celebrate the diversity of our community with food, music, and performances from around the world.",
      date: "2025-04-25",
      time: "12:00",
      location: "City Park",
      address: "789 Park Avenue, Green District",
      attendees: 120,
      category: "culture",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop",
      coordinates: [40.7428, -73.9800]
    },
    {
      id: 4,
      title: "Job Fair for Newcomers",
      description: "Connect with local employers who are looking to hire newcomers to the city.",
      date: "2025-05-02",
      time: "10:00",
      location: "Convention Center",
      address: "101 Business Boulevard, Downtown",
      attendees: 85,
      category: "education",
      image: "https://images.unsplash.com/photo-1560523159-4a9692d222f9?w=800&auto=format&fit=crop",
      coordinates: [40.7528, -74.0160]
    },
    {
      id: 5,
      title: "Language Exchange Meetup",
      description: "Practice your language skills with native speakers in a friendly, casual environment.",
      date: "2025-05-10",
      time: "19:00",
      location: "International Cafe",
      address: "202 Global Street, Cultural District",
      attendees: 25,
      category: "education",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop",
      coordinates: [40.7228, -73.9900]
    },
    {
      id: 6,
      title: "Newcomers Welcome Dinner",
      description: "A special dinner event to welcome newcomers to our community. Meet locals and make new friends.",
      date: "2025-05-15",
      time: "19:00",
      location: "Community Hall",
      address: "303 Welcome Avenue, Central District",
      attendees: 50,
      category: "social",
      image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&auto=format&fit=crop",
      coordinates: [40.7328, -73.9700]
    },
  ];

  // Filter events based on search query and active category
  const filteredEvents = events.filter(event => {
    // Filter by category
    if (activeCategory !== 'all' && event.category !== activeCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/events" className="mb-2 flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to events list
          </Link>
          <h1 className="text-3xl font-bold">Events Map</h1>
          <p className="text-muted-foreground">Find events near you</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/events">
              <List className="mr-2 h-4 w-4" />
              List View
            </Link>
          </Button>
          <Button asChild>
            <Link href="/events/create">Create Event</Link>
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

      <Tabs defaultValue="all" className="mb-8" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="culture">Culture</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="relative h-[600px] rounded-lg overflow-hidden border bg-muted">
            {/* Map placeholder - In a real application, this would be an interactive map */}
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center">
                <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-lg font-medium">Interactive Map</p>
                <p className="text-sm text-muted-foreground">
                  In a real application, this would be an interactive map showing event locations.
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  Events found: {filteredEvents.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 md:col-span-1">
          <h2 className="text-xl font-bold">Events ({filteredEvents.length})</h2>
          
          {filteredEvents.length === 0 ? (
            <div className="rounded-lg border p-4 text-center">
              <p className="text-muted-foreground">No events found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">
                          <Link href={`/events/${event.id}`} className="hover:underline">
                            {event.title}
                          </Link>
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{event.date}</span>
                          <Clock className="ml-2 h-3 w-3" />
                          <span>{event.time}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
