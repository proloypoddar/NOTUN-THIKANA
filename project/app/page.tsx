'use client';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Notun Thikana</h1>
        <p className="text-xl mb-8 max-w-2xl">
          A community platform for connecting with neighbors, sharing information, and building relationships.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <a
            href="/messages"
            className="p-6 border rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Messages</h2>
            <p>Chat with community members and stay connected</p>
          </a>

          <a
            href="/posts"
            className="p-6 border rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Community Posts</h2>
            <p>Share updates, ask questions, and discuss topics</p>
          </a>
        </div>
      </div>
    </div>
  );
}