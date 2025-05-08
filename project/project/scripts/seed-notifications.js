const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notun-thikana';

// Notification schema
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

// Create Notification model
let Notification;
try {
  Notification = mongoose.model('Notification');
} catch (error) {
  Notification = mongoose.model('Notification', NotificationSchema);
}

// Create a dummy user ID
const dummyUserId = new mongoose.Types.ObjectId();

// Sample notification data
const notificationData = [
  {
    title: "New Property Listed",
    message: "A new property has been listed in your area",
    type: "listing",
    isRead: false,
    createdAt: new Date(),
    description: "Check out this new 2-bedroom apartment in Dhaka",
    time: "2 hours ago",
    urgency: "regular",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    actions: ["View Property"],
    userId: dummyUserId
  },
  {
    title: "Message Received",
    message: "You have received a new message from Ahmed",
    type: "message",
    isRead: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    description: "Ahmed has sent you a message about your property listing",
    time: "1 day ago",
    urgency: "regular",
    actions: ["Reply", "View Message"],
    userId: dummyUserId
  },
  {
    title: "Rent Due Reminder",
    message: "Your rent payment is due in 3 days",
    type: "rental",
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    description: "Please ensure your payment is made on time to avoid late fees",
    time: "2 days ago",
    urgency: "urgent",
    actions: ["Pay Now", "Contact Landlord"],
    userId: dummyUserId
  },
  {
    title: "New Blog Post",
    message: "A new blog post about Cox's Bazar has been published",
    type: "blog",
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    description: "Read about the top 10 places to visit in Cox's Bazar",
    time: "3 days ago",
    urgency: "regular",
    image: "https://images.unsplash.com/photo-1590579491624-f98f36d4c763",
    actions: ["Read Now"],
    userId: dummyUserId
  },
  {
    title: "Forum Reply",
    message: "Someone replied to your forum post",
    type: "forum",
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    description: "Nusrat has replied to your question about housing in Dhaka",
    time: "4 days ago",
    urgency: "regular",
    actions: ["View Reply"],
    userId: dummyUserId
  },
  {
    title: "Property Viewing Request",
    message: "Someone wants to view your property",
    type: "listing",
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    description: "Kamal is interested in viewing your property on Saturday",
    time: "5 days ago",
    urgency: "regular",
    actions: ["Accept", "Decline", "Suggest Another Time"],
    userId: dummyUserId
  },
  {
    title: "System Maintenance",
    message: "The system will be down for maintenance tonight",
    type: "announcement",
    isRead: true,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    description: "We'll be performing system maintenance from 2 AM to 4 AM",
    time: "6 days ago",
    urgency: "regular",
    actions: ["Learn More"],
    userId: dummyUserId
  }
];

// Connect to MongoDB
async function seedNotifications() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing notifications
    await Notification.deleteMany({});
    console.log('Cleared existing notifications');

    // Insert new notifications
    const result = await Notification.insertMany(notificationData);
    console.log(`${result.length} notifications inserted successfully`);

    console.log('Database seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedNotifications();
