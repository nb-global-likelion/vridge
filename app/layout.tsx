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
import { getServerI18n } from '@/lib/i18n/server';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, messages } = await getServerI18n();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <Providers locale={locale} messages={messages}>
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
