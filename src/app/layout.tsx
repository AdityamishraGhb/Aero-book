import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://aerobook.flights"),
  title: {
    default: "AeroBook — Fly smarter. Book anywhere.",
    template: "%s | AeroBook",
  },
  description:
    "AeroBook is a modern flight search and metasearch platform. Compare live routes, find best value airfares, and experience seamless booking.",
  applicationName: "AeroBook",
  keywords: [
    "flight search",
    "metasearch",
    "airfare comparison",
    "airline tickets",
    "cheap flights India",
    "AeroBook",
  ],
  authors: [{ name: "AeroBook Team" }],
  creator: "AeroBook",
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://aerobook.flights",
    title: "AeroBook — Fly smarter. Book anywhere.",
    description: "Compare live routes, find best value airfares, and experience seamless booking.",
    siteName: "AeroBook",
  },
  twitter: {
    card: "summary_large_image",
    title: "AeroBook — Fly smarter. Book anywhere.",
    description: "Compare live routes, find best value airfares, and experience seamless booking.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E7C7B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${inter.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-primary">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <Providers>
          <Header />
          <main id="main-content" className="flex-1 flex flex-col" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
