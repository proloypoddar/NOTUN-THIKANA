import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String, 
      required: true 
    },
    category: { 
      type: String, 
      required: true 
    },
    excerpt: { 
      type: String, 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    author: {
      name: { type: String, required: true },
      avatar: { type: String, required: true },
    },
    date: { 
      type: Date, 
      default: Date.now 
    },
    readTime: { 
      type: String, 
      required: true 
    },
    likes: { 
      type: Number, 
      default: 0 
    },
    tags: [String],
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

export const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
