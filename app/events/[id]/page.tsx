'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Share2, Heart, MessageSquare } from 'lucide-react';

// Sample events data
const events = [
  {
    id: 1,
    title: "Community Meetup",
    description: "Join us for our monthly community gathering where we'll discuss local issues and share experiences. This is a great opportunity for newcomers to meet locals and learn more about the community. We'll have refreshments and activities for everyone.\n\nTopics for this month's meetup:\n- Welcome and introductions\n- Community updates and announcements\n- Open discussion on local issues\n- Networking and socializing",
    date: "2025-04-15",
    time: "18:00",
    location: "Central Community Center",
    address: "123 Main Street, Downtown",
    attendees: 45,
    category: "social",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop",
    coordinates: [40.7128, -74.0060],
    organizer: {
      name: "Community Outreach Team",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    attendeesList: [
      { name: "John D.", image: "https://randomuser.me/api/portraits/men/32.jpg" },
      { name: "Sarah K.", image: "https://randomuser.me/api/portraits/women/44.jpg" },
      { name: "Michael C.", image: "https://randomuser.me/api/portraits/men/22.jpg" },
      { name: "Emily J.", image: "https://randomuser.me/api/portraits/women/33.jpg" },
      { name: "David L.", image: "https://randomuser.me/api/portraits/men/53.jpg" },
    ]
  },
  {
    id: 2,
    title: "Tech Workshop",
    description: "Learn the basics of web development in this hands-on workshop for beginners. No prior experience required! We'll cover HTML, CSS, and basic JavaScript to help you build your first website.\n\nWhat to bring:\n- Laptop (required)\n- Notepad and pen\n- Your enthusiasm for learning!\n\nAll participants will receive resources to continue learning after the workshop.",
    date: "2025-04-20",
    time: "14:00",
    location: "Innovation Hub",
    address: "456 Tech Avenue, Innovation District",
    attendees: 30,
    category: "education",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop",
    coordinates: [40.7328, -74.0060],
    organizer: {
      name: "Tech Learning Initiative",
      image: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    attendeesList: [
      { name: "Alex T.", image: "https://randomuser.me/api/portraits/women/22.jpg" },
      { name: "James R.", image: "https://randomuser.me/api/portraits/men/43.jpg" },
      { name: "Linda M.", image: "https://randomuser.me/api/portraits/women/63.jpg" },
    ]
  },
];

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const eventId = parseInt(params.id);
  const event = events.find(e => e.id === eventId);
  const [isAttending, setIsAttending] = useState(false);
  
  if (!event) {
    return (
      <div className="container py-8">
        <Link href="/events" className="mb-4 flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to events
        </Link>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
          <p className="text-muted-foreground mb-4">The event you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/events">Browse All Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Link href="/events" className="mb-4 flex items-center text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to events
      </Link>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="relative mb-6 overflow-hidden rounded-lg">
            <img 
              src={event.image} 
              alt={event.title} 
              className="h-64 w-full object-cover"
            />
            <Badge className="absolute top-4 right-4 bg-primary text-white">
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </Badge>
          </div>

          <h1 className="mb-2 text-3xl font-bold">{event.title}</h1>
          
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>{event.attendees} attending</span>
            </div>
          </div>

          <Tabs defaultValue="about" className="mb-8">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="attendees">Attendees</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-6 flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={event.organizer.image} alt={event.organizer.name} />
                      <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-muted-foreground">Organized by</p>
                      <p className="font-medium">{event.organizer.name}</p>
                    </div>
                  </div>
                  <p className="whitespace-pre-line">{event.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="location" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <h3 className="mb-2 text-lg font-medium">{event.location}</h3>
                    <p className="text-muted-foreground">{event.address}</p>
                  </div>
                  
                  <div className="relative h-[300px] rounded-lg overflow-hidden border bg-muted">
                    {/* Map placeholder - In a real application, this would be an interactive map */}
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <div className="text-center">
                        <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-lg font-medium">Map View</p>
                        <p className="text-sm text-muted-foreground">
                          In a real application, this would show the event location on a map.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="attendees" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="mb-4 text-lg font-medium">People Attending ({event.attendees})</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {event.attendeesList.map((attendee, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={attendee.image} alt={attendee.name} />
                          <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{attendee.name}</p>
                        </div>
                      </div>
                    ))}
                    {isAttending && (
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>Y</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">You</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {event.attendees > event.attendeesList.length ? `And ${event.attendees - event.attendeesList.length} more people are attending.` : ''}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="discussion" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="mb-4 text-lg font-medium">Event Discussion</h3>
                  <div className="rounded-lg border p-4 text-center">
                    <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 font-medium">No comments yet</p>
                    <p className="text-sm text-muted-foreground">Be the first to start a discussion about this event</p>
                    <Button className="mt-4">Add Comment</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-4">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Button 
                  className="w-full" 
                  variant={isAttending ? "outline" : "default"}
                  onClick={() => setIsAttending(!isAttending)}
                >
                  {isAttending ? 'Cancel RSVP' : 'RSVP to Event'}
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Heart className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="mb-2 font-medium">Date & Time</h4>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="mb-2 font-medium">Location</h4>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <p className="ml-6 text-sm text-muted-foreground">{event.address}</p>
              </div>

              <div className="mt-6">
                <h4 className="mb-2 font-medium">Attendees</h4>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{event.attendees} people attending</span>
                </div>
                <div className="mt-2 flex -space-x-2">
                  {event.attendeesList.slice(0, 5).map((attendee, index) => (
                    <Avatar key={index} className="border-2 border-background">
                      <AvatarImage src={attendee.image} alt={attendee.name} />
                      <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  {event.attendees > 5 && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                      +{event.attendees - 5}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
