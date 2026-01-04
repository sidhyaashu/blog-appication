import './globals.css';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/providers';
import { Toaster } from 'sonner';
import ErrorBoundary from '@/components/error-boundary';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Ovanthra Blog',
  description: 'A modern full-stack blog application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-0 focus:left-0 focus:bg-primary focus:text-primary-foreground focus:p-3">Skip to content</a>
        <Providers>
          <ErrorBoundary>
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
          </ErrorBoundary>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
