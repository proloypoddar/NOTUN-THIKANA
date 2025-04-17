import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: String,
  location: {
    name: String,
    address: String,
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  category: {
    type: String,
    required: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  services: [{
    type: {
      type: String,
      enum: ['catering', 'ambulance', 'hospital', 'blood_bank', 'food_delivery', 'grocery', 'pet_store', 'wedding_planning', 'birthday_party', 'emergency'],
      required: true
    },
    provider: String,
    details: String
  }],
  isBoosted: {
    type: Boolean,
    default: false
  },
  boostExpiry: Date,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Define a proper schema for location that doesn't use GeoJSON
EventSchema.index({ 'location.name': 1 });

export const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);