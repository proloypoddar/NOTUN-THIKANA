const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notun-thikana';

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

// Sample blog data
const blogData = [
  {
    title: "10 Must-Visit Places in Cox's Bazar",
    image: "https://images.unsplash.com/photo-1590579491624-f98f36d4c763",
    category: "Travel",
    excerpt: "Discover the hidden gems of the world's longest natural sea beach and make the most of your visit.",
    content: `<p>Cox's Bazar, home to the world's longest natural sea beach, is a treasure trove of natural beauty and cultural experiences. Here are the top 10 places you must visit when in Cox's Bazar:</p>
    
    <h2>1. Inani Beach</h2>
    <p>Located about 32 km south of Cox's Bazar town, Inani Beach is famous for its unique rocky shore and crystal clear water. The unique feature of this beach is its golden sand and the stones that are found here.</p>
    
    <h2>2. Himchari National Park</h2>
    <p>Just 8 km from Cox's Bazar, Himchari National Park offers a breathtaking view of the Bay of Bengal from its hilltop. The park is home to diverse wildlife and has a beautiful waterfall that is most spectacular during the monsoon season.</p>
    
    <h2>3. Maheshkhali Island</h2>
    <p>This island is known for its Buddhist and Hindu temples. The most famous is the Adinath Temple, dedicated to Lord Shiva. The island also offers panoramic views of the sea and surrounding hills.</p>
    
    <h2>4. Sonadia Island</h2>
    <p>A paradise for birdwatchers, Sonadia Island is home to many migratory birds. The island's mangrove forest and pristine beaches make it a perfect getaway from the crowded main beach.</p>
    
    <h2>5. Ramu</h2>
    <p>This small village is known for its Buddhist monasteries and pagodas. The village is also famous for its handicrafts, especially handmade cigars and unique style of weaving.</p>`,
    author: {
      name: "Ahmed Khan",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    date: new Date("2025-04-10"),
    readTime: "8 min read",
    likes: 145,
    tags: ["travel", "beach", "Bangladesh", "Cox's Bazar"],
    featured: true
  },
  {
    title: "Exploring the Sundarbans: A Complete Guide",
    image: "https://images.unsplash.com/photo-1630662952636-a1b68e30f6fc",
    category: "Wildlife",
    excerpt: "Everything you need to know about visiting the world's largest mangrove forest and spotting the Royal Bengal Tiger.",
    content: `<p>The Sundarbans, a UNESCO World Heritage Site, is the largest mangrove forest in the world and home to the magnificent Royal Bengal Tiger. Here's your complete guide to exploring this natural wonder:</p>
    
    <h2>Best Time to Visit</h2>
    <p>The ideal time to visit the Sundarbans is between November and February when the weather is pleasant. Avoid the monsoon season (June to September) as heavy rainfall can disrupt your plans.</p>
    
    <h2>How to Get There</h2>
    <p>The most common starting point for a Sundarbans tour is Khulna. From Dhaka, you can take a bus or train to Khulna, and then a boat to the Sundarbans. Alternatively, you can book a tour package that includes transportation from Dhaka.</p>
    
    <h2>Wildlife to Spot</h2>
    <p>The Sundarbans is home to the Royal Bengal Tiger, spotted deer, wild boars, and various species of monkeys. The forest is also a paradise for birdwatchers with over 300 species of birds.</p>
    
    <h2>Safety Tips</h2>
    <p>Always stay with your guide and follow their instructions. Do not venture into the forest alone. Carry insect repellent, sunscreen, and wear full-sleeved clothes to protect yourself from mosquitoes and the sun.</p>
    
    <h2>Local Culture</h2>
    <p>The people living around the Sundarbans have a unique culture influenced by the forest. They worship Bonbibi, the goddess of the forest, who they believe protects them from tigers and other dangers.</p>`,
    author: {
      name: "Nusrat Jahan",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    date: new Date("2025-04-05"),
    readTime: "10 min read",
    likes: 210,
    tags: ["wildlife", "Sundarbans", "Bangladesh", "Royal Bengal Tiger"],
    featured: true
  },
  {
    title: "The Historical Significance of Ahsan Manzil",
    image: "https://images.unsplash.com/photo-1609946860441-a51ffcf22208",
    category: "Culture",
    excerpt: "Learn about the rich history of the Pink Palace and its importance in Bangladesh's cultural heritage.",
    content: `<p>Ahsan Manzil, commonly known as the Pink Palace, is one of the most significant architectural monuments of Bangladesh. Let's explore its rich history and cultural importance:</p>
    
    <h2>Historical Background</h2>
    <p>Built in 1872, Ahsan Manzil was the official residential palace and seat of the Nawab of Dhaka. The palace was named after Nawab Khwaja Ahsanullah, son of Nawab Khwaja Alimullah. The construction was completed in 1872 and it was constructed in the Indo-Saracenic Revival architecture.</p>
    
    <h2>Architectural Marvel</h2>
    <p>The palace is a two-storied building with a dome on top, which can be seen from miles around. The dome is 27 feet high from the floor. The palace has 31 rooms with a huge drawing room, known as the Rangmahal, which features a wooden floor.</p>
    
    <h2>Historical Events</h2>
    <p>Ahsan Manzil has witnessed many historical events. It was here that the famous Nawab Salimullah Khan hosted Lord Curzon during his visit to East Bengal in 1904, which eventually led to the Partition of Bengal in 1905.</p>
    
    <h2>Museum Today</h2>
    <p>Today, Ahsan Manzil serves as a museum that displays items from the era of the Nawabs, showcasing the lifestyle of the aristocratic families of that time. The museum has 23 galleries displaying various historical artifacts.</p>
    
    <h2>Visiting Information</h2>
    <p>The museum is open from Saturday to Wednesday from 10:30 AM to 5:30 PM during summer and from 9:30 AM to 4:30 PM during winter. It is closed on Thursday. The entry fee is nominal and photography is allowed inside the museum.</p>`,
    author: {
      name: "Rafiq Islam",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    date: new Date("2025-03-28"),
    readTime: "7 min read",
    likes: 178,
    tags: ["culture", "history", "Dhaka", "Bangladesh"],
    featured: false
  },
  {
    title: "Traditional Bengali Cuisine: A Culinary Journey",
    image: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10",
    category: "Food",
    excerpt: "Dive into the rich flavors and diverse dishes that make Bengali cuisine one of the most distinctive in South Asia.",
    content: `<p>Bengali cuisine is known for its subtle yet sometimes fiery flavors and its emphasis on fish, vegetables, and lentils served with rice. Let's explore the culinary treasures of Bengal:</p>
    
    <h2>Staple Foods</h2>
    <p>Rice and fish are the staple foods of Bengali cuisine. The saying "Mache Bhate Bangali" (Bengalis are made of fish and rice) reflects the importance of these two items in the Bengali diet.</p>
    
    <h2>Famous Fish Dishes</h2>
    <p>Ilish (Hilsa) is considered the king of fish in Bengali cuisine. Dishes like Ilish Bhapa (steamed Hilsa), Ilish Paturi (Hilsa wrapped in banana leaf), and Ilish Machher Jhol (Hilsa curry) are extremely popular.</p>
    
    <h2>Vegetarian Delights</h2>
    <p>Bengali cuisine offers a wide range of vegetarian dishes. Shukto (a mixed vegetable stew), Labra (mixed vegetable curry), and Chocchori (dry mixed vegetable dish) are some examples.</p>
    
    <h2>Sweet Treats</h2>
    <p>Bengalis are known for their love of sweets. Rasgulla, Sandesh, Mishti Doi (sweet yogurt), and Pantua are some of the famous Bengali sweets that are loved across the country.</p>
    
    <h2>Street Food</h2>
    <p>Bengali street food is a culinary adventure in itself. Phuchka (similar to Pani Puri), Jhal Muri (spicy puffed rice), and Ghugni (yellow pea curry) are popular street foods that you must try.</p>`,
    author: {
      name: "Sadia Rahman",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    date: new Date("2025-03-20"),
    readTime: "6 min read",
    likes: 156,
    tags: ["food", "cuisine", "Bangladesh", "culture"],
    featured: false
  },
  {
    title: "Sustainable Tourism Practices in Bangladesh",
    image: "https://images.unsplash.com/photo-1590579491624-f98f36d4c763",
    category: "Environment",
    excerpt: "How Bangladesh is embracing eco-friendly tourism to protect its natural beauty for future generations.",
    content: `<p>As tourism grows in Bangladesh, so does the importance of sustainable practices to preserve the country's natural beauty. Here's how Bangladesh is embracing eco-friendly tourism:</p>
    
    <h2>Community-Based Tourism</h2>
    <p>Many communities in Bangladesh, especially in the Chittagong Hill Tracts and the Sundarbans area, have started community-based tourism initiatives. These initiatives ensure that the local communities benefit directly from tourism while preserving their cultural heritage.</p>
    
    <h2>Eco-Friendly Accommodations</h2>
    <p>Several eco-resorts have sprung up across Bangladesh, particularly in Cox's Bazar and Sylhet. These resorts use renewable energy, practice waste reduction, and often source their food locally.</p>
    
    <h2>Conservation Efforts</h2>
    <p>The Bangladesh government has designated several areas as protected to conserve biodiversity. The Sundarbans, Lawachara National Park, and Satchari National Park are examples of such protected areas where sustainable tourism is promoted.</p>
    
    <h2>Plastic Reduction</h2>
    <p>Many tourist destinations in Bangladesh have started campaigns to reduce plastic use. Some beaches in Cox's Bazar have banned single-use plastics, and many tour operators encourage tourists to carry reusable water bottles.</p>
    
    <h2>Responsible Wildlife Tourism</h2>
    <p>Tour operators in the Sundarbans and other wildlife-rich areas are increasingly adopting responsible wildlife viewing practices. These include maintaining a safe distance from animals, not feeding them, and educating tourists about wildlife conservation.</p>`,
    author: {
      name: "Kamal Hossain",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    date: new Date("2025-03-15"),
    readTime: "9 min read",
    likes: 132,
    tags: ["environment", "tourism", "sustainability", "Bangladesh"],
    featured: false
  }
];

// Connect to MongoDB
async function seedBlogs() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing blogs
    await Blog.deleteMany({});
    console.log('Cleared existing blogs');

    // Insert new blogs
    const result = await Blog.insertMany(blogData);
    console.log(`${result.length} blogs inserted successfully`);

    console.log('Database seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedBlogs();
