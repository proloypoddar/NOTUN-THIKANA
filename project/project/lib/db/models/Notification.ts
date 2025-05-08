import mongoose from 'mongoose';

// Notification schema to store structured data
const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: [
      'bid', 'rental', 'announcement', 'listing', 'message',
      'forum', 'blog', 'friend_request', 'friend_accepted',
      'post_like', 'post_comment', 'system'
    ],
    required: true
  },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  description: { type: String, required: false },
  time: { type: String, required: false },
  urgency: { type: String, enum: ['regular', 'urgent'], default: 'regular' },
  image: { type: String, required: false },
  actions: [{ type: String }],
  relatedId: { type: mongoose.Schema.Types.ObjectId, refPath: 'onModel' },
  onModel: { type: String, enum: ['User', 'Post', 'Message', 'FriendRequest', 'Listing'] },

  // For backward compatibility
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
