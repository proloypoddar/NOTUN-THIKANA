'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <p className="mb-4">Welcome to your profile page. This is a simplified version for Bangladesh users.</p>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <p className="mb-2"><strong>Name:</strong> {session?.user?.name || 'Not logged in'}</p>
        <p className="mb-2"><strong>Email:</strong> {session?.user?.email || 'Not logged in'}</p>
        <p className="mb-2"><strong>Location:</strong> Bangladesh</p>
        <p className="mb-6"><strong>Member since:</strong> 2023</p>

        <Button onClick={() => router.push('/')}>Back to Home</Button>
      </div>
    </div>
  );
}
