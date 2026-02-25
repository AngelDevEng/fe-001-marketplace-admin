import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from '@/context/NotificationContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { PublicHeader, PublicFooter } from '@/components/layout/public';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bienvenido al Lyrium Marketplace",
  description: "Tu marketplace de confianza",
};

import QueryProvider from '@/components/providers/QueryProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="light" style={{ colorScheme: 'light' }}>
      <head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <NotificationProvider>
              <ToastProvider>
                <div className="bg-gray-50 min-h-screen flex flex-col overflow-x-hidden">
                  <PublicHeader />
                  <main className="flex-1">
                    {children}
                  </main>
                  <PublicFooter />
                </div>
              </ToastProvider>
            </NotificationProvider>
          </AuthProvider>
        </QueryProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
