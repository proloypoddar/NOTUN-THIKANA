'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Search, MapPin, BedDouble, Bath } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// Dynamically import the Leaflet map component to avoid SSR issues
const MapSearch = dynamic(() => import('@/components/housing/map-search'), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-muted animate-pulse rounded-md"></div>
});

// Mock properties data
const mockProperties = [
  {
    id: '1',
    title: 'Modern Apartment in City Center',
    price: 25000,
    location: {
      address: 'Central District, 123 Main Street',
      coordinates: [23.8103, 90.4125], // Dhaka coordinates
    },
    bedrooms: 2,
    bathrooms: 1,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Cozy Studio in Downtown',
    price: 18000,
    location: {
      address: 'Downtown, Central District',
      coordinates: [23.8203, 90.4225], // Slightly offset
    },
    bedrooms: 1,
    bathrooms: 1,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Luxury 3-Bedroom Apartment',
    price: 35000,
    location: {
      address: 'Uptown, Northern District',
      coordinates: [23.8303, 90.4025], // Slightly offset
    },
    bedrooms: 3,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
  },
];

export default function HousingMapPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [nearbyProperties, setNearbyProperties] = useState(mockProperties);
  const [isSearching, setIsSearching] = useState(false);

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setSelectedLocation(location);
    console.log("Selected location:", location);
    
    // In a real app, you would fetch properties near this location
    // For now, we'll simulate a search with a delay
    setIsSearching(true);
    setTimeout(() => {
      // Simulate filtering properties based on location
      setNearbyProperties(mockProperties.slice(0, 2));
      setIsSearching(false);
    }, 1000);
  };

  const handlePropertySelect = (propertyId: string) => {
    router.push(`/housing/${propertyId}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // In a real app, you would search for this location
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-4" asChild>
        <Link href="/housing">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Housing
        </Link>
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Find Housing on Map</h1>
        <p className="text-muted-foreground">
          Search for a location or click on the map to find properties nearby. You can also click on property markers to view details.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <form onSubmit={handleSearch} className="mb-4 flex gap-2">
            <Input
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <div className="h-[600px] overflow-hidden rounded-md border">
            <MapSearch 
              onLocationSelect={handleLocationSelect}
              onPropertySelect={handlePropertySelect}
            />
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="pt-6">
              {selectedLocation ? (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Selected Location</h2>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">How to Use</h2>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Search for a location using the search box</li>
                    <li>• Click anywhere on the map to select a location</li>
                    <li>• Click on property markers to view details</li>
                    <li>• Properties near your selected location will appear here</li>
                  </ul>
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold mb-4">
                  {isSearching 
                    ? "Searching for properties..." 
                    : selectedLocation 
                      ? "Properties Near This Location" 
                      : "Featured Properties"
                  }
                </h2>
                
                {isSearching ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3 animate-pulse">
                        <div className="h-16 w-16 bg-muted rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                          <div className="h-3 bg-muted rounded w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {nearbyProperties.map((property) => (
                      <div 
                        key={property.id} 
                        className="flex gap-3 cursor-pointer hover:bg-muted p-2 rounded-md transition-colors"
                        onClick={() => handlePropertySelect(property.id)}
                      >
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-medium line-clamp-1">{property.title}</h3>
                          <p className="text-sm font-bold text-primary">৳{property.price}/month</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <div className="flex items-center">
                              <BedDouble className="h-3 w-3 mr-1" />
                              {property.bedrooms}
                            </div>
                            <div className="flex items-center">
                              <Bath className="h-3 w-3 mr-1" />
                              {property.bathrooms}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {nearbyProperties.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No properties found in this area. Try a different location.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
