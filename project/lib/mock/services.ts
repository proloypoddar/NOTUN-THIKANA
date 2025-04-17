// Mock services data
export const services = [
  {
    id: "1",
    name: "City General Hospital",
    category: "hospital",
    description: "A leading healthcare provider offering comprehensive medical services with state-of-the-art facilities and experienced medical professionals.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop"
    ],
    features: [
      "24/7 Emergency Services",
      "Specialized Departments",
      "Advanced Diagnostic Equipment",
      "Experienced Medical Staff",
      "Comfortable Patient Rooms"
    ],
    isVerified: true,
    email: "info@citygeneralhospital.com",
    phone: "+1 (555) 123-4567",
    address: "123 Health Avenue, Downtown",
    website: "https://www.citygeneralhospital.com",
    openingHours: "Open 24 hours",
    reviews: [
      {
        user: { name: "John Smith", image: "https://randomuser.me/api/portraits/men/1.jpg" },
        rating: 5,
        comment: "Excellent care and professional staff. The facilities are modern and clean.",
        date: "2025-03-15"
      },
      {
        user: { name: "Sarah Johnson", image: "https://randomuser.me/api/portraits/women/2.jpg" },
        rating: 4,
        comment: "Good experience overall. Wait times could be shorter but the medical care was great.",
        date: "2025-02-28"
      }
    ]
  },
  {
    id: "2",
    name: "Rapid Response Ambulance",
    category: "ambulance",
    description: "Fast and reliable emergency medical transportation with fully equipped ambulances and trained paramedics available 24/7.",
    image: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1612824892892-4e7b9a1a3ecd?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1612824892892-4e7b9a1a3ecd?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1612824892892-4e7b9a1a3ecd?w=800&auto=format&fit=crop"
    ],
    features: [
      "24/7 Emergency Response",
      "Advanced Life Support",
      "Trained Paramedics",
      "Modern Medical Equipment",
      "GPS Tracking"
    ],
    isVerified: true,
    email: "dispatch@rapidresponse.com",
    phone: "+1 (555) 911-0000",
    address: "456 Emergency Road, Midtown",
    website: "https://www.rapidresponseambulance.com",
    openingHours: "Available 24/7",
    reviews: [
      {
        user: { name: "Michael Brown", image: "https://randomuser.me/api/portraits/men/3.jpg" },
        rating: 5,
        comment: "They arrived within minutes of our call. The paramedics were professional and caring.",
        date: "2025-04-02"
      }
    ]
  },
  {
    id: "3",
    name: "LifeSaver Blood Bank",
    category: "blood-bank",
    description: "A reliable blood bank providing safe blood products for medical emergencies and treatments with strict quality control.",
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop"
    ],
    features: [
      "All Blood Types Available",
      "Rigorous Testing Protocols",
      "Mobile Blood Drives",
      "Donor Programs",
      "Emergency Supply"
    ],
    isVerified: true,
    email: "info@lifesaverbloodbank.com",
    phone: "+1 (555) 456-7890",
    address: "789 Donor Street, Eastside",
    website: "https://www.lifesaverbloodbank.com",
    openingHours: "Mon-Sat: 8:00 AM - 8:00 PM",
    reviews: [
      {
        user: { name: "Emily Davis", image: "https://randomuser.me/api/portraits/women/4.jpg" },
        rating: 5,
        comment: "Very organized donation process. The staff was friendly and professional.",
        date: "2025-03-20"
      }
    ]
  },
  {
    id: "4",
    name: "Gourmet Delights Catering",
    category: "catering",
    description: "Premium catering service offering delicious cuisine for all types of events with customizable menus and professional service.",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&auto=format&fit=crop"
    ],
    features: [
      "Customizable Menus",
      "Professional Staff",
      "Event Planning Assistance",
      "Diverse Cuisine Options",
      "Elegant Presentation"
    ],
    isVerified: true,
    email: "events@gourmetdelights.com",
    phone: "+1 (555) 789-0123",
    address: "101 Culinary Boulevard, Westside",
    website: "https://www.gourmetdelightscatering.com",
    openingHours: "Mon-Fri: 9:00 AM - 6:00 PM",
    reviews: [
      {
        user: { name: "Robert Wilson", image: "https://randomuser.me/api/portraits/men/5.jpg" },
        rating: 5,
        comment: "The food was amazing and the service was impeccable. Our guests were very impressed.",
        date: "2025-04-05"
      }
    ]
  },
  {
    id: "5",
    name: "Dream Day Wedding Planners",
    category: "wedding-planning",
    description: "Comprehensive wedding planning service that turns your dream wedding into reality with attention to every detail.",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1519741347686-c1e331c20a2d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741347686-c1e331c20a2d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741347686-c1e331c20a2d?w=800&auto=format&fit=crop"
    ],
    features: [
      "Full-Service Planning",
      "Venue Selection",
      "Vendor Coordination",
      "Budget Management",
      "Day-of Coordination"
    ],
    isVerified: true,
    email: "info@dreamdayweddings.com",
    phone: "+1 (555) 234-5678",
    address: "202 Celebration Avenue, Uptown",
    website: "https://www.dreamdayweddings.com",
    openingHours: "Tue-Sat: 10:00 AM - 7:00 PM",
    reviews: [
      {
        user: { name: "Jennifer Taylor", image: "https://randomuser.me/api/portraits/women/6.jpg" },
        rating: 5,
        comment: "They made our wedding day absolutely perfect. Every detail was handled with care.",
        date: "2025-03-28"
      }
    ]
  },
  {
    id: "6",
    name: "Party Time Event Planning",
    category: "birthday-party-planning",
    description: "Creative birthday party planning service for all ages with unique themes, entertainment, and hassle-free organization.",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800&auto=format&fit=crop"
    ],
    features: [
      "Custom Themes",
      "Entertainment Options",
      "Decoration Services",
      "Catering Arrangements",
      "Venue Selection"
    ],
    isVerified: true,
    email: "fun@partytime.com",
    phone: "+1 (555) 345-6789",
    address: "303 Festive Street, Downtown",
    website: "https://www.partytimeevents.com",
    openingHours: "Mon-Fri: 9:00 AM - 5:00 PM",
    reviews: [
      {
        user: { name: "David Miller", image: "https://randomuser.me/api/portraits/men/7.jpg" },
        rating: 4,
        comment: "They organized a fantastic party for my daughter. The decorations were beautiful and the entertainment was great.",
        date: "2025-04-10"
      }
    ]
  },
  {
    id: "7",
    name: "Quick Bites Food Delivery",
    category: "food-delivery",
    description: "Fast and reliable food delivery service partnering with a wide range of restaurants to bring your favorite meals to your doorstep.",
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=800&auto=format&fit=crop"
    ],
    features: [
      "Wide Restaurant Selection",
      "Real-time Order Tracking",
      "Fast Delivery",
      "Secure Payment Options",
      "Special Offers"
    ],
    isVerified: true,
    email: "orders@quickbites.com",
    phone: "+1 (555) 456-7890",
    address: "404 Delivery Road, Midtown",
    website: "https://www.quickbitesfood.com",
    openingHours: "Daily: 10:00 AM - 10:00 PM",
    reviews: [
      {
        user: { name: "Lisa Anderson", image: "https://randomuser.me/api/portraits/women/8.jpg" },
        rating: 4,
        comment: "Consistently fast delivery and the food always arrives hot. Great service!",
        date: "2025-04-08"
      }
    ]
  },
  {
    id: "8",
    name: "Fresh Market Grocery",
    category: "grocery-store",
    description: "A well-stocked grocery store offering fresh produce, quality meats, international foods, and everyday essentials at competitive prices.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&auto=format&fit=crop"
    ],
    features: [
      "Fresh Produce",
      "Quality Meats & Seafood",
      "International Foods Section",
      "Organic Options",
      "Home Delivery"
    ],
    isVerified: true,
    email: "info@freshmarket.com",
    phone: "+1 (555) 567-8901",
    address: "505 Grocery Lane, Eastside",
    website: "https://www.freshmarketgrocery.com",
    openingHours: "Daily: 7:00 AM - 10:00 PM",
    reviews: [
      {
        user: { name: "Thomas Clark", image: "https://randomuser.me/api/portraits/men/9.jpg" },
        rating: 5,
        comment: "Great selection of fresh produce and international foods. The staff is always helpful.",
        date: "2025-03-25"
      }
    ]
  },
  {
    id: "9",
    name: "Paws & Claws Pet Store",
    category: "pet-store",
    description: "Complete pet store offering quality pet supplies, food, toys, and accessories for all types of pets with knowledgeable staff.",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1516750105099-4b8a83e217ee?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516750105099-4b8a83e217ee?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516750105099-4b8a83e217ee?w=800&auto=format&fit=crop"
    ],
    features: [
      "Premium Pet Foods",
      "Pet Accessories",
      "Grooming Supplies",
      "Pet Health Products",
      "Knowledgeable Staff"
    ],
    isVerified: true,
    email: "woof@pawsandclaws.com",
    phone: "+1 (555) 678-9012",
    address: "606 Pet Avenue, Westside",
    website: "https://www.pawsandclawspets.com",
    openingHours: "Mon-Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM",
    reviews: [
      {
        user: { name: "Amanda White", image: "https://randomuser.me/api/portraits/women/10.jpg" },
        rating: 4,
        comment: "Great selection of pet supplies and the staff is very knowledgeable about pet care.",
        date: "2025-04-12"
      }
    ]
  },
  {
    id: "10",
    name: "City Emergency Services",
    category: "emergency",
    description: "Comprehensive emergency services including fire, police, and medical response with highly trained personnel and modern equipment.",
    image: "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523676060187-f55189a71f5e?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523676060187-f55189a71f5e?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523676060187-f55189a71f5e?w=800&auto=format&fit=crop"
    ],
    features: [
      "24/7 Emergency Response",
      "Trained First Responders",
      "Modern Equipment",
      "Rapid Deployment",
      "Community Safety Programs"
    ],
    isVerified: true,
    email: "info@cityemergency.gov",
    phone: "+1 (555) 911-0000",
    address: "707 Emergency Boulevard, Downtown",
    website: "https://www.cityemergencyservices.gov",
    openingHours: "Available 24/7",
    reviews: [
      {
        user: { name: "James Robinson", image: "https://randomuser.me/api/portraits/men/11.jpg" },
        rating: 5,
        comment: "They responded quickly when we had an emergency. Professional and efficient service.",
        date: "2025-03-30"
      }
    ]
  }
];

export const getServices = () => {
  return services;
};

export const getServicesByCategory = (category: string) => {
  return services.filter(service => service.category === category);
};

export const getServiceById = (id: string) => {
  return services.find(service => service.id === id);
};
