"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, Clock, Filter, List, Map } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        // Use sample data as fallback
        setEvents([
          {
            id: "1",
            title: "Community Meetup",
            description: "Join us for our monthly community gathering where we'll discuss local issues and share experiences.",
            date: "2025-04-15",
            time: "18:00",
            location: "Central Community Center",
            address: "123 Main Street, Downtown",
            attendees: 45,
            category: "social",
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop"
          },
          {
            id: "2",
            title: "Tech Workshop",
            description: "Learn the basics of web development in this hands-on workshop for beginners.",
            date: "2025-04-20",
            time: "14:00",
            location: "Innovation Hub",
            address: "456 Tech Avenue, Innovation District",
            attendees: 30,
            category: "education",
            image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop"
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (!loading && events.length > 0) {
      // Filter events based on search query and active category
      let filtered = [...events];

      // Filter by category
      if (activeCategory !== "all") {
        filtered = filtered.filter(event => event.category === activeCategory);
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(event =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
        );
      }

      setFilteredEvents(filtered);
    }
  }, [events, searchQuery, activeCategory, loading]);

  if (loading) {
    return (
      <div className="container flex h-96 items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading events...</span>
        </div>
      </div>
    );
  }

  if (error && events.length === 0) {
    return (
      <div className="container py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground">Discover and join local events</p>
          </div>
          <Button asChild>
            <Link href="/events/create">Create Event</Link>
          </Button>
        </div>
        <div className="mt-8 text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Discover and join local events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/events/map">
              <Map className="mr-2 h-4 w-4" />
              Map View
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.length > 0 ? filteredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="h-48 w-full object-cover"
            />
            <CardHeader>
              <CardTitle>
                <Link href={`/events/${event.id}`} className="hover:underline">
                  {event.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">{event.description}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <span className="text-xs text-muted-foreground">{event.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href={`/events/${event.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        )) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg font-medium">No events found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
            <Button className="mt-4" asChild>
              <Link href="/events/create">Create a New Event</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}