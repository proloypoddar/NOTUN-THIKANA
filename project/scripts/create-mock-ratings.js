// This script creates mock landlord ratings for demonstration purposes
require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// LandlordRating schema
const landlordRatingSchema = new mongoose.Schema({
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String },
  categories: {
    cleanliness: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 },
    location: { type: Number, min: 1, max: 5 },
    accuracy: { type: Number, min: 1, max: 5 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'landlord', 'admin'], default: 'user' },
});

// Create models
const LandlordRating = mongoose.model('LandlordRating', landlordRatingSchema);
const User = mongoose.model('User', userSchema);

// Function to generate a random rating between 3 and 5
function getRandomRating() {
  return Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
}

// Function to create mock ratings
async function createMockRatings() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all landlords
    const landlords = await User.find({ role: 'landlord' });
    
    if (landlords.length === 0) {
      console.log('No landlords found. Please create landlord users first.');
      return;
    }
    
    // Get all tenants (users)
    const tenants = await User.find({ role: 'user' });
    
    if (tenants.length === 0) {
      console.log('No tenants found. Please create user accounts first.');
      return;
    }
    
    console.log(`Found ${landlords.length} landlords and ${tenants.length} tenants`);
    
    // Create 5 ratings for each landlord
    for (const landlord of landlords) {
      console.log(`Creating ratings for landlord: ${landlord.name}`);
      
      // Check if ratings already exist
      const existingRatings = await LandlordRating.countDocuments({ landlord: landlord._id });
      
      if (existingRatings > 0) {
        console.log(`Landlord ${landlord.name} already has ${existingRatings} ratings. Skipping.`);
        continue;
      }
      
      // Create 5 ratings from different tenants or as many as available
      const numRatings = Math.min(5, tenants.length);
      
      for (let i = 0; i < numRatings; i++) {
        const tenant = tenants[i];
        
        // Create a new rating
        const rating = new LandlordRating({
          landlord: landlord._id,
          tenant: tenant._id,
          rating: getRandomRating(),
          review: `Great landlord! Very responsive and professional. Property was as described.`,
          categories: {
            cleanliness: getRandomRating(),
            communication: getRandomRating(),
            value: getRandomRating(),
            location: getRandomRating(),
            accuracy: getRandomRating()
          },
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Random date in the last 30 days
        });
        
        await rating.save();
        console.log(`Created rating from ${tenant.name} for ${landlord.name}`);
      }
    }
    
    console.log('Mock ratings created successfully');
  } catch (error) {
    console.error('Error creating mock ratings:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
createMockRatings();
