import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  content: string;
  read: boolean;
  conversationId: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    conversationId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create a compound index for conversationId and createdAt for efficient querying
MessageSchema.index({ conversationId: 1, createdAt: 1 });

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
