import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import Providers from '@/frontend/components/providers';
import { Ga4Bootstrap } from '@/frontend/components/analytics/ga4-bootstrap';
import { Ga4IdentitySync } from '@/frontend/components/analytics/ga4-identity-sync';
import { PageViewTracker } from '@/frontend/components/analytics/page-view-tracker';
import MainNav from '@/frontend/widgets/nav/ui/main-nav';
import { LoginModal } from '@/frontend/features/auth/ui/login-modal';
import { SignupModal } from '@/frontend/features/auth/ui/signup-modal';
import { AuthRedirectHandler } from '@/frontend/features/auth/ui/auth-redirect-handler';
import { getServerI18n } from '@/shared/i18n/server';

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
          <Ga4Bootstrap />
          <Ga4IdentitySync />
          <PageViewTracker />
          <Suspense>
            <AuthRedirectHandler />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
