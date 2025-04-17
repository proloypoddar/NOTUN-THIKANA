'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Filter, Phone, MapPin, Clock, Star, ExternalLink, Loader2, ArrowLeft } from 'lucide-react';
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

// Map of category to icon/image
const categoryImages: Record<string, string> = {
  hospital: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop',
  ambulance: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=800&auto=format&fit=crop',
  blood_bank: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop',
  catering: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop',
  wedding_planning: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop',
  birthday_party: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop',
  food_delivery: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&auto=format&fit=crop',
  grocery: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=800&auto=format&fit=crop',
  pet_store: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&auto=format&fit=crop',
  emergency: 'https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?w=800&auto=format&fit=crop',
};

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params;
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryName = categoryDisplayNames[category] || category.replace('_', ' ');
  const categoryImage = categoryImages[category] || '';

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `/api/services/${category}`;
        if (searchQuery) {
          url += `?search=${encodeURIComponent(searchQuery)}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        
        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [category, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already handled by the useEffect
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Link href="/services" className="mb-4 flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all services
        </Link>
        
        <div className="relative mb-8 overflow-hidden rounded-lg">
          <img 
            src={categoryImage} 
            alt={categoryName} 
            className="h-64 w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">{categoryName}</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex flex-col gap-4 md:flex-row">
        <Input
          placeholder={`Search ${categoryName.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:max-w-xs"
        />
        <Button type="submit" variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Search
        </Button>
      </form>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading services...</span>
        </div>
      ) : error ? (
        <div className="mt-8 text-center text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service._id} className="overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-48 w-full object-cover"
                />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle>
                      <Link href={`/services/${service.category}/${service._id}`} className="hover:underline">
                        {service.name}
                      </Link>
                    </CardTitle>
                    {service.isVerified && (
                      <Badge variant="secondary">Verified</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">{service.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{service.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{service.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{service.hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span>{service.rating} / 5</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button className="flex-1" asChild>
                    <Link href={`/services/${service.category}/${service._id}`}>
                      <Phone className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </Button>
                  {service.website && (
                    <Button variant="outline" asChild>
                      <Link href={service.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Website
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {services.length === 0 && (
            <div className="mt-8 text-center">
              <p className="text-lg font-medium">No services found</p>
              <p className="text-muted-foreground">Try adjusting your search or check back later</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
