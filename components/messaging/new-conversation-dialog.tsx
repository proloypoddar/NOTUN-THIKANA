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
import UserSearch from './user-search';

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
}

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
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const handleSelectUser = (user: User) => {
    setSelectedUsers(prev => [...prev, user]);
    onCreateConversation(user.id, user.name, user.image);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>
            Search for users to start a new conversation.
          </DialogDescription>
        </DialogHeader>

        <UserSearch onSelectUser={handleSelectUser} />

        <DialogFooter className="sm:justify-start">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
