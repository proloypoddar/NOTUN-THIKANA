// Script to test database connection and seed blogs
const mongoose = require('mongoose');
require('dotenv').config();

// Sample blog data
const sampleBlogs = [
  {
    title: "The Rise of Smart Homes in Bangladesh",
    excerpt: "Explore how smart home technology is transforming urban living in Bangladesh, making homes more efficient and convenient.",
    content: `
      <p>Smart home technology is rapidly gaining popularity in Bangladesh, particularly in urban areas like Dhaka and Chittagong. This technological revolution is changing how people interact with their living spaces, offering unprecedented levels of convenience, security, and energy efficiency.</p>

      <h2>What Makes a Home "Smart"?</h2>
      <p>A smart home integrates various devices and appliances that can be remotely controlled via smartphones or voice commands. These include:</p>
      <ul>
        <li>Smart lighting systems that can be programmed for different times of day</li>
        <li>Security cameras and door locks that can be monitored remotely</li>
        <li>Climate control systems that learn your preferences</li>
        <li>Kitchen appliances that can be operated via apps</li>
      </ul>

      <h2>The Bangladesh Context</h2>
      <p>While smart home technology was once considered a luxury, it's becoming increasingly accessible to middle-class Bangladeshi families. Local companies are now offering affordable smart home solutions tailored to the specific needs and challenges of Bangladesh, such as power backup integration during load shedding.</p>
    `,
    category: "Home Improvement",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    readTime: "5 min read",
    featured: true,
    tags: ["smart home", "technology", "bangladesh"],
    author: {
      name: "Admin",
      avatar: "https://ui-avatars.com/api/?name=Admin",
    },
    date: new Date(),
    likes: Math.floor(Math.random() * 50)
  },
  {
    title: "Exploring Cox's Bazar: Bangladesh's Crown Jewel of Tourism",
    excerpt: "Discover the natural beauty and cultural richness of the world's longest natural sea beach and its surrounding attractions.",
    content: `
      <p>Cox's Bazar, home to the world's longest uninterrupted natural sandy beach stretching 120 kilometers along the Bay of Bengal, is Bangladesh's premier tourist destination. This coastal paradise offers visitors a unique blend of natural beauty, cultural experiences, and adventure.</p>

      <h2>The Magnificent Beach</h2>
      <p>The beach itself is a marvel of nature, with gentle slopes perfect for swimming and golden sands ideal for long walks. Sunrise and sunset views here are particularly spectacular, painting the sky in vibrant hues that reflect off the water.</p>
    `,
    category: "Travel",
    image: "https://images.unsplash.com/photo-1590123047293-ab2f8328b7cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    readTime: "6 min read",
    featured: true,
    tags: ["travel", "beach", "tourism", "bangladesh"],
    author: {
      name: "Admin",
      avatar: "https://ui-avatars.com/api/?name=Admin",
    },
    date: new Date(),
    likes: Math.floor(Math.random() * 50)
  }
];

// Blog schema
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

// Create Blog model
let Blog;
try {
  Blog = mongoose.model('Blog');
} catch (error) {
  Blog = mongoose.model('Blog', BlogSchema);
}

async function seedBlogs() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notun-thikana';
    console.log('Connecting to MongoDB...');
    console.log('URI:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    
    console.log('Connected to MongoDB');
    
    // Check if blogs exist
    const count = await Blog.countDocuments();
    console.log(`Found ${count} existing blogs`);
    
    if (count === 0) {
      console.log('No blogs found, seeding database with sample blogs');
      
      // Create sample blogs
      for (const blog of sampleBlogs) {
        await Blog.create(blog);
        console.log(`Created blog: ${blog.title}`);
      }
      
      console.log('Sample blogs created successfully');
    } else {
      console.log('Blogs already exist, skipping seeding');
    }
    
    // Fetch and display all blogs
    const blogs = await Blog.find();
    console.log(`Retrieved ${blogs.length} blogs:`);
    blogs.forEach((blog, index) => {
      console.log(`${index + 1}. ${blog.title} (${blog._id})`);
    });
    
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedBlogs();
