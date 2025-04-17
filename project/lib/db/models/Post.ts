import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: true
  },
  tags: [String],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  isBoosted: {
    type: Boolean,
    default: false
  },
  boostExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);