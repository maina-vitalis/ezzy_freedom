import prisma from "@/lib/prisma";
import slugify from "slugify";

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/** Rough reading time from HTML content (~200 wpm). */
export function estimateReadTimeMinutes(html: string): number {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function createSlugBase(title: string): string {
  return (
    slugify(title, { lower: true, strict: true, trim: true }) || "post"
  );
}

/** Ensures slug uniqueness; optionally ignores an existing post id on update. */
export async function ensureUniqueBlogSlug(
  title: string,
  preferredSlug?: string,
  excludeId?: string,
): Promise<string> {
  const base = preferredSlug?.trim()
    ? createSlugBase(preferredSlug)
    : createSlugBase(title);

  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) {
      return candidate;
    }

    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

export function parseTagsInput(value: string | string[]): string[] {
  const raw = Array.isArray(value) ? value.join(",") : value;
  return [
    ...new Set(
      raw
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ].slice(0, 12);
}
