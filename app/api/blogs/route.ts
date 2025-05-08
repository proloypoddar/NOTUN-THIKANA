import { NextResponse } from 'next/server';
import { Blog } from '@/lib/db/models/Blog';
import dbConnect from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';

// Sample blog data for initial setup
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

      <h2>Popular Smart Home Solutions in Bangladesh</h2>
      <p>Several Bangladeshi companies like Smart Home BD and Gadget & Gear are now offering integrated solutions that include:</p>
      <ul>
        <li>Solar-powered backup systems that integrate with smart home controls</li>
        <li>Locally manufactured smart switches that are more affordable</li>
        <li>Voice control systems that understand Bangla commands</li>
        <li>Security systems designed for local apartment buildings</li>
      </ul>

      <p>As internet penetration continues to grow across Bangladesh, smart home adoption is expected to accelerate, transforming how Bangladeshis interact with their living spaces.</p>
    `,
    category: "Home Improvement",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    readTime: "5 min read",
    featured: true,
    tags: ["smart home", "technology", "bangladesh"]
  },
  {
    title: "Dhaka's Architectural Renaissance: Blending Tradition with Modernity",
    excerpt: "Discover how Dhaka's skyline is evolving with architectural designs that honor Bangladesh's cultural heritage while embracing contemporary aesthetics.",
    content: `
      <p>Dhaka, the capital city of Bangladesh, is experiencing an architectural renaissance that beautifully marries traditional Bengali design elements with modern architectural principles. This evolution is reshaping the city's skyline while preserving its rich cultural identity.</p>

      <h2>Historical Context</h2>
      <p>Bangladesh has a rich architectural heritage, from the ancient Buddhist viharas to the ornate mosques of the Sultanate period and the grand palaces of the Mughal era. These historical structures have always emphasized harmony with nature, intricate ornamentation, and community spaces.</p>

      <h2>The New Wave</h2>
      <p>Today's architects in Dhaka are drawing inspiration from these traditional elements while incorporating sustainable design principles and modern materials. Key features of this new architectural movement include:</p>
      <ul>
        <li>Reinterpretation of traditional jali screens for natural ventilation and privacy</li>
        <li>Courtyard-inspired central spaces in modern buildings</li>
        <li>Use of local materials like brick and bamboo in innovative ways</li>
        <li>Integration of water features reminiscent of traditional ponds</li>
        <li>Green roofs and vertical gardens that echo Bangladesh's lush landscape</li>
      </ul>
    `,
    category: "Architecture",
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    readTime: "7 min read",
    tags: ["architecture", "dhaka", "design"]
  },
  {
    title: "Investing in Bangladesh's Growing Real Estate Market",
    excerpt: "A comprehensive guide to navigating investment opportunities in Bangladesh's dynamic real estate sector, with insights on emerging areas and market trends.",
    content: `
      <p>Bangladesh's real estate market has shown remarkable resilience and growth potential in recent years, making it an attractive option for both local and international investors. This guide explores the current landscape, opportunities, and considerations for those looking to invest in this dynamic sector.</p>

      <h2>Market Overview</h2>
      <p>The Bangladesh real estate market has been growing steadily, driven by several factors:</p>
      <ul>
        <li>Rapid urbanization with approximately 35% of the population now living in urban areas</li>
        <li>A growing middle class with increasing purchasing power</li>
        <li>Limited land availability in major cities creating premium value</li>
        <li>Government initiatives to improve infrastructure</li>
        <li>Relatively stable property appreciation compared to other investment vehicles</li>
      </ul>
    `,
    category: "Real Estate",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80",
    readTime: "6 min read",
    tags: ["real estate", "investment", "property"]
  },
  {
    title: "Small Space, Big Impact: Interior Design Tips for Dhaka Apartments",
    excerpt: "Learn how to maximize functionality and style in the typically compact apartments of Dhaka with these smart interior design strategies.",
    content: `
      <p>Living in Dhaka often means adapting to smaller living spaces, particularly in apartment buildings. However, limited square footage doesn't have to limit your style or comfort. This article shares practical interior design strategies specifically tailored for Bangladeshi urban apartments.</p>

      <h2>Embrace Multifunctional Furniture</h2>
      <p>In compact Dhaka apartments, every piece of furniture should earn its keep:</p>
      <ul>
        <li>Sofa beds or futons for guest accommodation without dedicating a separate room</li>
        <li>Coffee tables with storage compartments or nesting tables that can be tucked away</li>
        <li>Dining tables that can double as work desks</li>
        <li>Ottoman storage boxes that serve as both seating and storage</li>
        <li>Wall-mounted folding desks that can be closed when not in use</li>
      </ul>
    `,
    category: "Interior Design",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1558&q=80",
    readTime: "5 min read",
    tags: ["interior design", "small spaces", "apartments"]
  },
  {
    title: "Sustainable Urban Living in Bangladesh: Challenges and Solutions",
    excerpt: "Explore innovative approaches to creating more sustainable and livable urban environments in Bangladesh's rapidly growing cities.",
    content: `
      <p>As Bangladesh continues to urbanize at a rapid pace, the challenge of creating sustainable, livable cities becomes increasingly important. This article examines both the challenges facing Bangladesh's urban centers and the innovative solutions being developed to address them.</p>

      <h2>The Urban Challenge</h2>
      <p>Bangladesh's cities face several interconnected sustainability challenges:</p>
      <ul>
        <li>Population density that ranks among the highest in the world</li>
        <li>Limited green spaces and recreational areas</li>
        <li>Air and water pollution from industrial and vehicular sources</li>
        <li>Vulnerability to climate change impacts, including flooding</li>
        <li>Infrastructure that struggles to keep pace with population growth</li>
      </ul>

      <h2>Innovative Solutions</h2>
      <p>Despite these challenges, Bangladesh is becoming a hotbed for urban innovation:</p>
      <ul>
        <li>Rooftop gardening initiatives in Dhaka that increase green space and food security</li>
        <li>Community-led waste management systems in Chittagong</li>
        <li>Solar-powered public lighting projects in Sylhet</li>
        <li>Rainwater harvesting systems being integrated into new buildings in Khulna</li>
        <li>Eco-friendly brick alternatives reducing air pollution from kilns</li>
      </ul>

      <p>These grassroots innovations, combined with policy changes, are gradually transforming Bangladesh's urban landscape into more sustainable living environments.</p>
    `,
    category: "Urban Living",
    image: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1526&q=80",
    readTime: "8 min read",
    tags: ["sustainability", "urban planning", "environment"]
  },
  {
    title: "Exploring Cox's Bazar: Bangladesh's Crown Jewel of Tourism",
    excerpt: "Discover the natural beauty and cultural richness of the world's longest natural sea beach and its surrounding attractions.",
    content: `
      <p>Cox's Bazar, home to the world's longest uninterrupted natural sandy beach stretching 120 kilometers along the Bay of Bengal, is Bangladesh's premier tourist destination. This coastal paradise offers visitors a unique blend of natural beauty, cultural experiences, and adventure.</p>

      <h2>The Magnificent Beach</h2>
      <p>The beach itself is a marvel of nature, with gentle slopes perfect for swimming and golden sands ideal for long walks. Sunrise and sunset views here are particularly spectacular, painting the sky in vibrant hues that reflect off the water.</p>

      <h2>Beyond the Beach</h2>
      <p>While the beach is the main attraction, Cox's Bazar offers much more:</p>
      <ul>
        <li>Inani Beach with its unique coral stones</li>
        <li>Himchari National Park with its lush forests and waterfalls</li>
        <li>Maheshkhali Island with its Buddhist temples and pagodas</li>
        <li>Sonadia Island, a haven for migratory birds</li>
        <li>Ramu, famous for its Buddhist monasteries and handicrafts</li>
      </ul>

      <h2>Local Culture and Cuisine</h2>
      <p>The area is home to diverse communities including Bengali Muslims and the Rakhine people, creating a rich cultural tapestry. Visitors can enjoy fresh seafood prepared in traditional Bengali styles, with dishes like shutki (dried fish) offering unique local flavors.</p>

      <p>As Bangladesh continues to develop its tourism infrastructure, Cox's Bazar remains the jewel in its crown, offering both domestic and international visitors an unforgettable coastal experience.</p>
    `,
    category: "Travel",
    image: "https://images.unsplash.com/photo-1590123047293-ab2f8328b7cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    readTime: "6 min read",
    featured: true,
    tags: ["travel", "beach", "tourism", "bangladesh"]
  },
  {
    title: "The Sundarbans: Exploring Bangladesh's Mangrove Marvel",
    excerpt: "Journey through the world's largest mangrove forest, home to the Royal Bengal Tiger and a UNESCO World Heritage Site.",
    content: `
      <p>The Sundarbans, spanning the delta of the Ganges, Brahmaputra, and Meghna rivers at the Bay of Bengal, is the world's largest contiguous mangrove forest. This unique ecosystem, shared between Bangladesh and India, is a treasure trove of biodiversity and natural beauty.</p>

      <h2>A Unique Ecosystem</h2>
      <p>The Sundarbans is characterized by its dense network of tidal waterways, mudflats, and small islands of salt-tolerant mangrove forests. This complex ecosystem supports an incredible variety of life:</p>
      <ul>
        <li>The iconic Royal Bengal Tiger, adapted to swimming between islands</li>
        <li>Spotted deer, wild boars, and rhesus macaques</li>
        <li>Estuarine crocodiles and over 260 bird species</li>
        <li>Unique plant species adapted to the brackish water environment</li>
        <li>Diverse marine life including dolphins and various fish species</li>
      </ul>

      <h2>Cultural Significance</h2>
      <p>The Sundarbans is deeply woven into the cultural fabric of Bangladesh. Local communities have traditional occupations like honey collection, fishing, and wood cutting, often navigating the dangerous waters and forests. The forest is also home to many legends and folklore, including that of Bonbibi, the lady of the forest who is believed to protect honey collectors and woodcutters.</p>

      <h2>Conservation Challenges</h2>
      <p>Today, the Sundarbans faces threats from climate change, rising sea levels, and human encroachment. Conservation efforts are crucial to preserve this natural wonder for future generations.</p>

      <p>Visiting the Sundarbans offers a rare glimpse into one of the world's most unique ecosystems and a chance to witness the delicate balance between humans and nature in this remarkable corner of Bangladesh.</p>
    `,
    category: "Wildlife",
    image: "https://images.unsplash.com/photo-1590579491624-f98f36d4c763?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    readTime: "7 min read",
    tags: ["wildlife", "nature", "conservation", "bangladesh"]
  }
];

// GET /api/blogs - Get all blogs or a specific blog
export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Check if we have any blogs
    const count = await Blog.countDocuments();

    // If no blogs exist, seed the database with sample blogs
    if (count === 0) {
      console.log('No blogs found, seeding database with sample blogs');

      // Get admin user to set as author
      const admin = await User.findOne({ role: 'admin' });

      // Create sample blogs
      for (const blog of sampleBlogs) {
        await Blog.create({
          ...blog,
          author: {
            name: admin?.name || 'Admin',
            avatar: admin?.image || 'https://ui-avatars.com/api/?name=Admin',
          },
          date: new Date(),
          likes: Math.floor(Math.random() * 50),
        });
      }

      console.log('Sample blogs created successfully');
    }

    // If ID is provided, return a specific blog
    if (id) {
      const blog = await Blog.findById(id);
      if (!blog) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      }
      return NextResponse.json(blog);
    }

    // Build query
    let query: any = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (featured) {
      query.featured = true;
    }

    // Get blogs from database
    const blogs = await Blog.find(query)
      .sort({ date: -1 })
      .limit(limit);

    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

// POST /api/blogs - Create a new blog
export async function POST(req: Request) {
  try {
    await dbConnect();

    const data = await req.json();

    // Validate required fields
    const { title, image, category, excerpt, content, author, readTime } = data;

    if (!title || !image || !category || !excerpt || !content || !author || !readTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newBlog = await Blog.create(data);
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

// PUT /api/blogs - Update a blog
export async function PUT(req: Request) {
  try {
    await dbConnect();

    const { id, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}
