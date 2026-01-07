import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientSessionProvider from "@/components/ClientSessionProvider";
import Script from "next/script";

import { Cinzel, Inter } from "next/font/google";

export const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-disney",
  weight: ["500", "600", "700", "800"],
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});


export const metadata: Metadata = {
  title: "Event Manager",
  description: "Smart Event Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
         className={`${cinzel.variable} ${inter.variable}`}
      >
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
        <ClientSessionProvider>

          <Header />
          <main>{children}</main>
          <Footer />
        </ClientSessionProvider>
      </body>
    </html>
  );
}
