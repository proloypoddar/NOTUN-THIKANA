// Mock events data
export const events = [
  {
    id: "1",
    title: "Community Meetup",
    description: "Join us for our monthly community gathering where we'll discuss local issues and share experiences. This is a great opportunity for newcomers to meet locals and learn more about the community. We'll have refreshments and activities for everyone.\n\nTopics for this month's meetup:\n- Welcome and introductions\n- Community updates and announcements\n- Open discussion on local issues\n- Networking and socializing",
    date: "2025-04-15",
    time: "18:00",
    location: "Central Community Center",
    address: "123 Main Street, Downtown",
    attendees: 45,
    category: "social",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop",
    coordinates: [40.7128, -74.0060],
    organizer: {
      name: "Community Outreach Team",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    attendeesList: [
      { name: "John D.", image: "https://randomuser.me/api/portraits/men/32.jpg" },
      { name: "Sarah K.", image: "https://randomuser.me/api/portraits/women/44.jpg" },
      { name: "Michael C.", image: "https://randomuser.me/api/portraits/men/22.jpg" },
      { name: "Emily J.", image: "https://randomuser.me/api/portraits/women/33.jpg" },
      { name: "David L.", image: "https://randomuser.me/api/portraits/men/53.jpg" },
    ]
  },
  {
    id: "2",
    title: "Tech Workshop",
    description: "Learn the basics of web development in this hands-on workshop for beginners. No prior experience required! We'll cover HTML, CSS, and basic JavaScript to help you build your first website.\n\nWhat to bring:\n- Laptop (required)\n- Notepad and pen\n- Your enthusiasm for learning!\n\nAll participants will receive resources to continue learning after the workshop.",
    date: "2025-04-20",
    time: "14:00",
    location: "Innovation Hub",
    address: "456 Tech Avenue, Innovation District",
    attendees: 30,
    category: "education",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop",
    coordinates: [40.7328, -74.0060],
    organizer: {
      name: "Tech Learning Initiative",
      image: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    attendeesList: [
      { name: "Alex T.", image: "https://randomuser.me/api/portraits/women/22.jpg" },
      { name: "James R.", image: "https://randomuser.me/api/portraits/men/43.jpg" },
      { name: "Linda M.", image: "https://randomuser.me/api/portraits/women/63.jpg" },
    ]
  },
  {
    id: "3",
    title: "Cultural Festival",
    description: "Celebrate the diversity of our community with food, music, and performances from around the world.",
    date: "2025-04-25",
    time: "12:00",
    location: "City Park",
    address: "789 Park Avenue, Green District",
    attendees: 120,
    category: "culture",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop",
    coordinates: [40.7428, -73.9800],
    organizer: {
      name: "Cultural Diversity Committee",
      image: "https://randomuser.me/api/portraits/women/28.jpg"
    },
    attendeesList: [
      { name: "Maria G.", image: "https://randomuser.me/api/portraits/women/28.jpg" },
      { name: "Robert T.", image: "https://randomuser.me/api/portraits/men/45.jpg" },
    ]
  },
  {
    id: "4",
    title: "Job Fair for Newcomers",
    description: "Connect with local employers who are looking to hire newcomers to the city.",
    date: "2025-05-02",
    time: "10:00",
    location: "Convention Center",
    address: "101 Business Boulevard, Downtown",
    attendees: 85,
    category: "education",
    image: "https://images.unsplash.com/photo-1560523159-4a9692d222f9?w=800&auto=format&fit=crop",
    coordinates: [40.7528, -74.0160],
    organizer: {
      name: "City Employment Office",
      image: "https://randomuser.me/api/portraits/men/36.jpg"
    },
    attendeesList: [
      { name: "Thomas B.", image: "https://randomuser.me/api/portraits/men/36.jpg" },
      { name: "Jessica L.", image: "https://randomuser.me/api/portraits/women/42.jpg" },
    ]
  },
  {
    id: "5",
    title: "Language Exchange Meetup",
    description: "Practice your language skills with native speakers in a friendly, casual environment.",
    date: "2025-05-10",
    time: "19:00",
    location: "International Cafe",
    address: "202 Global Street, Cultural District",
    attendees: 25,
    category: "education",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop",
    coordinates: [40.7228, -73.9900],
    organizer: {
      name: "Language Learning Network",
      image: "https://randomuser.me/api/portraits/women/52.jpg"
    },
    attendeesList: [
      { name: "Sophie M.", image: "https://randomuser.me/api/portraits/women/52.jpg" },
      { name: "Carlos R.", image: "https://randomuser.me/api/portraits/men/67.jpg" },
    ]
  },
  {
    id: "6",
    title: "Newcomers Welcome Dinner",
    description: "A special dinner event to welcome newcomers to our community. Meet locals and make new friends.",
    date: "2025-05-15",
    time: "19:00",
    location: "Community Hall",
    address: "303 Welcome Avenue, Central District",
    attendees: 50,
    category: "social",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&auto=format&fit=crop",
    coordinates: [40.7328, -73.9700],
    organizer: {
      name: "Newcomers Association",
      image: "https://randomuser.me/api/portraits/women/33.jpg"
    },
    attendeesList: [
      { name: "Emily J.", image: "https://randomuser.me/api/portraits/women/33.jpg" },
      { name: "Mark S.", image: "https://randomuser.me/api/portraits/men/41.jpg" },
    ]
  }
];

export const getEvents = () => {
  return events;
};

export const getEventsByCategory = (category: string) => {
  if (category === 'all') return events;
  return events.filter(event => event.category === category);
};

export const getEventById = (id: string) => {
  return events.find(event => event.id === id);
};
