import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  image: String,
  password: {
    type: String,
    select: false // Don't include password in query results by default
  },
  role: {
    type: String,
    enum: ['user', 'landlord', 'admin'],
    default: 'user'
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        // Bangladesh phone number format: +8801XXXXXXXXX
        return !v || /^\+880\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid Bangladesh phone number! Format should be +8801XXXXXXXXX`
    }
  },
  nid: {
    type: String,
    trim: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);