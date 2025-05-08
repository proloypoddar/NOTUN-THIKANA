'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TestPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Test Page</h1>
      
      <div className="mb-8">
        <p className="mb-4">Counter: {count}</p>
        <Button onClick={() => setCount(count + 1)}>Increment</Button>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Navigation</h2>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/messages">Messages</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/forums">Forums</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin">Admin</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
