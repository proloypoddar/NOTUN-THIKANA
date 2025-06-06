import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from '@/components/session-provider';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';
import Header from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Notun Thikana - Your Urban Community Hub',
  description: 'Connect with your urban community, find housing, and access essential services',
  robots: 'index,follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://project-660ipemrg-proloypoddars-projects.vercel.app/',
    title: 'Notun Thikana - Your Urban Community Hub',
    description: 'Connect with your urban community, find housing, and access essential services',
    siteName: 'Notun Thikana',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NotificationProvider>
              <Header />
              <main className="min-h-screen bg-background">{children}</main>
              <Toaster />
            </NotificationProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}