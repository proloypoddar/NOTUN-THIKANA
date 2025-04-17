"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BedDouble, Bath, Home, MapPin, Filter, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HousingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const listings = [
    {
      id: 1,
      title: "Modern Apartment in City Center",
      description: "Beautifully furnished 2-bedroom apartment with city views",
      price: 25000,
      location: "Central District",
      bedrooms: 2,
      bathrooms: 1,
      area: 850,
      type: "apartment",
      features: ["furnished", "parking", "elevator"],
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Spacious Family Home",
      description: "4-bedroom house with garden and garage",
      price: 45000,
      location: "Residential Zone",
      bedrooms: 4,
      bathrooms: 2,
      area: 1800,
      type: "house",
      features: ["garden", "garage", "security"],
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop"
    },
    // Add more listings as needed
  ];

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Housing</h1>
          <p className="text-muted-foreground">Find your perfect home</p>
        </div>
        <Button asChild>
          <Link href="/housing/create">Post Listing</Link>
        </Button>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Search locations or properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:max-w-xs"
        />
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Properties</TabsTrigger>
          <TabsTrigger value="apartment">Apartments</TabsTrigger>
          <TabsTrigger value="house">Houses</TabsTrigger>
          <TabsTrigger value="room">Rooms</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden">
            <img
              src={listing.image}
              alt={listing.title}
              className="h-48 w-full object-cover"
            />
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle>
                  <Link href={`/housing/${listing.id}`} className="hover:underline">
                    {listing.title}
                  </Link>
                </CardTitle>
                <p className="text-xl font-bold">৳{listing.price}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">{listing.description}</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {listing.features.map((feature) => (
                  <Badge key={feature} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <BedDouble className="h-4 w-4" />
                  <span>{listing.bedrooms} Beds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4" />
                  <span>{listing.bathrooms} Baths</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4" />
                  <span>{listing.area} sq.ft</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.location}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button className="flex-1" asChild>
                <Link href={`/housing/${listing.id}`}>View Details</Link>
              </Button>
              <Button variant="outline">Save</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}