import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ray Ardika Raihan | Full-Stack Web Developer & AI Researcher",
  description:
    "Software engineer based in Tangerang, Indonesia who designs, builds, and ships responsive Laravel & Next.js systems, QR-based operational journeys, and deep learning vision models.",
  metadataBase: new URL("https://rayardika.my.id"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Ray Ardika Raihan | Full-Stack Web Developer & AI Researcher",
    description:
      "Software engineer who designs, builds, and ships for any screen: Laravel, Next.js, REST APIs, QR journeys, and computer vision systems.",
    url: "https://rayardika.my.id",
    siteName: "Ray Ardika Raihan Portfolio",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
