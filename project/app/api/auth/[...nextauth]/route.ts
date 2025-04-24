import NextAuth from 'next-auth';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { authenticateUser, findUserByEmail, createUser, UserRole } from '@/database';

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
          // Authenticate user with email and password
          const user = authenticateUser(credentials.email, credentials.password);

          if (!user) {
            console.log('Authentication failed for:', credentials.email);
            return null;
          }

          console.log('User authenticated successfully:', user.email);
          return {
            id: user.id,
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
          // Check if user exists
          const existingUser = findUserByEmail(user.email);

          if (!existingUser) {
            // Create a new user for Google sign-in
            createUser(
              user.name || 'Google User',
              user.email,
              // Generate a random password for Google users
              Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8),
              UserRole.USER
            );
            console.log(`Created new user from Google sign-in: ${user.email}`);
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
          // Get user from database
          const dbUser = findUserByEmail(session.user.email);

          if (dbUser) {
            // Add user data to session
            session.user.id = dbUser.id;
            session.user.role = dbUser.role;
            session.user.image = dbUser.image;

            // Add custom properties
            (session.user as any).status = dbUser.status;
            (session.user as any).lastLogin = dbUser.lastLogin;
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