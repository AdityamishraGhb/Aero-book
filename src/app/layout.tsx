import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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
  title: {
    default: "AeroBook — Fly smarter. Book anywhere.",
    template: "%s | AeroBook",
  },
  description:
    "AeroBook is a modern flight search and metasearch platform. Compare live routes, find best value airfares, and experience seamless booking.",
  applicationName: "AeroBook",
  keywords: ["flight search", "metasearch", "airfare comparison", "airline tickets", "AeroBook"],
  authors: [{ name: "AeroBook Team" }],
  creator: "AeroBook",
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
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
