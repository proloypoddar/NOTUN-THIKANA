'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section with Bangladesh-themed elements */}
      <section className="relative overflow-hidden">
        {/* Background decorative elements - Bangladesh flag colors */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-600 rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600 rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Animated title with Bengali typography */}
            <h1
              className={`text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800 transition-all duration-1000 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              NOTUN <span className="text-red-600">THIKANA</span>
            </h1>
            <h2
              className={`text-3xl md:text-4xl font-bold mb-6 transition-all duration-1000 delay-300 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
World Become closer, Life Become Better
            </h2>

            {/* Animated subtitle */}
            <p
              className={`text-xl mb-10 max-w-2xl text-gray-700 transition-all duration-1000 delay-500 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              Connect with your neighbors, share information, and build relationships with the Bangladeshi community.
            </p>

            {/* Animated CTA buttons */}
            <div
              className={`flex flex-wrap justify-center gap-4 mb-16 transition-all duration-1000 delay-700 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <Link
                href="/forums"
                className="px-8 py-4 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transform hover:-translate-y-1 transition-all duration-300"
              >
                Community Forums
              </Link>
              <Link
                href="/housing"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300"
              >
                Find Housing
              </Link>
              <Link
                href="/blogs"
                className="px-8 py-4 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transform hover:-translate-y-1 transition-all duration-300"
              >
                Read Blogs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Bangladesh-themed content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-16 text-center text-green-800 transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Our Community Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Feature 1 - Community Forums */}
            <div
              className={`bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-green-800">Community Forums</h3>
              <p className="text-gray-700 text-center">
                Connect with the Bangladeshi community in your area. Share experiences and get advice from others.
              </p>
              <div className="mt-6 text-center">
                <Link href="/forums" className="text-green-600 hover:text-green-800 font-medium">
                  Join Discussions →
                </Link>
              </div>
            </div>

            {/* Feature 2 - Housing */}
            <div
              className={`bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: '900ms' }}
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-blue-800">Housing</h3>
              <p className="text-gray-700 text-center">
                Find the perfect home in Bangladesh. Browse listings, connect with landlords, and get detailed information.
              </p>
              <div className="mt-6 text-center">
                <Link href="/housing" className="text-blue-600 hover:text-blue-800 font-medium">
                  Find Housing →
                </Link>
              </div>
            </div>

            {/* Feature 3 - Blogs */}
            <div
              className={`bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: '1000ms' }}
            >
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-red-800">Blogs</h3>
              <p className="text-gray-700 text-center">
                Read informative articles about life in Bangladesh, cultural insights, travel tips, and more from our community.
              </p>
              <div className="mt-6 text-center">
                <Link href="/blogs" className="text-red-600 hover:text-red-800 font-medium">
                  Read Blogs →
                </Link>
              </div>
            </div>

            {/* Feature 4 - Notifications */}
            <div
              className={`bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: '1100ms' }}
            >
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-purple-800">Notifications</h3>
              <p className="text-gray-700 text-center">
                Stay updated with the latest community activities, housing listings, and important announcements.
              </p>
              <div className="mt-6 text-center">
                <Link href="/notifications" className="text-purple-600 hover:text-purple-800 font-medium">
                  View Notifications →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tourist Attractions and Blogs Section */}
      <section className="py-16 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-16 text-center text-green-800 transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '1400ms' }}
          >
            Tourist Attractions in Bangladesh and Blogs
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Tourist Attractions */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-green-700">Popular Destinations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Landmark 1 - Ahsan Manzil */}
                <div
                  className={`overflow-hidden rounded-xl shadow-lg group transition-all duration-500 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: '1600ms' }}
                >
                  <div className="relative h-60 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                    <div className="absolute bottom-4 left-4 z-20 text-white">
                      <h3 className="text-xl font-bold">Ahsan Manzil</h3>
                      <p>Dhaka</p>
                    </div>
                    <div className="w-full h-full transform group-hover:scale-110 transition-transform duration-500">
                      <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1609946860441-a51ffcf22208')] bg-cover bg-center"></div>
                    </div>
                  </div>
                </div>

                {/* Landmark 2 - Cox's Bazar */}
                <div
                  className={`overflow-hidden rounded-xl shadow-lg group transition-all duration-500 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: '1700ms' }}
                >
                  <div className="relative h-60 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                    <div className="absolute bottom-4 left-4 z-20 text-white">
                      <h3 className="text-xl font-bold">Cox's Bazar Beach</h3>
                      <p>Cox's Bazar</p>
                    </div>
                    <div className="w-full h-full transform group-hover:scale-110 transition-transform duration-500">
                      <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1590579491624-f98f36d4c763')] bg-cover bg-center"></div>
                    </div>
                  </div>
                </div>

                {/* Landmark 3 - Sundarbans */}
                <div
                  className={`overflow-hidden rounded-xl shadow-lg group transition-all duration-500 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: '1800ms' }}
                >
                  <div className="relative h-60 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                    <div className="absolute bottom-4 left-4 z-20 text-white">
                      <h3 className="text-xl font-bold">Sundarbans</h3>
                      <p>Khulna</p>
                    </div>
                    <div className="w-full h-full transform group-hover:scale-110 transition-transform duration-500">
                      <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1630662952636-a1b68e30f6fc')] bg-cover bg-center"></div>
                    </div>
                  </div>
                </div>

                {/* Landmark 4 - Shaheed Minar */}
                <div
                  className={`overflow-hidden rounded-xl shadow-lg group transition-all duration-500 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: '1900ms' }}
                >
                  <div className="relative h-60 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                    <div className="absolute bottom-4 left-4 z-20 text-white">
                      <h3 className="text-xl font-bold">Shaheed Minar</h3>
                      <p>Dhaka</p>
                    </div>
                    <div className="w-full h-full transform group-hover:scale-110 transition-transform duration-500">
                      <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1610807862288-6b2a2a325a13')] bg-cover bg-center"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Blogs */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-green-700">Featured Blogs</h3>
              <div className="space-y-4">
                {/* Blog 1 */}
                <div
                  className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-lg ${
                    isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                  }`}
                  style={{ transitionDelay: '2000ms' }}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 relative h-32 md:h-auto">
                      <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1590579491624-f98f36d4c763')] bg-cover bg-center"></div>
                    </div>
                    <div className="md:w-2/3 p-4">
                      <div className="text-xs text-blue-600 font-semibold">Travel</div>
                      <h4 className="font-bold mb-1">10 Must-Visit Places in Cox's Bazar</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        Discover the hidden gems of the world's longest natural sea beach and make the most of your visit.
                      </p>
                      <div className="mt-2">
                        <Link href="/blogs" className="text-sm text-green-600 hover:text-green-800">
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blog 2 */}
                <div
                  className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-lg ${
                    isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                  }`}
                  style={{ transitionDelay: '2100ms' }}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 relative h-32 md:h-auto">
                      <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1630662952636-a1b68e30f6fc')] bg-cover bg-center"></div>
                    </div>
                    <div className="md:w-2/3 p-4">
                      <div className="text-xs text-green-600 font-semibold">Wildlife</div>
                      <h4 className="font-bold mb-1">Exploring the Sundarbans: A Complete Guide</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        Everything you need to know about visiting the world's largest mangrove forest and spotting the Royal Bengal Tiger.
                      </p>
                      <div className="mt-2">
                        <Link href="/blogs" className="text-sm text-green-600 hover:text-green-800">
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blog 3 */}
                <div
                  className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-lg ${
                    isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                  }`}
                  style={{ transitionDelay: '2200ms' }}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 relative h-32 md:h-auto">
                      <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1609946860441-a51ffcf22208')] bg-cover bg-center"></div>
                    </div>
                    <div className="md:w-2/3 p-4">
                      <div className="text-xs text-red-600 font-semibold">Culture</div>
                      <h4 className="font-bold mb-1">The Historical Significance of Ahsan Manzil</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        Learn about the rich history of the Pink Palace and its importance in Bangladesh's cultural heritage.
                      </p>
                      <div className="mt-2">
                        <Link href="/blogs" className="text-sm text-green-600 hover:text-green-800">
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/blogs"
                  className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  View All Blogs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-6 transition-all duration-1000 ${
              isLoaded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            }`}
            style={{ transitionDelay: '2400ms' }}
          >
            Join Our Community Today
          </h2>
          <p
            className={`text-xl mb-10 max-w-2xl mx-auto transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '2600ms' }}
          >
            Connect with the Bangladeshi community, make new friends, and share your experiences.
          </p>
          <div
            className={`transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '2800ms' }}
          >
            <Link
              href="/posts"
              className="px-8 py-4 bg-white text-green-700 rounded-lg shadow-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 inline-block"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer with Bangladesh theme */}
      <footer className="py-10 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-green-500">Notun Thikana Bangladesh</h2>
              <p className="text-gray-400">Connect with your community</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/forums" className="hover:text-green-500 transition-colors">Forums</Link>
              <Link href="/housing" className="hover:text-green-500 transition-colors">Housing</Link>
              <Link href="/blogs" className="hover:text-green-500 transition-colors">Blogs</Link>
              <Link href="/notifications" className="hover:text-green-500 transition-colors">Notifications</Link>
              <Link href="/events" className="hover:text-green-500 transition-colors">Events</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Notun Thikana Bangladesh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}