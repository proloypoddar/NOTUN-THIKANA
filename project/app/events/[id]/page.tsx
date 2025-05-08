'use client';

import { useState } from 'react';
<<<<<<< HEAD
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
=======
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapPin, Users, ThumbsUp, MessageSquare, Share2, Flag, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

// Mock event data
const mockEvent = {
  id: '1',
  title: 'Community Meetup',
  description: 'Join us for our monthly community gathering! This is a great opportunity to meet your neighbors, share ideas, and build connections. We\'ll have refreshments, activities, and discussions about upcoming neighborhood projects. Everyone is welcome!',
  date: '2025-04-15',
  time: '18:00',
  location: {
    name: 'Central Community Center',
    address: '123 Main Street, Downtown',
    coordinates: [40.7128, -74.0060],
  },
  category: 'social',
  isPrivate: false,
  creator: {
    id: 'user1',
    name: 'Community Association',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  attendees: 45,
  image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop',
  services: [
    {
      type: 'catering',
      provider: 'Local Delights',
      details: 'Providing refreshments and snacks',
    },
  ],
};

// Mock comments data
const mockComments = [
  {
    id: 'c1',
    content: 'Looking forward to this event! Will there be any activities for children?',
    author: {
      id: 'user2',
      name: 'Sarah Johnson',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    date: '2025-04-10',
    likes: 5,
  },
  {
    id: 'c2',
    content: 'I attended last month and it was great. Highly recommend for newcomers to the area!',
    author: {
      id: 'user3',
      name: 'Michael Chen',
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    date: '2025-04-11',
    likes: 8,
  },
];

// Mock attendees data
const mockAttendees = [
  {
    id: 'user2',
    name: 'Sarah Johnson',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 'user3',
    name: 'Michael Chen',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
  {
    id: 'user4',
    name: 'Aisha Patel',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 'user5',
    name: 'David Wilson',
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
  {
    id: 'user6',
    name: 'Elena Rodriguez',
    image: 'https://randomuser.me/api/portraits/women/90.jpg',
>>>>>>> 74cd30c896a8e1e9599f3de47b7f74e6835a58ba
  },
];

export default function EventDetailPage({ params }: { params: { id: string } }) {
<<<<<<< HEAD
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
=======
  const router = useRouter();
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');
  const [isAttending, setIsAttending] = useState(false);
  const [attendees, setAttendees] = useState(mockAttendees);
  const [attendeeCount, setAttendeeCount] = useState(mockEvent.attendees);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: `c${Date.now()}`,
      content: newComment,
      author: {
        id: 'currentUser',
        name: 'Current User',
        image: 'https://randomuser.me/api/portraits/men/88.jpg',
      },
      date: new Date().toISOString().split('T')[0],
      likes: 0,
    };

    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  const handleAttendEvent = () => {
    if (isAttending) {
      // Remove from attendees
      setAttendees(attendees.filter(a => a.id !== 'currentUser'));
      setAttendeeCount(prev => prev - 1);
    } else {
      // Add to attendees
      const currentUser = {
        id: 'currentUser',
        name: 'Current User',
        image: 'https://randomuser.me/api/portraits/men/88.jpg',
      };
      setAttendees([...attendees, currentUser]);
      setAttendeeCount(prev => prev + 1);
    }
    setIsAttending(!isAttending);
  };

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="mb-8 overflow-hidden">
            <img
              src={mockEvent.image}
              alt={mockEvent.title}
              className="h-64 w-full object-cover"
            />
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle className="text-2xl">{mockEvent.title}</CardTitle>
                  <div className="mt-2">
                    <Badge>{mockEvent.category}</Badge>
                    {mockEvent.isPrivate && <Badge variant="outline">Private</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Flag className="mr-2 h-4 w-4" />
                    Report
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>{format(new Date(mockEvent.date), 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{mockEvent.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{mockEvent.location.name} - {mockEvent.location.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{attendeeCount} attending</span>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="mb-2 text-lg font-semibold">About this event</h3>
                <p className="whitespace-pre-line">{mockEvent.description}</p>
              </div>

              {mockEvent.services.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">Services</h3>
                    <div className="space-y-2">
                      {mockEvent.services.map((service, index) => (
                        <div key={index} className="rounded-lg border p-4">
                          <h4 className="font-medium capitalize">{service.type}</h4>
                          <p className="text-sm text-muted-foreground">Provider: {service.provider}</p>
                          <p className="text-sm text-muted-foreground">{service.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator className="my-6" />

              <div>
                <h3 className="mb-4 text-lg font-semibold">Hosted by</h3>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={mockEvent.creator.image} alt={mockEvent.creator.name} />
                    <AvatarFallback>{mockEvent.creator.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{mockEvent.creator.name}</p>
                    <p className="text-sm text-muted-foreground">Event Organizer</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{comments.length}</span>
                </Button>
              </div>
              <Button
                variant={isAttending ? "outline" : "default"}
                onClick={handleAttendEvent}
              >
                {isAttending ? "Cancel Attendance" : "Attend Event"}
              </Button>
            </CardFooter>
          </Card>

          <h2 className="mb-4 text-xl font-bold">Comments ({comments.length})</h2>

          <Card className="mb-8">
            <CardContent className="p-4">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-4"
              />
              <div className="flex justify-end">
                <Button onClick={handleAddComment}>Post Comment</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-4">
                  <p className="mb-4">{comment.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.image} alt={comment.author.name} />
                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{comment.author.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(comment.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{comment.likes}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Attendees ({attendeeCount})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {attendees.slice(0, 10).map((attendee) => (
                  <Avatar key={attendee.id} className="h-10 w-10">
                    <AvatarImage src={attendee.image} alt={attendee.name} />
                    <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                    <span className="sr-only">{attendee.name}</span>
                  </Avatar>
                ))}
                {attendeeCount > 10 && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm">
                    +{attendeeCount - 10}
                  </div>
                )}
              </div>
              <Separator className="my-4" />
              <Button className="w-full" onClick={handleAttendEvent}>
                {isAttending ? "Cancel Attendance" : "Attend Event"}
              </Button>
>>>>>>> 74cd30c896a8e1e9599f3de47b7f74e6835a58ba
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
