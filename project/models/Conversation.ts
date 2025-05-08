import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage: {
    content: string;
    sender: mongoose.Types.ObjectId;
    timestamp: Date;
  };
  unreadCount: {
    [key: string]: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema = new Schema(
  {
    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      required: true,
    },
    lastMessage: {
      content: {
        type: String,
        default: '',
      },
      sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

// Create an index for participants to efficiently find conversations
ConversationSchema.index({ participants: 1 });

export default mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);
