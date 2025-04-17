'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, Phone, MapPin, Clock, Star, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';



// Service category icons and labels
const serviceCategories = [
  { value: 'all', label: 'All Services' },
  { value: 'hospital', label: 'Hospitals' },
  { value: 'ambulance', label: 'Ambulance Services' },
  { value: 'blood_bank', label: 'Blood Banks' },
  { value: 'catering', label: 'Catering Services' },
  { value: 'wedding_planning', label: 'Wedding Planning' },
  { value: 'birthday_party', label: 'Birthday Party Planning' },
  { value: 'food_delivery', label: 'Food Delivery' },
  { value: 'grocery', label: 'Grocery Stores' },
  { value: 'pet_store', label: 'Pet Stores' },
  { value: 'emergency', label: 'Emergency Services' },
];

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

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = '/api/services';
        if (activeCategory !== 'all') {
          url = `/api/services/${activeCategory}`;
        }
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
  }, [activeCategory, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already handled by the useEffect
  };

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Essential Services</h1>
          <p className="text-muted-foreground">Find and connect with local services</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:max-w-xs"
        />
        <Button type="submit" variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Search
        </Button>
      </form>

      <Tabs defaultValue="all" className="mb-8" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex flex-wrap">
          {serviceCategories.map((category) => (
            <TabsTrigger key={category.value} value={category.value}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

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
                    <Badge variant="outline" className="capitalize">
                      {service.category.replace('_', ' ')}
                    </Badge>
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
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
