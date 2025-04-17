'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Phone, MapPin, Clock, Star, Mail, Globe, ArrowLeft, Loader2, Check } from 'lucide-react';
import Link from 'next/link';

interface Service {
  _id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  rating: number;
  website: string;
  image: string;
  features: string[];
  isVerified: boolean;
  email: string;
}

// Map of category to display name
const categoryDisplayNames: Record<string, string> = {
  hospital: 'Hospitals',
  ambulance: 'Ambulance Services',
  blood_bank: 'Blood Banks',
  catering: 'Catering Services',
  wedding_planning: 'Wedding Planning',
  birthday_party: 'Birthday Party Planning',
  food_delivery: 'Food Delivery Services',
  grocery: 'Grocery Stores',
  pet_store: 'Pet Stores',
  emergency: 'Emergency Services',
};

export default function ServiceDetailPage({ params }: { params: { category: string; id: string } }) {
  const { category, id } = params;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryName = categoryDisplayNames[category] || category.replace('_', ' ');

  useEffect(() => {
    const fetchServiceDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/services/${category}/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch service details');
        }
        
        const data = await response.json();
        setService(data);
      } catch (err) {
        console.error('Error fetching service details:', err);
        setError('Failed to load service details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [category, id]);

  if (loading) {
    return (
      <div className="container flex h-96 items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading service details...</span>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container py-8">
        <Link href={`/services/${category}`} className="mb-4 flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {categoryName}
        </Link>
        <div className="mt-8 text-center text-red-500">
          <p>{error || 'Service not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Link href={`/services/${category}`} className="mb-4 flex items-center text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to {categoryName}
      </Link>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="relative mb-6 overflow-hidden rounded-lg">
            <img 
              src={service.image} 
              alt={service.name} 
              className="h-64 w-full object-cover"
            />
            {service.isVerified && (
              <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                <Check className="mr-1 h-3 w-3" /> Verified
              </Badge>
            )}
          </div>

          <h1 className="mb-2 text-3xl font-bold">{service.name}</h1>
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {service.category.replace('_', ' ')}
            </Badge>
            <div className="flex items-center text-amber-500">
              <Star className="mr-1 h-4 w-4 fill-current" />
              <span>{service.rating} / 5</span>
            </div>
          </div>

          <Tabs defaultValue="about" className="mb-8">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">{service.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{service.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{service.hours}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="features" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="mb-4 text-lg font-medium">Services & Features</h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="capitalize">{feature.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="contact" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="mb-4 text-lg font-medium">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      <span>{service.phone}</span>
                    </div>
                    {service.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        <a href={`mailto:${service.email}`} className="hover:underline">
                          {service.email}
                        </a>
                      </div>
                    )}
                    {service.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        <a href={service.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {service.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-4">
            <CardContent className="pt-6">
              <h3 className="mb-4 text-lg font-medium">Contact & Booking</h3>
              <div className="space-y-4">
                <Button className="w-full" asChild>
                  <a href={`tel:${service.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </a>
                </Button>
                {service.email && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`mailto:${service.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </a>
                  </Button>
                )}
                {service.website && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={service.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Visit Website
                    </a>
                  </Button>
                )}
              </div>

              <div className="mt-6">
                <h4 className="mb-2 font-medium">Business Hours</h4>
                <p className="text-muted-foreground">{service.hours}</p>
              </div>

              <div className="mt-6">
                <h4 className="mb-2 font-medium">Address</h4>
                <p className="text-muted-foreground">{service.address}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
