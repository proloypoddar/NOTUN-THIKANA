'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BedDouble, Bath, Square, MapPin, Phone, Mail, Heart, Share2, Flag, ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the Leaflet map component to avoid SSR issues
const PropertyMap = dynamic(() => import('@/components/housing/property-map'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-md"></div>
});

// Mock property data
const mockProperty = {
  id: '1',
  title: 'Modern Apartment in City Center',
  description: 'Beautifully furnished 2-bedroom apartment with city views. This spacious apartment features a modern kitchen with stainless steel appliances, hardwood floors throughout, and large windows that provide plenty of natural light. The building has 24/7 security, a fitness center, and a rooftop terrace with panoramic city views. Located in a vibrant neighborhood with restaurants, cafes, and shops within walking distance.',
  type: 'apartment',
  price: 25000,
  location: {
    address: 'Central District, 123 Main Street',
    coordinates: [23.8103, 90.4125], // Dhaka coordinates
  },
  features: ['furnished', 'parking', 'elevator', 'security', 'gym', 'balcony'],
  bedrooms: 2,
  bathrooms: 1,
  area: 850,
  images: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
  ],
  landlord: {
    id: 'user1',
    name: 'John Smith',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    phone: '+1234567890',
    email: 'john.smith@example.com',
  },
  isApproved: true,
  isFeatured: true,
  createdAt: '2025-04-01',
};

// Mock reviews data
const reviews = [
  {
    id: 1,
    author: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    date: '2025-03-15',
    content: 'This property exceeded my expectations. The location is perfect, close to all amenities and public transport. The apartment itself is spacious, modern, and well-maintained.',
  },
  {
    id: 2,
    author: 'Michael Chen',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4,
    date: '2025-03-10',
    content: 'Great property in a nice neighborhood. The apartment is clean and has all the necessary amenities. The only downside is that it can get a bit noisy during weekends due to the nearby restaurants.',
  },
];

// Mock similar properties
const similarProperties = [
  {
    id: '2',
    title: 'Cozy Studio in Downtown',
    price: 18000,
    location: 'Downtown, Central District',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    id: '3',
    title: 'Luxury 3-Bedroom Apartment',
    price: 35000,
    location: 'Uptown, Northern District',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
  },
];

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // In a real app, you would send this message to the landlord
    console.log('Sending message to landlord:', message);
    
    // Clear the message input
    setMessage('');
    
    // Show a success message or redirect to messages
    alert('Message sent to landlord!');
  };

  const handleSaveProperty = () => {
    setIsSaved(!isSaved);
  };

  const handleSubmitReview = () => {
    if (!reviewText.trim() || reviewRating === 0) return;
    
    // In a real app, you would send this review to your API
    console.log('Submitting review:', { rating: reviewRating, text: reviewText });
    
    // Clear the review form
    setReviewText('');
    setReviewRating(0);
    
    // Show a success message
    alert('Review submitted successfully!');
  };

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Listings
      </Button>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="mb-8 overflow-hidden">
            <div className="relative h-[400px] w-full">
              <img
                src={mockProperty.images[currentImageIndex]}
                alt={`${mockProperty.title} - Image ${currentImageIndex + 1}`}
                className="h-full w-full object-cover"
              />
              {mockProperty.images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {mockProperty.images.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 w-8 rounded-full ${
                        index === currentImageIndex ? 'bg-primary' : 'bg-white/70'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
              {mockProperty.isFeatured && (
                <Badge className="absolute left-4 top-4" variant="secondary">
                  Featured
                </Badge>
              )}
            </div>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle className="text-2xl">{mockProperty.title}</CardTitle>
                  <p className="text-xl font-bold text-primary">৳{mockProperty.price}/month</p>
                  <div className="mt-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{mockProperty.location.address}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSaveProperty}>
                    <Heart className={`mr-2 h-4 w-4 ${isSaved ? 'fill-primary text-primary' : ''}`} />
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
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
              <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-1">
                  <BedDouble className="h-4 w-4 text-muted-foreground" />
                  <span>{mockProperty.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-1">
                  <Bath className="h-4 w-4 text-muted-foreground" />
                  <span>{mockProperty.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-1">
                  <Square className="h-4 w-4 text-muted-foreground" />
                  <span>{mockProperty.area} sq.ft</span>
                </div>
              </div>

              <Tabs defaultValue="description">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-4">
                  <p className="whitespace-pre-line">{mockProperty.description}</p>
                </TabsContent>
                
                <TabsContent value="features" className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {mockProperty.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="capitalize">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="location" className="mt-4">
                  <div className="space-y-4">
                    <div className="h-[300px] w-full overflow-hidden rounded-md">
                      <PropertyMap 
                        position={mockProperty.location.coordinates} 
                        address={mockProperty.location.address}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Address</h3>
                      <p>{mockProperty.location.address}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Nearby</h3>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Public transport within 5 minutes walk</li>
                        <li>Shopping center within 10 minutes walk</li>
                        <li>Restaurants and cafes within 5 minutes walk</li>
                        <li>Park within 15 minutes walk</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-4">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-4xl font-bold">4.5</div>
                      <div>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-5 w-5 ${star <= 4.5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">Based on {reviews.length} reviews</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src={review.avatar} alt={review.author} />
                                <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="font-medium">{review.author}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(review.date).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="flex items-center mb-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                                <p className="text-sm">{review.content}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4">Write a Review</h3>
                        <div className="mb-4">
                          <div className="text-sm mb-2">Rating</div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Button 
                                key={star} 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setReviewRating(star)}
                              >
                                <Star 
                                  className={`h-6 w-6 ${star <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                                />
                              </Button>
                            ))}
                          </div>
                        </div>
                        <Textarea 
                          placeholder="Share your experience with this property..." 
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="mb-4"
                        />
                        <Button onClick={handleSubmitReview}>Submit Review</Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Contact Landlord</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={mockProperty.landlord.image} alt={mockProperty.landlord.name} />
                    <AvatarFallback>{mockProperty.landlord.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{mockProperty.landlord.name}</p>
                    <p className="text-sm text-muted-foreground">Property Owner</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${mockProperty.landlord.phone}`} className="text-sm hover:underline">
                      {mockProperty.landlord.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${mockProperty.landlord.email}`} className="text-sm hover:underline">
                      {mockProperty.landlord.email}
                    </a>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <Textarea
                  placeholder="Write a message to the landlord..."
                  className="mb-4 min-h-[100px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button className="w-full" onClick={handleSendMessage}>
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
