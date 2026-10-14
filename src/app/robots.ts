import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aerobook.flights";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/routes/", "/flights/", "/auth/signin"],
        disallow: ["/api/", "/account", "/booking", "/dev/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
