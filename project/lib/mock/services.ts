// Mock services data
export const services = [
  {
    id: "1",
    name: "Square Hospital",
    category: "hospital",
    description: "One of Bangladesh's premier healthcare providers offering comprehensive medical services with state-of-the-art facilities and experienced medical professionals.",
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
      "Internationally Trained Medical Staff",
      "Comfortable Patient Rooms"
    ],
    isVerified: true,
    email: "info@squarehospital.com",
    phone: "+880 2-8144400",
    address: "18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka 1205",
    website: "https://www.squarehospitalbd.com",
    openingHours: "Open 24 hours",
    reviews: [
      {
        user: { name: "Rahim Ahmed", image: "https://randomuser.me/api/portraits/men/1.jpg" },
        rating: 5,
        comment: "Excellent care and professional staff. The facilities are modern and clean.",
        date: "2023-03-15"
      },
      {
        user: { name: "Fatima Khan", image: "https://randomuser.me/api/portraits/women/2.jpg" },
        rating: 4,
        comment: "Good experience overall. Wait times could be shorter but the medical care was great.",
        date: "2023-02-28"
      }
    ]
  },
  {
    id: "2",
    name: "Medinova Ambulance Service",
    category: "ambulance",
    description: "Fast and reliable emergency medical transportation in Dhaka with fully equipped ambulances and trained paramedics available 24/7.",
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
    email: "dispatch@medinova.com.bd",
    phone: "+880 1713-377775",
    address: "House-71/A, Road-5/A, Dhanmondi, Dhaka 1209",
    website: "https://www.medinovabd.com",
    openingHours: "Available 24/7",
    reviews: [
      {
        user: { name: "Kamal Hossain", image: "https://randomuser.me/api/portraits/men/3.jpg" },
        rating: 5,
        comment: "They arrived within minutes of our call in Dhanmondi. The paramedics were professional and caring.",
        date: "2023-04-02"
      }
    ]
  },
  {
    id: "3",
    name: "Sandhani Blood Bank",
    category: "blood-bank",
    description: "A reliable blood bank in Bangladesh providing safe blood products for medical emergencies and treatments with strict quality control.",
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
    email: "info@sandhani.org",
    phone: "+880 2-9668690",
    address: "Sandhani, Dhaka Medical College Branch, Dhaka 1000",
    website: "https://www.sandhani.org",
    openingHours: "Mon-Sat: 8:00 AM - 8:00 PM",
    reviews: [
      {
        user: { name: "Nusrat Jahan", image: "https://randomuser.me/api/portraits/women/4.jpg" },
        rating: 5,
        comment: "Very organized donation process. The staff was friendly and professional. They helped me during an emergency.",
        date: "2023-03-20"
      }
    ]
  },
  {
    id: "4",
    name: "Dhanshiri Catering",
    category: "catering",
    description: "Premium catering service offering authentic Bangladeshi cuisine for all types of events with customizable menus and professional service.",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&auto=format&fit=crop"
    ],
    features: [
      "Authentic Bengali Cuisine",
      "Professional Staff",
      "Event Planning Assistance",
      "Diverse Menu Options",
      "Elegant Presentation"
    ],
    isVerified: true,
    email: "events@dhanshiri.com.bd",
    phone: "+880 1713-091234",
    address: "House 15, Road 13, Banani, Dhaka 1213",
    website: "https://www.dhanshiricatering.com.bd",
    openingHours: "Mon-Fri: 9:00 AM - 8:00 PM",
    reviews: [
      {
        user: { name: "Rafiq Islam", image: "https://randomuser.me/api/portraits/men/5.jpg" },
        rating: 5,
        comment: "The food was amazing and authentic. Their kacchi biryani was the highlight of our event. Our guests were very impressed.",
        date: "2023-04-05"
      }
    ]
  },
  {
    id: "5",
    name: "Sygmaz Wedding Planners",
    category: "wedding-planning",
    description: "Comprehensive wedding planning service that turns your dream Bengali wedding into reality with attention to every detail and traditional customs.",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1519741347686-c1e331c20a2d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741347686-c1e331c20a2d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741347686-c1e331c20a2d?w=800&auto=format&fit=crop"
    ],
    features: [
      "Full-Service Planning",
      "Venue Selection in Dhaka",
      "Traditional & Modern Wedding Options",
      "Budget Management",
      "Holud & Gaye Holud Coordination"
    ],
    isVerified: true,
    email: "info@sygmaz.com.bd",
    phone: "+880 1841-234567",
    address: "House 42, Road 12, Block E, Banani, Dhaka 1213",
    website: "https://www.sygmaz.com.bd",
    openingHours: "Tue-Sat: 10:00 AM - 8:00 PM",
    reviews: [
      {
        user: { name: "Sabrina Rahman", image: "https://randomuser.me/api/portraits/women/6.jpg" },
        rating: 5,
        comment: "They made our wedding day absolutely perfect. Every detail was handled with care, from the holud ceremony to the reception.",
        date: "2023-03-28"
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
    name: "Foodpanda Bangladesh",
    category: "food-delivery",
    description: "Fast and reliable food delivery service partnering with a wide range of restaurants across Dhaka to bring your favorite meals to your doorstep.",
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=800&auto=format&fit=crop"
    ],
    features: [
      "Wide Restaurant Selection in Dhaka",
      "Real-time Order Tracking",
      "Fast Delivery",
      "Multiple Payment Options",
      "Special Offers and Discounts"
    ],
    isVerified: true,
    email: "support@foodpanda.com.bd",
    phone: "+880 9606-111-222",
    address: "Rangs Eskaton, 117/A, Old Airport Road, Dhaka 1215",
    website: "https://www.foodpanda.com.bd",
    openingHours: "Daily: 10:00 AM - 10:00 PM",
    reviews: [
      {
        user: { name: "Tasneem Akter", image: "https://randomuser.me/api/portraits/women/8.jpg" },
        rating: 4,
        comment: "Consistently fast delivery in Gulshan area and the food always arrives hot. Great service!",
        date: "2023-04-08"
      }
    ]
  },
  {
    id: "8",
    name: "Shwapno Superstore",
    category: "grocery-store",
    description: "A well-stocked grocery store offering fresh produce, quality meats, local and international foods, and everyday essentials at competitive prices across Bangladesh.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&auto=format&fit=crop"
    ],
    features: [
      "Fresh Local Produce",
      "Quality Halal Meats & Seafood",
      "International Foods Section",
      "Household Items",
      "Home Delivery"
    ],
    isVerified: true,
    email: "info@shwapno.com",
    phone: "+880 9604-111-000",
    address: "Gulshan-1, Dhaka 1212",
    website: "https://www.shwapno.com",
    openingHours: "Daily: 8:00 AM - 10:00 PM",
    reviews: [
      {
        user: { name: "Tanvir Ahmed", image: "https://randomuser.me/api/portraits/men/9.jpg" },
        rating: 5,
        comment: "Great selection of fresh produce and local foods. The staff is always helpful and prices are reasonable.",
        date: "2023-03-25"
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
