import mongoose, { Schema, Document } from 'mongoose';

export type NotificationType = 
  | 'friend_request' 
  | 'friend_accept' 
  | 'post_like' 
  | 'post_comment' 
  | 'event_invite' 
  | 'message' 
  | 'system';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: NotificationType;
  read: boolean;
  content: string;
  link: string;
  relatedId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['friend_request', 'friend_accept', 'post_like', 'post_comment', 'event_invite', 'message', 'system'],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    relatedId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
  },
  { timestamps: true }
);

// Create indexes for efficient querying
NotificationSchema.index({ recipient: 1, read: 1 });
NotificationSchema.index({ recipient: 1, createdAt: -1 });

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
