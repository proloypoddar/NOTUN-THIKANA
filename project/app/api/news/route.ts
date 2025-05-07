import { NextResponse } from 'next/server';

// Function to fetch news from Bangladeshi news sources
export async function GET() {
  try {
    // We'll fetch news from multiple Bangladeshi news sources
    const sources = [
      {
        name: 'The Daily Star',
        url: 'https://www.thedailystar.net',
        fetchFunction: fetchDailyStarNews
      },
      {
        name: 'Prothom Alo',
        url: 'https://www.prothomalo.com',
        fetchFunction: fetchProthomAloNews
      },
      {
        name: 'Dhaka Tribune',
        url: 'https://www.dhakatribune.com',
        fetchFunction: fetchDhakaTribuneNews
      }
    ];

    // Fetch news from all sources
    const newsPromises = sources.map(source => source.fetchFunction());
    const newsResults = await Promise.allSettled(newsPromises);

    // Combine all news
    let allNews = [];

    newsResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allNews = [...allNews, ...result.value.map(item => ({
          ...item,
          source: sources[index].name,
          sourceUrl: sources[index].url
        }))];
      }
    });

    // Sort by date (newest first)
    allNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(allNews);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { message: 'Error fetching news', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Function to fetch news from The Daily Star
async function fetchDailyStarNews() {
  // In a real implementation, this would use web scraping or an API
  // For demo purposes, we'll return mock data
  return [
    {
      id: 'ds1',
      title: 'Bangladesh to host international climate conference',
      summary: 'Bangladesh will host an international conference on climate change adaptation in Dhaka next month.',
      image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      url: 'https://www.thedailystar.net/environment/climate-change/news/bangladesh-host-international-climate-conference',
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      category: 'Environment'
    },
    {
      id: 'ds2',
      title: 'Digital Bangladesh: Tech exports reach $1.3 billion',
      summary: 'Bangladesh\'s technology sector has seen remarkable growth with exports reaching $1.3 billion in the last fiscal year.',
      image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      url: 'https://www.thedailystar.net/business/economy/news/digital-bangladesh-tech-exports-reach-13-billion',
      date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      category: 'Business'
    },
    {
      id: 'ds3',
      title: 'Bangladesh cricket team prepares for upcoming series',
      summary: 'The Bangladesh cricket team has begun preparations for their upcoming series against Sri Lanka.',
      image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      url: 'https://www.thedailystar.net/sports/cricket/news/bangladesh-cricket-team-prepares-upcoming-series',
      date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      category: 'Sports'
    }
  ];
}

// Function to fetch news from Prothom Alo
async function fetchProthomAloNews() {
  // Mock data for demo purposes
  return [
    {
      id: 'pa1',
      title: 'New metro rail line to open in Dhaka next year',
      summary: 'The second line of Dhaka\'s metro rail system is expected to open to the public by the end of next year.',
      image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      url: 'https://www.prothomalo.com/bangladesh/capital/new-metro-rail-line-to-open-in-dhaka-next-year',
      date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      category: 'Infrastructure'
    },
    {
      id: 'pa2',
      title: 'Bangladesh\'s garment exports see 12% growth',
      summary: 'Bangladesh\'s ready-made garment exports have seen a 12% year-on-year growth in the first quarter of 2023.',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      url: 'https://www.prothomalo.com/business/bangladeshs-garment-exports-see-12-growth',
      date: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      category: 'Economy'
    },
    {
      id: 'pa3',
      title: 'Sundarbans mangrove forest sees increase in tiger population',
      summary: 'Recent survey shows an encouraging increase in the Royal Bengal Tiger population in the Sundarbans.',
      image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      url: 'https://www.prothomalo.com/environment/sundarbans-mangrove-forest-sees-increase-in-tiger-population',
      date: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), // 10 hours ago
      category: 'Environment'
    }
  ];
}

// Function to fetch news from Dhaka Tribune
async function fetchDhakaTribuneNews() {
  // Mock data for demo purposes
  return [
    {
      id: 'dt1',
      title: 'Bangladesh to launch its first satellite for internet connectivity',
      summary: 'Bangladesh is preparing to launch its second satellite, focused on providing high-speed internet across the country.',
      image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      url: 'https://www.dhakatribune.com/bangladesh/2023/bangladesh-to-launch-its-first-satellite-for-internet-connectivity',
      date: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      category: 'Technology'
    },
    {
      id: 'dt2',
      title: 'Bangladesh\'s renewable energy capacity to double by 2025',
      summary: 'Government plans to double the country\'s renewable energy capacity within the next two years.',
      image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      url: 'https://www.dhakatribune.com/business/2023/bangladeshs-renewable-energy-capacity-to-double-by-2025',
      date: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(), // 7 hours ago
      category: 'Energy'
    },
    {
      id: 'dt3',
      title: 'Bangladesh\'s startup ecosystem attracts record investment',
      summary: 'Bangladeshi startups have attracted a record $200 million in investments in the first half of 2023.',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      url: 'https://www.dhakatribune.com/business/2023/bangladeshs-startup-ecosystem-attracts-record-investment',
      date: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(), // 9 hours ago
      category: 'Business'
    }
  ];
}
