'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  id: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
  };
  unread: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-center text-muted-foreground">No conversations found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={cn(
            'flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors',
            selectedId === conversation.id
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-muted'
          )}
          onClick={() => onSelect(conversation.id)}
        >
          <Avatar>
            <AvatarImage src={conversation.user.image} alt={conversation.user.name} />
            <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{conversation.user.name}</h3>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <p className="truncate text-sm text-muted-foreground">
              {conversation.lastMessage.content}
            </p>
          </div>
          {conversation.unread > 0 && (
            <Badge variant="default" className="h-5 w-5 rounded-full p-0 text-center">
              {conversation.unread}
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
}
