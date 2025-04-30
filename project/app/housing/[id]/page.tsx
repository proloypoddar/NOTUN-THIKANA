'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  BedDouble, 
  Bath, 
  Square, 
  Home, 
  Check, 
  Star, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

interface PropertyDetail {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  location: {
    address: string;
    coordinates: [number, number];
  };
  features: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  landlord: {
    id: string;
    name: string;
    image: string;
    phone: string;
    email: string;
  };
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
}

// Mock reviews data
const reviews = [
  {
    id: 1,
    author: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    date: '2025-03-15',
    content: 'This property exceeded my expectations. The location is perfect, close to all amenities and public transport. The apartment itself is spacious, modern, and well-maintained. The landlord was very responsive and helpful throughout the entire process.',
  },
  {
    id: 2,
    author: 'Michael Chen',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4,
    date: '2025-03-10',
    content: 'Great property in a nice neighborhood. The apartment is clean and has all the necessary amenities. The only downside is that it can get a bit noisy during weekends due to the nearby restaurants.',
  },
  {
    id: 3,
    author: 'Emily Rodriguez',
    avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
    rating: 5,
    date: '2025-03-05',
    content: 'I absolutely love this place! The natural lighting is amazing, and the layout is perfect for my needs. The building has great security and the neighbors are friendly. Highly recommend!',
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
  {
    id: '4',
    title: 'Modern 2-Bedroom with Balcony',
    price: 28000,
    location: 'Riverside, Eastern District',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
  },
];

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [message, setMessage] = useState('');
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would fetch from your API
        // const res = await fetch(`/api/properties/${params.id}`);
        
        // For now, we'll use mock data
        setTimeout(() => {
          setProperty({
            id: '1',
            title: 'Modern Apartment in City Center',
            description: 'Beautifully furnished 2-bedroom apartment with city views. This spacious apartment features a modern kitchen with stainless steel appliances, hardwood floors throughout, and large windows that provide plenty of natural light. The building has 24/7 security, a fitness center, and a rooftop terrace with panoramic city views. Located in a vibrant neighborhood with restaurants, cafes, and shops within walking distance.',
            type: 'apartment',
            price: 25000,
            location: {
              address: 'Central District, 123 Main Street',
              coordinates: [40.7128, -74.0060],
            },
            features: ['furnished', 'parking', 'elevator', 'security', 'gym', 'balcony', 'air conditioning', 'heating', 'washing machine', 'dishwasher', 'internet', 'tv'],
            bedrooms: 2,
            bathrooms: 1,
            area: 850,
            images: [
              'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop',
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
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching property:', error);
        toast({
          title: "Error",
          description: "Failed to load property details. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPropertyDetail();
    }
  }, [params.id, toast]);

  const handleSaveProperty = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved" : "Saved to favorites",
      description: isSaved 
        ? "Property removed from your saved list" 
        : "Property added to your saved list",
    });
  };

  const handleSendMessage = () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to contact the landlord",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message to send",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would send this message to your API
    console.log('Sending message to landlord:', message);
    
    toast({
      title: "Message sent",
      description: "Your message has been sent to the landlord",
    });
    
    setMessage('');
  };

  const handleNextImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleSubmitReview = () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a review",
        variant: "destructive",
      });
      return;
    }

    if (reviewRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating for your review",
        variant: "destructive",
      });
      return;
    }

    if (!reviewText.trim()) {
      toast({
        title: "Review text required",
        description: "Please enter your review",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would send this review to your API
    console.log('Submitting review:', { rating: reviewRating, text: reviewText });
    
    toast({
      title: "Review submitted",
      description: "Your review has been submitted successfully",
    });
    
    setReviewRating(0);
    setReviewText('');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="h-8 bg-muted rounded w-24 mb-8 animate-pulse" />
        <div className="h-[400px] bg-muted rounded-lg mb-8 animate-pulse" />
        <div className="h-12 bg-muted rounded w-3/4 mb-6 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="h-4 bg-muted rounded w-full animate-pulse" />
            <div className="h-4 bg-muted rounded w-full animate-pulse" />
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
          </div>
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Property not found</h1>
        <p className="mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/housing">Back to Housing</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Housing
      </Button>

      {/* Photo Gallery */}
      {showAllPhotos ? (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">All Photos</h2>
              <Button 
                variant="ghost" 
                onClick={() => setShowAllPhotos(false)}
              >
                Close
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.images.map((image, index) => (
                <div key={index} className="relative h-[300px] rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`Property image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-[500px] rounded-lg overflow-hidden mb-8">
          <Image
            src={property.images[currentImageIndex]}
            alt={property.title}
            fill
            className="object-cover"
          />
          
          {/* Image Navigation */}
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-black/30 text-white hover:bg-black/50 rounded-full"
              onClick={handlePrevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-black/30 text-white hover:bg-black/50 rounded-full"
              onClick={handleNextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {property.images.length}
          </div>
          
          {/* View All Photos Button */}
          <Button 
            className="absolute bottom-4 left-4"
            onClick={() => setShowAllPhotos(true)}
          >
            View All Photos
          </Button>
          
          {/* Save Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 bg-black/30 text-white hover:bg-black/50 rounded-full"
            onClick={handleSaveProperty}
          >
            <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          
          {/* Share Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-16 bg-black/30 text-white hover:bg-black/50 rounded-full"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: property.title,
                  text: property.description,
                  url: window.location.href,
                })
                .catch((error) => console.error('Error sharing:', error));
              } else {
                navigator.clipboard.writeText(window.location.href);
                toast({
                  title: "Link copied",
                  description: "Property link copied to clipboard",
                });
              }
            }}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <div className="text-2xl font-bold text-primary">
                ৳{property.price.toLocaleString()}/month
              </div>
            </div>
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.location.address}</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="font-medium capitalize">{property.type}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Bedrooms</div>
                  <div className="font-medium">{property.bedrooms}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Bathrooms</div>
                  <div className="font-medium">{property.bathrooms}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Square className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Area</div>
                  <div className="font-medium">{property.area} sq.ft</div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="description">
            <TabsList className="mb-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="space-y-4">
              <p>{property.description}</p>
            </TabsContent>
            
            <TabsContent value="features">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="capitalize">{feature}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="location">
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <iframe 
                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(property.location.address)}`}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy"
                  ></iframe>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p>{property.location.address}</p>
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
            
            <TabsContent value="reviews">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl font-bold">4.7</div>
                  <div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-5 w-5 ${star <= 4.7 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
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
          
          {/* Similar Properties */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="relative h-40 w-full">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <Link href={`/housing/${property.id}`}>
                      <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors">
                        {property.title}
                      </h3>
                    </Link>
                    <div className="flex justify-between items-center mt-2">
                      <div className="font-medium text-primary">৳{property.price.toLocaleString()}/month</div>
                      <div className="text-sm text-muted-foreground">{property.bedrooms} bed, {property.bathrooms} bath</div>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{property.location}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        {/* Contact Landlord */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">Contact Landlord</h3>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={property.landlord.image} alt={property.landlord.name} />
                  <AvatarFallback>{property.landlord.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{property.landlord.name}</div>
                  <div className="text-sm text-muted-foreground">Property Owner</div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Phone</div>
                  <div>{property.landlord.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Email</div>
                  <div>{property.landlord.email}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Textarea 
                  placeholder="Write your message to the landlord..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px]"
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
