import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Student ERP - Feedback System',
  description: 'Student feedback management system for courses and teachers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}