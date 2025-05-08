'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, UserPlus, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
}

interface UserSearchProps {
  onSelectUser: (user: User) => void;
}

export default function UserSearch({ onSelectUser }: UserSearchProps) {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (searchQuery.length < 2) {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/users?search=${searchQuery}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Error',
          description: 'Failed to search users. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, toast]);

  const handleSelectUser = (user: User) => {
    onSelectUser(user);
    setSelectedUsers(prev => ({
      ...prev,
      [user.id]: true
    }));

    toast({
      title: 'User Added',
      description: `${user.name} has been added to your contacts.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for users..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={selectedUsers[user.id] ? "secondary" : "outline"}
                  onClick={() => handleSelectUser(user)}
                  disabled={selectedUsers[user.id]}
                >
                  {selectedUsers[user.id] ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <UserPlus className="h-4 w-4 mr-1" />
                  )}
                  {selectedUsers[user.id] ? 'Added' : 'Add'}
                </Button>
              </div>
            ))
          ) : searchQuery.length >= 2 ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              No users found. Try a different search term.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
