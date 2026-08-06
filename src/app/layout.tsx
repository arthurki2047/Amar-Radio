
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/context/theme-provider';
import { AppProvider } from '@/context/app-context';
import AudioPlayer from '@/components/audio-player';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Amar Radio',
  description: 'A modern web radio app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-headline antialiased">
        <FirebaseClientProvider>
          <AppProvider>
              <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem
                  disableTransitionOnChange
                  themes={['light', 'dark', 'red']}
              >
                  {children}
                  <Toaster />
                  <AudioPlayer />
              </ThemeProvider>
          </AppProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
