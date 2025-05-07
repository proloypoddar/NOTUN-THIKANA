import NextAuth from 'next-auth';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Connect to the database
          await dbConnect();

          // Find the user by email
          const user = await User.findOne({ email: credentials.email }).select('+password');

          if (!user) {
            console.log('User not found:', credentials.email);
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            console.log('Invalid password for:', credentials.email);
            return null;
          }

          console.log('User authenticated successfully:', user.email);

          // Update last active timestamp
          await User.findByIdAndUpdate(user._id, { lastActive: new Date() });

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
          };
        } catch (error) {
          console.error('Error during authentication:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();

          // Check if user exists
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Generate a random password for Google users
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            // Create a new user for Google sign-in
            await User.create({
              name: user.name || 'Google User',
              email: user.email,
              password: hashedPassword,
              role: 'user',
              image: user.image,
              verified: true,
            });

            console.log(`Created new user from Google sign-in: ${user.email}`);
          } else {
            // Update last active timestamp
            await User.findByIdAndUpdate(existingUser._id, { lastActive: new Date() });
          }
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user) {
        try {
          await dbConnect();

          // Get user from database
          const dbUser = await User.findOne({ email: session.user.email });

          if (dbUser) {
            // Add user data to session
            session.user.id = dbUser._id.toString();
            session.user.role = dbUser.role;
            session.user.image = dbUser.image;

            // Add custom properties
            (session.user as any).verified = dbUser.verified;
            (session.user as any).lastActive = dbUser.lastActive;
          }
        } catch (error) {
          console.error("Error getting session:", error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-for-development',
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };