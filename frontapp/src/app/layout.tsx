import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from '@/context/NotificationContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider } from '@/hooks/useTheme';

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

export default function RootLayout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <NotificationProvider>
              <ToastProvider>
                <ThemeProvider>
                  {children}
                </ThemeProvider>
              </ToastProvider>
            </NotificationProvider>
          </AuthProvider>
        </QueryProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
