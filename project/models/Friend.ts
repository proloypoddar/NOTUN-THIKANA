import mongoose, { Schema, Document } from 'mongoose';

export type FriendStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

export interface IFriend extends Document {
  requester: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  status: FriendStatus;
  createdAt: Date;
  updatedAt: Date;
}

const FriendSchema: Schema = new Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'blocked'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Create compound indexes for efficient querying
FriendSchema.index({ requester: 1, recipient: 1 }, { unique: true });
FriendSchema.index({ requester: 1, status: 1 });
FriendSchema.index({ recipient: 1, status: 1 });

export default mongoose.models.Friend || mongoose.model<IFriend>('Friend', FriendSchema);
