import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import { Suspense } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import Providers from '@/components/providers';
import MainNav from '@/widgets/nav/ui/main-nav';
import { LoginModal } from '@/features/auth/ui/login-modal';
import { SignupModal } from '@/features/auth/ui/signup-modal';
import { AuthRedirectHandler } from '@/features/auth/ui/auth-redirect-handler';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Vridge',
  description: '베트남 인재와 한국 기업을 연결하는 글로벌 채용 플랫폼',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <MainNav />
          {children}
          <LoginModal />
          <SignupModal />
          <Suspense>
            <AuthRedirectHandler />
          </Suspense>
        </Providers>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
    </html>
  );
}
