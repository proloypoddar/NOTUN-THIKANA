import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'hospital',
      'catering',
      'wedding_planning',
      'birthday_party',
      'ambulance',
      'blood_bank',
      'food_delivery',
      'grocery',
      'pet_store',
      'emergency'
    ]
  },
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: String,
  website: String,
  hours: String,
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  image: String,
  images: [String],
  location: {
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  features: [String],
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
