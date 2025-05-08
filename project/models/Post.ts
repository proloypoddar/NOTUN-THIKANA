import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  author: mongoose.Types.ObjectId;
  content: string;
  images?: string[];
  likes: mongoose.Types.ObjectId[];
  comments: {
    author: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    comments: {
      type: [
        {
          author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          content: {
            type: String,
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
