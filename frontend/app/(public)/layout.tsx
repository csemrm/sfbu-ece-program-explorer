import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Nav } from '../../components/ui/Nav';
import '../globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'SFBU ECE Program Explorer', template: '%s | SFBU ECE' },
  description:
    'Interactive curriculum visualization platform for the ECE Department at San Francisco Bay University.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50 antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} San Francisco Bay University · ECE Department
        </footer>
      </body>
    </html>
  );
}
