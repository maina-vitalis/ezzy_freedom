import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseURL =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://ezzfreedomandhope.or.ke";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about-us",
          "/contact",
          "/services",
          "/service-details/*",
          "/articles",
          "/article-details/*",
          "/book-details/*",
        ],
        disallow: [
          "/dashboard/*",
          "/reader/*",
          "/users/*",
          "/api/*",
          "/sign-in",
          "/sign-up",
          "/reset-password",
          "/forget-password",
          "/_next/",
          "/private/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/about-us",
          "/contact",
          "/services",
          "/service-details/*",
          "/articles",
          "/article-details/*",
          "/book-details/*",
        ],
        disallow: [
          "/dashboard/*",
          "/reader/*",
          "/users/*",
          "/api/*",
          "/sign-in",
          "/sign-up",
          "/reset-password",
          "/forget-password",
        ],
      },
    ],
    sitemap: `${baseURL}/sitemap.xml`,
    host: baseURL,
  };
}
