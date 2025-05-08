import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  password?: string;
  role: 'user' | 'landlord' | 'admin';
  phone?: string;
  nid?: string;
  verified: boolean;
  createdAt: Date;
  lastActive: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: String,
    password: {
      type: String,
      select: false, // Don't include password in query results by default
    },
    role: {
      type: String,
      enum: ['user', 'landlord', 'admin'],
      default: 'user',
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          // Bangladesh phone number format: +8801XXXXXXXXX
          return !v || /^\+880\d{10}$/.test(v);
        },
        message: (props: any) =>
          `${props.value} is not a valid Bangladesh phone number! Format should be +8801XXXXXXXXX`,
      },
    },
    nid: {
      type: String,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
