import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { ReactQueryProvider } from './react-query-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ContextHub',
  description: 'Context management platform for AI applications.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="px-6">{children}</SidebarInset>
          </SidebarProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
