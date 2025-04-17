import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['apartment', 'house', 'room', 'studio'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    address: String,
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  features: [{
    type: String
  }],
  bedrooms: Number,
  bathrooms: Number,
  area: Number,
  images: [String],
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Remove the 2dsphere index since we're not using GeoJSON format
// PropertySchema.index({ location: '2dsphere' });

export const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);