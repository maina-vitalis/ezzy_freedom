import prisma from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Ensure the base URL is defined
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://yourdomain.com";

  try {
    // Fetch books and services concurrently
    const [books, services] = await Promise.all([
      prisma.books.findMany({
        select: { slug: true },
      }),
      prisma.service.findMany({
        select: { slug: true },
      }),
    ]);

    // Create dynamic entries for books
    const bookEntries: MetadataRoute.Sitemap = books.map(({ slug }) => ({
      url: `${baseURL}/book-details/${slug}`,
      lastModified: new Date().toISOString(),
    }));

    // Create dynamic entries for services
    const serviceEntries: MetadataRoute.Sitemap = services.map(({ slug }) => ({
      url: `${baseURL}/service-details/${slug}`,
      lastModified: new Date().toISOString(),
    }));

    // Return the complete sitemap
    return [
      {
        url: `${baseURL}/about-us`,
        lastModified: new Date().toISOString(),
      },
      {
        url: `${baseURL}/sign-in`,
        lastModified: new Date().toISOString(),
      },
      {
        url: `${baseURL}/sign-up`,
        lastModified: new Date().toISOString(),
      },
      {
        url: `${baseURL}/contact`,
        lastModified: new Date().toISOString(),
      },
      ...bookEntries,
      ...serviceEntries,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [];
  }
}
