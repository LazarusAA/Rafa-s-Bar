import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';

export const metadata: Metadata = {
  title: "Rafa's Bar",
  description: 'El Chinchorro Cyberpunk de Costa Rica'
};

export const viewport: Viewport = {
  maximumScale: 1
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-rafa-base text-white ${manrope.className}`}
    >
      <body className="min-h-screen bg-rafa-base antialiased">
        {children}
      </body>
    </html>
  );
}
