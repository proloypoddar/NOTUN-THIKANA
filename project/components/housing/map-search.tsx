'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Search, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Fix Leaflet marker icon issue in Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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
  },
];

// Component to handle map clicks and search
function MapEventHandler({ onLocationSelect }: { onLocationSelect: (latlng: [number, number]) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect([lat, lng]);
    },
  });
  return null;
}

interface MapSearchProps {
  onPropertySelect?: (propertyId: string) => void;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
}

export default function MapSearch({ onPropertySelect, onLocationSelect }: MapSearchProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Center on Dhaka, Bangladesh by default
  const defaultCenter: [number, number] = [23.8103, 90.4125];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLocationSelect = async (latlng: [number, number]) => {
    setSelectedLocation(latlng);
    setIsSearching(true);

    try {
      // Reverse geocoding using Nominatim (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng[0]}&lon=${latlng[1]}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        setAddress(data.display_name);
        
        if (onLocationSelect) {
          onLocationSelect({
            lat: latlng[0],
            lng: latlng[1],
            address: data.display_name,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Location selected (address not available)');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      // Geocoding using Nominatim (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setSelectedLocation([parseFloat(lat), parseFloat(lon)]);
        setAddress(display_name);
        
        if (onLocationSelect) {
          onLocationSelect({
            lat: parseFloat(lat),
            lng: parseFloat(lon),
            address: display_name,
          });
        }
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      alert('Error searching for location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePropertyClick = (propertyId: string) => {
    if (onPropertySelect) {
      onPropertySelect(propertyId);
    } else {
      router.push(`/housing/${propertyId}`);
    }
  };

  if (!isMounted) {
    return <div className="h-[500px] w-full bg-muted animate-pulse rounded-md"></div>;
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isSearching}>
          {isSearching ? 'Searching...' : <Search className="h-4 w-4" />}
        </Button>
      </form>

      <div className="h-[500px] w-full overflow-hidden rounded-md border">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Display property markers */}
          {mockProperties.map((property) => (
            <Marker
              key={property.id}
              position={property.location.coordinates as [number, number]}
              icon={customIcon}
              eventHandlers={{
                click: () => handlePropertyClick(property.id),
              }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-medium">{property.title}</h3>
                  <p className="text-sm">৳{property.price}/month</p>
                  <p className="text-xs text-muted-foreground">{property.bedrooms} bed, {property.bathrooms} bath</p>
                  <Button 
                    size="sm" 
                    className="mt-2 w-full"
                    onClick={() => handlePropertyClick(property.id)}
                  >
                    View Details
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Display selected location marker */}
          {selectedLocation && (
            <Marker position={selectedLocation} icon={customIcon}>
              <Popup>
                <div className="p-1">
                  <div className="flex items-center gap-1 font-medium">
                    <MapPin className="h-4 w-4" />
                    <span>Selected Location</span>
                  </div>
                  <p className="text-xs mt-1">{address}</p>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Map event handler for clicks */}
          <MapEventHandler onLocationSelect={handleLocationSelect} />
        </MapContainer>
      </div>

      {selectedLocation && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 mt-0.5 text-primary" />
              <div>
                <h3 className="font-medium">Selected Location</h3>
                <p className="text-sm text-muted-foreground">{address}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedLocation(null)}>
                    Clear
                  </Button>
                  <Button size="sm">
                    <Home className="mr-2 h-4 w-4" />
                    Find Properties Here
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
