import mongoose, { Schema, models } from 'mongoose';

const ProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    nid: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    occupation: {
      type: String,
    },
    bio: {
      type: String,
    },
    address: {
      street: String,
      area: String,
      city: String,
      district: String,
      division: String,
      postalCode: String,
    },
    education: {
      level: String,
      institution: String,
      fieldOfStudy: String,
      graduationYear: String,
    },
    emergencyContact: {
      name: String,
      relation: String,
      phone: String,
    },
    preferences: {
      receiveNotifications: {
        type: Boolean,
        default: true,
      },
      newsletterSubscription: {
        type: Boolean,
        default: true,
      },
      language: {
        type: String,
        default: 'Bengali',
      },
    },
  },
  { timestamps: true }
);

export const Profile = models.Profile || mongoose.model('Profile', ProfileSchema);
