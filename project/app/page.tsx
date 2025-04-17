'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Calendar, MessageSquare, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSeedDatabase = async () => {
    if (status !== 'authenticated' || session?.user.role !== 'admin') {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/seed');
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error seeding database:', error);
      alert('Error seeding database');
    } finally {
      setIsLoading(false);
    }
  };
  const features = [
    {
      icon: MessageSquare,
      title: "Community Forums",
      description: "Connect with locals and get advice on city life",
    },
    {
      icon: Calendar,
      title: "Local Events",
      description: "Discover and join events happening in your area",
    },
    {
      icon: Building2,
      title: "Housing Solutions",
      description: "Find your perfect home with verified listings",
    },
    {
      icon: Zap,
      title: "Essential Services",
      description: "Quick access to emergency and daily services",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Welcome to Your New Urban Community
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Connect with locals, find housing, and access essential services in your city.
            Notun Thikana makes urban living easier and more connected.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/events">Explore Events</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/forums">Join Discussions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">Everything You Need in One Place</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border-2">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-lg bg-primary py-16 px-4 text-center text-primary-foreground">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-3xl font-bold">Ready to Join Your Community?</h2>
          <p className="mb-8 text-lg opacity-90">
            Create an account to start connecting with your urban community today.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Admin Section - Only visible to admins */}
      {status === 'authenticated' && session?.user.role === 'admin' && (
        <section className="mt-16 mb-8 rounded-lg border border-dashed border-muted-foreground p-4">
          <h2 className="mb-4 text-xl font-bold">Admin Controls</h2>
          <p className="mb-4 text-muted-foreground">
            Welcome, Admin! You can use these controls to manage the application.
          </p>
          <Button onClick={handleSeedDatabase} disabled={isLoading}>
            {isLoading ? 'Seeding Database...' : 'Seed Database with Test Data'}
          </Button>
        </section>
      )}
    </div>
  );
}