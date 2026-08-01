import prisma from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://ezzfreedomandhope.or.ke";
  const currentDate = new Date().toISOString();

  try {
    // Fetch books, services, and articles concurrently
    const [books, services, articles, blogPosts] = await Promise.all([
      prisma.books.findMany({
        select: { slug: true },
      }),
      prisma.service.findMany({
        select: { slug: true },
      }),
      prisma.article.findMany({
        select: { slug: true },
      }),
      prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    // Static pages with their priorities and change frequencies
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: `${baseURL}`,
        lastModified: currentDate,
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${baseURL}/about-us`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.9,
      },
      {
        url: `${baseURL}/services`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: `${baseURL}/articles`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${baseURL}/blog`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${baseURL}/contact`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${baseURL}/sign-in`,
        lastModified: currentDate,
        changeFrequency: "yearly",
        priority: 0.3,
      },
      {
        url: `${baseURL}/sign-up`,
        lastModified: currentDate,
        changeFrequency: "yearly",
        priority: 0.3,
      },
    ];

    // Dynamic entries for books
    const bookEntries: MetadataRoute.Sitemap = books.map(({ slug }) => ({
      url: `${baseURL}/book-details/${slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    // Dynamic entries for services
    const serviceEntries: MetadataRoute.Sitemap = services.map(({ slug }) => ({
      url: `${baseURL}/service-details/${slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    // Dynamic entries for articles
    const articleEntries: MetadataRoute.Sitemap = articles.map(({ slug }) => ({
      url: `${baseURL}/article-details/${slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const blogEntries: MetadataRoute.Sitemap = blogPosts.map(
      ({ slug, updatedAt }) => ({
        url: `${baseURL}/blog/${slug}`,
        lastModified: updatedAt.toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }),
    );

    // Combine all entries
    return [
      ...staticPages,
      ...serviceEntries,
      ...bookEntries,
      ...articleEntries,
      ...blogEntries,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Return minimal sitemap if database fails
    return [
      {
        url: `${baseURL}`,
        lastModified: currentDate,
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${baseURL}/about-us`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.9,
      },
      {
        url: `${baseURL}/contact`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.8,
      },
    ];
  }
}
