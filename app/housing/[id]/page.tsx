'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { BedDouble, Bath, Square, MapPin, Phone, Mail, Heart, Share2, Flag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock property data
const mockProperty = {
  id: '1',
  title: 'Modern Apartment in City Center',
  description: 'Beautifully furnished 2-bedroom apartment with city views. This spacious apartment features a modern kitchen with stainless steel appliances, hardwood floors throughout, and large windows that provide plenty of natural light. The building has 24/7 security, a fitness center, and a rooftop terrace with panoramic city views. Located in a vibrant neighborhood with restaurants, cafes, and shops within walking distance.',
  type: 'apartment',
  price: 25000,
  location: {
    address: 'Central District, 123 Main Street',
    coordinates: [40.7128, -74.0060],
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

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false);

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

              <Separator className="my-6" />

              <div>
                <h3 className="mb-2 text-lg font-semibold">Description</h3>
                <p className="whitespace-pre-line">{mockProperty.description}</p>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="mb-4 text-lg font-semibold">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {mockProperty.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="capitalize">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
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
