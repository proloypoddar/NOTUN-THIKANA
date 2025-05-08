// Mock forums data
export const forumPosts = [
  {
    id: "1",
    title: "Best areas for newcomers?",
    content: "I'm moving to the city next month for a new job. Which areas would you recommend for young professionals? I'm looking for a safe neighborhood with good public transportation and affordable rent. Ideally, I'd like to be close to restaurants and parks. Any advice would be greatly appreciated!",
    author: "Sarah K.",
    authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
    date: "2025-04-10",
    category: "housing",
    replies: 3,
    views: 234,
    likes: 45,
    isAnonymous: false,
    tags: ["newcomer", "housing", "advice"],
    comments: [
      {
        id: 1,
        author: "Michael Chen",
        authorImage: "https://randomuser.me/api/portraits/men/22.jpg",
        content: "I would recommend the Riverside district. It's safe and has great public transport connections. There are plenty of restaurants and a beautiful park along the river. Rent is reasonable compared to downtown.",
        date: "2025-04-10",
        likes: 12,
        isAnonymous: false,
      },
      {
        id: 2,
        author: "Anonymous",
        authorImage: "",
        content: "Downtown is great if you want to be close to everything, but it might be a bit above your budget. The University District is more affordable and has a young crowd.",
        date: "2025-04-11",
        likes: 8,
        isAnonymous: true,
      },
      {
        id: 3,
        author: "Emily Johnson",
        authorImage: "https://randomuser.me/api/portraits/women/33.jpg",
        content: "I moved here last year and chose the Arts District. It's a bit more expensive but has amazing restaurants and a great community feel. Public transport is decent too.",
        date: "2025-04-12",
        likes: 5,
        isAnonymous: false,
      }
    ]
  },
  {
    id: "2",
    title: "Affordable language classes?",
    content: "I recently moved here and I'm looking for affordable language classes to improve my English. Does anyone know of any good options that won't break the bank? I'm particularly interested in conversation practice. Thanks in advance for any suggestions!",
    author: "Carlos M.",
    authorImage: "https://randomuser.me/api/portraits/men/67.jpg",
    date: "2025-04-08",
    category: "education",
    replies: 2,
    views: 156,
    likes: 32,
    isAnonymous: false,
    tags: ["language", "education", "english"],
    comments: [
      {
        id: 1,
        author: "Lisa Wong",
        authorImage: "https://randomuser.me/api/portraits/women/79.jpg",
        content: "The Community College offers affordable English classes for about $100 per semester. They have different levels and focus on conversation. The library also has free language exchange meetups every Thursday evening.",
        date: "2025-04-09",
        likes: 10,
        isAnonymous: false,
      },
      {
        id: 2,
        author: "David Smith",
        authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
        content: "Check out the International Center. They have volunteer-led English conversation groups that are completely free. I've been volunteering there and it's a great environment for practice.",
        date: "2025-04-10",
        likes: 7,
        isAnonymous: false,
      }
    ]
  },
  {
    id: "3",
    title: "Best local restaurants for authentic cuisine?",
    content: "I'm a foodie who just moved to the city and I'm looking to explore authentic local cuisine. What are some hidden gems that tourists don't know about? I'm particularly interested in family-owned places with traditional recipes. All cuisines welcome!",
    author: "Anonymous",
    authorImage: "",
    date: "2025-04-05",
    category: "food",
    replies: 4,
    views: 289,
    likes: 67,
    isAnonymous: true,
    tags: ["food", "restaurants", "local"],
    comments: [
      {
        id: 1,
        author: "Maria Rodriguez",
        authorImage: "https://randomuser.me/api/portraits/women/28.jpg",
        content: "You have to try Mama Rosa's on 5th Street for authentic Italian. It's a small family-owned place that's been there for 30 years. Their homemade pasta is amazing!",
        date: "2025-04-06",
        likes: 15,
        isAnonymous: false,
      },
      {
        id: 2,
        author: "James Kim",
        authorImage: "https://randomuser.me/api/portraits/men/43.jpg",
        content: "For Korean food, check out Seoul Kitchen in the East District. It's run by a Korean family and they don't water down the flavors for Western palates. The bibimbap is fantastic.",
        date: "2025-04-07",
        likes: 12,
        isAnonymous: false,
      }
    ]
  },
  {
    id: "4",
    title: "Public transportation tips for newcomers?",
    content: "I just moved to the city and I'm finding the public transportation system a bit confusing. Are there any apps or tips that locals use to navigate the system more efficiently? Also, are there any monthly passes that would save money for daily commuters? Thanks for your help!",
    author: "Robert J.",
    authorImage: "https://randomuser.me/api/portraits/men/41.jpg",
    date: "2025-04-03",
    category: "transportation",
    replies: 3,
    views: 198,
    likes: 41,
    isAnonymous: false,
    tags: ["transportation", "commuting", "tips"],
    comments: [
      {
        id: 1,
        author: "Sophie Chen",
        authorImage: "https://randomuser.me/api/portraits/women/52.jpg",
        content: "Download the CityTransit app - it has real-time updates and route planning. For monthly passes, the Commuter Card is $85/month for unlimited rides on buses and trains. It pays for itself if you commute more than 20 days a month.",
        date: "2025-04-04",
        likes: 18,
        isAnonymous: false,
      }
    ]
  },
  {
    id: "5",
    title: "Finding a family doctor accepting new patients?",
    content: "My family and I recently moved to the city and we're having trouble finding a family doctor who's accepting new patients. Does anyone have recommendations for clinics or doctors in the downtown or west end areas? We have standard insurance coverage. Thanks in advance!",
    author: "Jennifer L.",
    authorImage: "https://randomuser.me/api/portraits/women/42.jpg",
    date: "2025-04-01",
    category: "healthcare",
    replies: 2,
    views: 176,
    likes: 38,
    isAnonymous: false,
    tags: ["healthcare", "doctor", "family"],
    comments: [
      {
        id: 1,
        author: "Dr. Thomas Brown",
        authorImage: "https://randomuser.me/api/portraits/men/36.jpg",
        content: "The Community Health Center on Main Street is accepting new patients. They have several family doctors and a pediatrician on staff. Their number is (555) 123-4567. You can also try the University Medical Clinic if you're near the campus area.",
        date: "2025-04-02",
        likes: 14,
        isAnonymous: false,
      }
    ]
  },
  {
    id: "6",
    title: "Weekend activities for kids?",
    content: "We're new to the area and looking for fun weekend activities for our kids (ages 5 and 8). We're interested in both indoor and outdoor options, especially ones that won't break the bank. Any recommendations from local parents would be greatly appreciated!",
    author: "Amanda W.",
    authorImage: "https://randomuser.me/api/portraits/women/10.jpg",
    date: "2025-03-30",
    category: "family",
    replies: 3,
    views: 212,
    likes: 45,
    isAnonymous: false,
    tags: ["family", "kids", "activities"],
    comments: [
      {
        id: 1,
        author: "Michael P.",
        authorImage: "https://randomuser.me/api/portraits/men/22.jpg",
        content: "The Children's Museum has a great interactive exhibit right now, and it's free on the first Sunday of each month. The Central Park has a fantastic playground and often hosts free family events on weekends. Check the city's parks and recreation website for a calendar.",
        date: "2025-03-31",
        likes: 12,
        isAnonymous: false,
      }
    ]
  }
];

export const getForumPosts = () => {
  return forumPosts;
};

export const getForumPostsByCategory = (category: string) => {
  if (category === 'all') return forumPosts;
  return forumPosts.filter(post => post.category === category);
};

export const getForumPostById = (id: string) => {
  return forumPosts.find(post => post.id === id);
};
