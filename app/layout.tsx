import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ray Ardika Raihan | Full-Stack Web Developer & AI Researcher",
  description:
    "Official portfolio of Ray Ardika Raihan, Full-Stack Web Developer & AI/Computer Vision Researcher specializing in Laravel, Next.js, and deep learning systems.",
  icons: {
    icon: "/assets/images/logos/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-bs-theme="light">
      <head>
        <link
          rel="stylesheet"
          href="/assets/libs/owl.carousel/dist/assets/owl.carousel.min.css"
        />
        <link
          rel="stylesheet"
          href="/assets/libs/aos-master/dist/aos.css"
        />
        <link rel="stylesheet" href="/assets/css/styles.css" />
      </head>
      <body>
        {children}
        <Script
          src="/assets/libs/jquery/dist/jquery.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/assets/libs/bootstrap/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/libs/owl.carousel/dist/owl.carousel.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/libs/aos-master/dist/aos.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/iconify-icon@1.0.8/dist/iconify-icon.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
