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
              নতুন ঠিকানা <span className="text-red-600">বাংলাদেশ</span>
            </h1>
            <h2
              className={`text-3xl md:text-4xl font-bold mb-6 transition-all duration-1000 delay-300 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              Notun Thikana Bangladesh
            </h2>

            {/* Animated subtitle */}
            <p
              className={`text-xl mb-10 max-w-2xl text-gray-700 transition-all duration-1000 delay-500 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              আপনার প্রতিবেশীদের সাথে সংযোগ স্থাপন করুন, তথ্য শেয়ার করুন এবং বাংলাদেশের সম্প্রদায়ের সাথে সম্পর্ক গড়ে তুলুন।
              <br /><br />
              Connect with your neighbors, share information, and build relationships with the Bangladeshi community.
            </p>

            {/* Animated CTA buttons */}
            <div
              className={`flex flex-wrap justify-center gap-4 mb-16 transition-all duration-1000 delay-700 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <Link
                href="/posts"
                className="px-8 py-4 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transform hover:-translate-y-1 transition-all duration-300"
              >
                কমিউনিটি পোস্ট দেখুন
              </Link>
              <Link
                href="/messages"
                className="px-8 py-4 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transform hover:-translate-y-1 transition-all duration-300"
              >
                বার্তা পাঠান
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
            আমাদের সম্প্রদায়ের বৈশিষ্ট্য
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 - Community Connection */}
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
              <h3 className="text-xl font-bold mb-4 text-center text-green-800">সম্প্রদায়ের সংযোগ</h3>
              <p className="text-gray-700 text-center">
                আপনার আশেপাশের বাংলাদেশী সম্প্রদায়ের সাথে সংযোগ স্থাপন করুন। নতুন বন্ধু তৈরি করুন এবং সহায়তা নেটওয়ার্ক গড়ে তুলুন।
              </p>
            </div>

            {/* Feature 2 - Local Information */}
            <div
              className={`bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: '1000ms' }}
            >
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-red-800">স্থানীয় তথ্য</h3>
              <p className="text-gray-700 text-center">
                বাংলাদেশের বিভিন্ন অঞ্চল সম্পর্কে গুরুত্বপূর্ণ তথ্য, সেবা এবং সুযোগ-সুবিধা সম্পর্কে জানুন।
              </p>
            </div>

            {/* Feature 3 - Cultural Events */}
            <div
              className={`bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: '1200ms' }}
            >
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-green-800">সাংস্কৃতিক অনুষ্ঠান</h3>
              <p className="text-gray-700 text-center">
                পহেলা বৈশাখ, বিজয় দিবস, স্বাধীনতা দিবসসহ বিভিন্ন বাংলাদেশী উৎসব এবং সাংস্কৃতিক অনুষ্ঠানের তথ্য পান।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bangladesh Landmarks Section */}
      <section className="py-16 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-16 text-center text-green-800 transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '1400ms' }}
          >
            বাংলাদেশের দর্শনীয় স্থান
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <h3 className="text-xl font-bold">আহসান মঞ্জিল</h3>
                  <p>ঢাকা</p>
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
              style={{ transitionDelay: '1800ms' }}
            >
              <div className="relative h-60 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <h3 className="text-xl font-bold">কক্সবাজার সমুদ্র সৈকত</h3>
                  <p>কক্সবাজার</p>
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
              style={{ transitionDelay: '2000ms' }}
            >
              <div className="relative h-60 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <h3 className="text-xl font-bold">সুন্দরবন</h3>
                  <p>খুলনা</p>
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
              style={{ transitionDelay: '2200ms' }}
            >
              <div className="relative h-60 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <h3 className="text-xl font-bold">শহীদ মিনার</h3>
                  <p>ঢাকা</p>
                </div>
                <div className="w-full h-full transform group-hover:scale-110 transition-transform duration-500">
                  <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1610807862288-6b2a2a325a13')] bg-cover bg-center"></div>
                </div>
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
            আজই আমাদের সম্প্রদায়ে যোগ দিন
          </h2>
          <p
            className={`text-xl mb-10 max-w-2xl mx-auto transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '2600ms' }}
          >
            বাংলাদেশী সম্প্রদায়ের সাথে সংযুক্ত হোন, নতুন বন্ধু তৈরি করুন, এবং আপনার অভিজ্ঞতা শেয়ার করুন।
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
              এখনই শুরু করুন
            </Link>
          </div>
        </div>
      </section>

      {/* Footer with Bangladesh theme */}
      <footer className="py-10 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-green-500">নতুন ঠিকানা বাংলাদেশ</h2>
              <p className="text-gray-400">আপনার সম্প্রদায়ের সাথে সংযোগ স্থাপন করুন</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/posts" className="hover:text-green-500 transition-colors">পোস্ট</Link>
              <Link href="/messages" className="hover:text-green-500 transition-colors">বার্তা</Link>
              <Link href="/events" className="hover:text-green-500 transition-colors">ইভেন্ট</Link>
              <Link href="/about" className="hover:text-green-500 transition-colors">আমাদের সম্পর্কে</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} নতুন ঠিকানা বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত।</p>
          </div>
        </div>
      </footer>
    </div>
  );
}