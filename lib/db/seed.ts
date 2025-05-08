import dbConnect from './connect';
import { User } from './models/User';
import { Event } from './models/Event';
import { Post } from './models/Post';
import { Property } from './models/Property';
import { Message } from './models/Message';
import { Service } from './models/Service';

// Sample users
const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'user',
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'password123',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'user',
  },
  {
    name: 'Michael Chen',
    email: 'michael@example.com',
    password: 'password123',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    role: 'landlord',
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    role: 'admin',
  },
];

// Sample events
const createEvents = (userIds: string[]) => [
  {
    title: 'Community Meetup',
    description: 'Join us for our monthly community gathering!',
    date: new Date('2025-04-15'),
    time: '18:00',
    location: {
      name: 'Central Community Center',
      address: '123 Main Street, Downtown',
      coordinates: [40.7128, -74.0060],
    },
    category: 'social',
    isPrivate: false,
    creator: userIds[0],
    attendees: [userIds[1], userIds[2]],
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop',
  },
  {
    title: 'Tech Workshop',
    description: 'Learn the basics of web development',
    date: new Date('2025-04-20'),
    time: '14:00',
    location: {
      name: 'Innovation Hub',
      address: '456 Tech Avenue, Innovation District',
      coordinates: [40.7328, -74.0060],
    },
    category: 'education',
    isPrivate: false,
    creator: userIds[1],
    attendees: [userIds[0]],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop',
  },
];

// Sample forum posts
const createPosts = (userIds: string[]) => [
  {
    title: 'Best areas for newcomers?',
    content: 'I\'m moving to the city next month for a new job. Which areas would you recommend for young professionals?',
    author: userIds[0],
    category: 'housing',
    isAnonymous: false,
    tags: ['newcomer', 'housing', 'advice'],
    comments: [
      {
        content: 'I would recommend the Riverside district. It\'s safe and has great public transport connections.',
        author: userIds[1],
        isAnonymous: false,
      },
      {
        content: 'Downtown is great if you want to be close to everything, but it might be a bit above your budget.',
        author: userIds[2],
        isAnonymous: true,
      },
    ],
  },
  {
    title: 'Looking for language exchange partners',
    content: 'I\'m learning Bengali and would love to practice with native speakers. Anyone interested in language exchange?',
    author: userIds[1],
    category: 'education',
    isAnonymous: false,
    tags: ['language', 'education', 'community'],
    comments: [
      {
        content: 'I\'m a native Bengali speaker and would be happy to help! I\'m also learning English.',
        author: userIds[2],
        isAnonymous: false,
      },
    ],
  },
];

// Sample properties
const createProperties = (userIds: string[]) => [
  // Make sure userIds[2] exists before using it as the landlord
  ...(userIds.length > 2 ? [
  {
    title: 'Modern Apartment in City Center',
    description: 'Beautifully furnished 2-bedroom apartment with city views.',
    type: 'apartment',
    price: 25000,
    location: {
      address: 'Central District, 123 Main Street',
      coordinates: [40.7128, -74.0060],
    },
    features: ['furnished', 'parking', 'elevator', 'security', 'gym', 'balcony'],
    bedrooms: 2,
    bathrooms: 1,
    area: 850,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
    ],
    owner: userIds[2],
    landlord: userIds[2], // Add landlord field
    isApproved: true,
    isFeatured: true,
  },
  {
    title: 'Cozy Studio near University',
    description: 'Perfect for students, this studio apartment is just a 5-minute walk from the university.',
    type: 'studio',
    price: 15000,
    location: {
      address: 'University District, 456 College Road',
      coordinates: [40.7328, -74.0060],
    },
    features: ['furnished', 'internet', 'utilities_included'],
    bedrooms: 1,
    bathrooms: 1,
    area: 450,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
    ],
    owner: userIds[2],
    landlord: userIds[2], // Add landlord field
    isApproved: true,
    isFeatured: false,
  }] : []),
];

// Sample services
const services = [
  {
    name: 'City General Hospital',
    category: 'hospital',
    description: 'Full-service hospital with emergency care and specialized departments.',
    address: '123 Main Street, Central District',
    phone: '+1234567890',
    email: 'info@citygeneralhospital.com',
    website: 'https://example.com/cityhospital',
    hours: '24/7',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516549655669-df668a1d40e8?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop',
    ],
    features: ['emergency', 'surgery', 'pediatrics', 'cardiology', 'neurology'],
    isVerified: true,
  },
  {
    name: 'Quick Ambulance Service',
    category: 'ambulance',
    description: 'Fast emergency medical transportation with trained paramedics.',
    address: 'Citywide Service',
    phone: '+1234567891',
    email: 'dispatch@quickambulance.com',
    website: 'https://example.com/quickambulance',
    hours: '24/7',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1612531385446-f7e6d131e1d0?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1612398277292-e4e37b89e3e2?w=800&auto=format&fit=crop',
    ],
    features: ['emergency', '24/7', 'trained_staff', 'modern_equipment'],
    isVerified: true,
  },
  {
    name: 'Lifeline Blood Bank',
    category: 'blood_bank',
    description: 'Blood donation and supply center with all blood types available.',
    address: '456 Health Avenue, Medical District',
    phone: '+1234567892',
    email: 'donate@lifelinebloodbank.com',
    website: 'https://example.com/lifelinebloodbank',
    hours: '8:00 AM - 8:00 PM',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?w=800&auto=format&fit=crop',
    ],
    features: ['all_blood_types', 'donation', 'testing', 'storage'],
    isVerified: true,
  },
  {
    name: 'Tasty Bites Catering',
    category: 'catering',
    description: 'Professional catering for all events with customizable menus.',
    address: '789 Food Street, Restaurant Row',
    phone: '+1234567893',
    email: 'events@tastybites.com',
    website: 'https://example.com/tastybites',
    hours: '9:00 AM - 7:00 PM',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop',
    ],
    features: ['weddings', 'corporate', 'parties', 'custom_menus', 'staff'],
    isVerified: true,
  },
  {
    name: 'Dream Wedding Planners',
    category: 'wedding_planning',
    description: 'Full-service wedding planning from engagement to reception.',
    address: '101 Celebration Avenue, Event District',
    phone: '+1234567894',
    email: 'plan@dreamweddings.com',
    website: 'https://example.com/dreamweddings',
    hours: '10:00 AM - 6:00 PM',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800&auto=format&fit=crop',
    ],
    features: ['full_planning', 'day_coordination', 'vendor_management', 'decor'],
    isVerified: true,
  },
  {
    name: 'Party Perfect',
    category: 'birthday_party',
    description: 'Birthday party planning for all ages with themes and entertainment.',
    address: '202 Fun Street, Entertainment District',
    phone: '+1234567895',
    email: 'celebrate@partyperfect.com',
    website: 'https://example.com/partyperfect',
    hours: '10:00 AM - 8:00 PM',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop',
    ],
    features: ['kids_parties', 'adult_parties', 'themes', 'entertainment', 'decorations'],
    isVerified: true,
  },
  {
    name: 'Express Grocery Delivery',
    category: 'grocery',
    description: 'Same-day grocery delivery service with wide product selection.',
    address: 'Citywide Service',
    phone: '+1234567896',
    email: 'order@expressgrocery.com',
    website: 'https://example.com/expressgrocery',
    hours: '8:00 AM - 10:00 PM',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604719312566-8912e9c8a213?w=800&auto=format&fit=crop',
    ],
    features: ['same_day', 'fresh_produce', 'household_items', 'contactless'],
    isVerified: true,
  },
  {
    name: 'Happy Paws Pet Store',
    category: 'pet_store',
    description: 'Complete pet store with food, supplies, and grooming services.',
    address: '303 Pet Avenue, Green District',
    phone: '+1234567897',
    email: 'woof@happypaws.com',
    website: 'https://example.com/happypaws',
    hours: '9:00 AM - 7:00 PM',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&auto=format&fit=crop',
    ],
    features: ['food', 'supplies', 'grooming', 'toys', 'health_products'],
    isVerified: true,
  },
  {
    name: 'City Emergency Response',
    category: 'emergency',
    description: 'Coordinated emergency response services for all situations.',
    address: '911 Emergency Road, Safety District',
    phone: '+1234567898',
    email: 'dispatch@cityemergency.com',
    website: 'https://example.com/cityemergency',
    hours: '24/7',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582152629442-4a864303fb96?w=800&auto=format&fit=crop',
    ],
    features: ['police', 'fire', 'medical', 'disaster_response', 'rescue'],
    isVerified: true,
  },
  {
    name: 'Speedy Food Delivery',
    category: 'food_delivery',
    description: 'Fast food delivery from all your favorite restaurants.',
    address: 'Citywide Service',
    phone: '+1234567899',
    email: 'order@speedyfood.com',
    website: 'https://example.com/speedyfood',
    hours: '10:00 AM - 11:00 PM',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593504049359-74330189a345?w=800&auto=format&fit=crop',
    ],
    features: ['restaurant_delivery', 'tracking', 'contactless', 'scheduled_delivery'],
    isVerified: true,
  },
];

// Sample messages
const createMessages = (userIds: string[]) => [
  {
    sender: userIds[0],
    receiver: userIds[1],
    content: 'Hi there! I saw your post about the community event.',
    isRead: true,
  },
  {
    sender: userIds[1],
    receiver: userIds[0],
    content: 'Yes, are you interested in attending?',
    isRead: true,
  },
  {
    sender: userIds[0],
    receiver: userIds[1],
    content: 'Definitely! What time does it start?',
    isRead: true,
  },
  {
    sender: userIds[1],
    receiver: userIds[0],
    content: 'It starts at 6 PM at the community center. There will be food and activities for everyone.',
    isRead: false,
  },
  {
    sender: userIds[0],
    receiver: userIds[2],
    content: 'Hello, I\'m interested in your apartment listing. Is it still available?',
    isRead: true,
  },
  {
    sender: userIds[2],
    receiver: userIds[0],
    content: 'Yes, it\'s still available. Would you like to schedule a viewing?',
    isRead: false,
  },
];

export async function seedDatabase() {
  try {
    await dbConnect();

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Post.deleteMany({});
    await Property.deleteMany({});
    await Message.deleteMany({});
    await Service.deleteMany({});

    // Insert users
    const createdUsers = await User.insertMany(users);
    const userIds = createdUsers.map(user => user._id);

    // Insert events
    await Event.insertMany(createEvents(userIds));

    // Insert posts
    await Post.insertMany(createPosts(userIds));

    // Insert properties
    await Property.insertMany(createProperties(userIds));

    // Insert messages
    await Message.insertMany(createMessages(userIds));

    // Insert services
    await Service.insertMany(services);

    console.log('Database seeded successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error };
  }
}
