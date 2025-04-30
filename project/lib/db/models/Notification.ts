import mongoose from 'mongoose';

// Notification schema to store structured data
const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['bid', 'rental', 'announcement', 'listing', 'message', 'forum', 'blog'], required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', default: null },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  description: { type: String, required: false },
  time: { type: String, required: false },
  urgency: { type: String, enum: ['regular', 'urgent'], default: 'regular' },
  image: { type: String, required: false },
  actions: [{ type: String }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
