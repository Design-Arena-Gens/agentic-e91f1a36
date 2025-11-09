import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import { DmsProvider } from '@/lib/store';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DocumentManagement DMS',
  description: 'Pharmaceutical document management compliant with 21 CFR Part 11, ISO 9001, ICH Q7, and GMP.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-100`}> 
        <DmsProvider>
          <div className="min-h-screen bg-slate-100 p-6">
            <div className="mx-auto flex max-w-7xl flex-col gap-6">{children}</div>
          </div>
        </DmsProvider>
      </body>
    </html>
  );
}
