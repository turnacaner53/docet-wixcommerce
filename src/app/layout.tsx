import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import type { Metadata } from 'next';
import { Lora } from 'next/font/google';

import { Toaster } from '@/components/ui/toaster';

import './globals.css';

const lora = Lora({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Docet Shop',
    absolute: 'Docet Shop',
  },
  description: 'Next.js + Wix E-commerce',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={lora.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <Navbar />
            <div className='min-h-[50vh]'>{children}</div>
            <Footer />
          </ReactQueryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
