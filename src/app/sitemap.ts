import type { MetadataRoute } from "next";
import { TOP_INDIAN_ROUTES } from "@/data/top-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aerobook.flights";
  const now = new Date();

  // 1. Core Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/routes`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/auth/signin`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/dev/ui`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // 2. Top 20 Indian Route Landing Pages
  const routeLandingPages: MetadataRoute.Sitemap = TOP_INDIAN_ROUTES.map((route) => ({
    url: `${siteUrl}/routes/${route.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // 3. Search Results Landing Pages for Top Routes
  const flightSearchPages: MetadataRoute.Sitemap = TOP_INDIAN_ROUTES.map((route) => ({
    url: `${siteUrl}/flights/${route.fromIata}-${route.toIata}`,
    lastModified: now,
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  return [...staticPages, ...routeLandingPages, ...flightSearchPages];
}
