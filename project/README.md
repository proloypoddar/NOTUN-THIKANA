# Notun Thikana - Bangladesh Community Portal

Notun Thikana is a comprehensive community portal designed specifically for Bangladeshi communities. It provides a platform for connecting people, sharing information, finding housing, and accessing essential services.

## Features

- **User Authentication**: Secure signup and login with email/password or Google OAuth
- **Multi-User Support**: Multiple users can use the system simultaneously
- **Real-time Messaging**: Chat with friends in real-time with notifications
- **Friend Requests**: Connect with other users through a friend request system
- **News Feed**: Latest news from trusted Bangladeshi sources
- **Blog Posts**: Informative articles about Bangladesh and community topics
- **Housing Listings**: Find and post housing opportunities
- **Payment System**: Secure payment processing for property bookings
- **Landlord Leaderboard**: Rating-based leaderboard for landlords
- **Events**: Discover and create community events
- **Forums**: Engage in community discussions
- **Admin Dashboard**: Comprehensive tools for platform management
- **Notifications**: Real-time updates for messages, friend requests, and more

## Technology Stack

- **Frontend**: Next.js 13, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Real-time**: Pusher
- **Deployment**: Vercel

## Deployment on Vercel

### Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
3. [Pusher](https://pusher.com) account for real-time features
4. [Google OAuth](https://console.cloud.google.com) credentials (optional)

### Environment Variables

Set up the following environment variables in your Vercel project:

```
MONGODB_URI=mongodb+srv://polokpoddar:R7THOg45tgCcOxle@cluster0.kvtm9t5.mongodb.net
NEXTAUTH_SECRET=your-secret-key-for-jwt-signing
NEXTAUTH_URL=https://your-vercel-deployment-url.vercel.app
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=your-pusher-cluster
GOOGLE_CLIENT_ID=your-google-client-id (optional)
GOOGLE_CLIENT_SECRET=your-google-client-secret (optional)
```

### Deployment Steps

1. Fork or clone this repository
2. Connect your GitHub repository to Vercel
3. Configure the environment variables in the Vercel dashboard
4. Deploy the project
5. After deployment, the database will be automatically seeded with initial data

## Local Development

### Prerequisites

- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Pusher account

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/notun-thikana.git
   cd notun-thikana
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your-mongodb-connection-string
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   PUSHER_APP_ID=your-pusher-app-id
   PUSHER_KEY=your-pusher-key
   PUSHER_SECRET=your-pusher-secret
   PUSHER_CLUSTER=your-pusher-cluster
   GOOGLE_CLIENT_ID=your-google-client-id (optional)
   GOOGLE_CLIENT_SECRET=your-google-client-secret (optional)
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app`: Next.js app router pages and API routes
- `/components`: Reusable React components
- `/lib`: Utility functions, hooks, and database models
- `/public`: Static assets
- `/styles`: Global CSS styles

## Key Features Explained

### Authentication

The application uses NextAuth.js for authentication, supporting both email/password and Google OAuth. User data is stored in MongoDB.

### Multi-User Support

The system is designed to support multiple users simultaneously. Each user has their own profile, messages, and can interact with shared resources like property listings and the landlord leaderboard.

### Real-time Messaging

Messaging is implemented using Pusher for real-time communication. Messages are stored in MongoDB and delivered instantly to recipients. Users can search for and add new contacts.

### Friend Request System

Users can send friend requests to other users. Once accepted, they can start messaging each other.

### Payment System

The payment system allows users to make payments for property bookings. It includes payment history tracking and receipt generation. Multiple payment methods are supported.

### Landlord Leaderboard

Landlords are ranked based on ratings from tenants. The leaderboard showcases top landlords based on various metrics like cleanliness, communication, and value.

### News Feed

The homepage displays real news from trusted Bangladeshi sources, keeping users informed about current events.

### Blog System

The blog section features articles about Bangladesh, including topics like architecture, real estate, interior design, and urban living.

### Admin Dashboard

Administrators have access to a comprehensive dashboard for managing users, content, and platform settings. Admins can view user passwords and delete users when necessary.

## Bangladesh-Specific Features

- **Phone Number Format**: Support for Bangladesh phone numbers (+8801XXXXXXXXX)
- **Local News**: Integration with Bangladeshi news sources
- **Cultural Content**: Blog posts and information relevant to Bangladesh
- **Community Focus**: Features designed for Bangladeshi community needs

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Pusher](https://pusher.com/)
- [NextAuth.js](https://next-auth.js.org/)
