'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';

// Mock users for the demo
const mockUsers = [
  {
    id: 'user6',
    name: 'John Smith',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 'user7',
    name: 'Maria Garcia',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: 'user8',
    name: 'Ahmed Hassan',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: 'user9',
    name: 'Priya Sharma',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
  {
    id: 'user10',
    name: 'Carlos Rodriguez',
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
];

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateConversation: (userId: string, userName: string, userImage: string) => void;
}

export default function NewConversationDialog({
  open,
  onOpenChange,
  onCreateConversation,
}: NewConversationDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>
            Search for users to start a new conversation.
          </DialogDescription>
        </DialogHeader>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {filteredUsers.length > 0 ? (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                  onClick={() => onCreateConversation(user.id, user.name, user.image)}
                >
                  <Avatar>
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium">{user.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No users found</p>
          )}
        </div>
        <DialogFooter className="sm:justify-start">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
