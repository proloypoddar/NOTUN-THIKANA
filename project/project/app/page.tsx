'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section with Bangladesh-themed elements - Redesigned */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        {/* Background decorative elements - Bangladesh flag colors */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-600 rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600 rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        {/* Bangladesh map outline as background */}
        <div className="absolute inset-0 opacity-5 bg-[url('https://upload.wikimedia.org/wikipedia/commons/3/3a/Bangladesh_map.svg')] bg-no-repeat bg-center bg-contain"></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="flex flex-col items-start text-left max-w-xl">
              {/* Animated title with Bengali typography */}
              <h1
                className={`text-5xl md:text-7xl font-bold mb-6 transition-all duration-1000 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <span className="text-green-600">NOTUN</span> <span className="text-red-600">THIKANA</span>
              </h1>

              <div
                className={`h-1 w-24 bg-gradient-to-r from-green-600 to-red-600 mb-6 transition-all duration-1000 delay-200 ${
                  isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}
              ></div>

              <h2
                className={`text-2xl md:text-3xl font-medium mb-6 transition-all duration-1000 delay-300 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                The Premier Bangladeshi Community Platform
              </h2>

              {/* Animated subtitle */}
              <p
                className={`text-xl mb-10 text-gray-700 transition-all duration-1000 delay-500 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                Connect with your community, access the latest news, and discover essential resources for Bangladeshi people.
              </p>

              {/* Animated CTA buttons */}
              <div
                className={`flex flex-wrap gap-4 mb-8 transition-all duration-1000 delay-700 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <Link
                  href="/auth/signin"
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 font-medium"
                >
                  Join Our Community
                </Link>
                <Link
                  href="/blogs"
                  className="px-8 py-4 border-2 border-green-600 text-green-700 rounded-lg hover:bg-green-50 transform hover:-translate-y-1 transition-all duration-300 font-medium"
                >
                  Explore Blogs
                </Link>
              </div>

              {/* Stats */}
              <div
                className={`grid grid-cols-3 gap-4 w-full transition-all duration-1000 delay-900 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">10K+</p>
                  <p className="text-sm text-gray-600">Community Members</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">500+</p>
                  <p className="text-sm text-gray-600">Housing Listings</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">200+</p>
                  <p className="text-sm text-gray-600">Daily News Updates</p>
                </div>
              </div>
            </div>

            {/* Right side - Image */}
            <div
              className={`relative h-[500px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-1000 delay-500 ${
                isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <Image
                src="https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Bangladesh Landscape"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-8 left-8 z-20 text-white max-w-xs">
                <h3 className="text-2xl font-bold mb-2">Discover Bangladesh</h3>
                <p className="text-sm opacity-90">Explore the beauty, culture, and opportunities in Bangladesh through our community platform.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blog Section - Simplified */}
      <section className="py-16 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-8 text-center text-green-800 transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '1400ms' }}
          >
            Featured Content
          </h2>

          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Explore our most popular articles and discover the beauty of Bangladesh
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Featured Blog 1 */}
            <div
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl transform hover:-translate-y-1 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '1600ms' }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1590579491624-f98f36d4c763"
                  alt="Cox's Bazar Beach"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-2 py-1 m-2 rounded">
                  Travel
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">10 Must-Visit Places in Cox's Bazar</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  Discover the hidden gems of the world's longest natural sea beach and make the most of your visit.
                </p>
                <Link href="/blogs" className="text-green-600 hover:text-green-800 font-medium text-sm inline-flex items-center">
                  Read Article <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Featured Blog 2 */}
            <div
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl transform hover:-translate-y-1 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '1700ms' }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1630662952636-a1b68e30f6fc"
                  alt="Sundarbans"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-2 py-1 m-2 rounded">
                  Wildlife
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">Exploring the Sundarbans: A Complete Guide</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  Navigate the world's largest mangrove forest and discover the unique wildlife of the Sundarbans.
                </p>
                <Link href="/blogs" className="text-green-600 hover:text-green-800 font-medium text-sm inline-flex items-center">
                  Read Article <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Featured Blog 3 */}
            <div
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl transform hover:-translate-y-1 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '1800ms' }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1609946860441-a51ffcf22208"
                  alt="Ahsan Manzil"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 m-2 rounded">
                  Culture
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">The Historical Significance of Ahsan Manzil</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  Learn about the rich history of the Pink Palace and its importance in Bangladesh's cultural heritage.
                </p>
                <Link href="/blogs" className="text-green-600 hover:text-green-800 font-medium text-sm inline-flex items-center">
                  Read Article <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/blogs"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
            >
              Explore All Articles <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Community Today
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Sign up to unlock all features and become part of the largest Bangladeshi community platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin" className="px-8 py-4 bg-white text-green-700 rounded-lg hover:bg-gray-100 transition-all font-medium">
              Sign In
            </Link>
            <Link href="/auth/signup" className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all font-medium">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}