const ABSOLUTE_SCHEME_RE = /^[a-z][a-z\d+\-.]*:/i;

export function normalizeImageSrc(src?: string | null): string {
  const value = src?.trim();

  if (!value) {
    return "/og-image.jpg";
  }

  if (value.startsWith("//")) {
    return `https:${value}`;
  }

  if (value.startsWith("/") || ABSOLUTE_SCHEME_RE.test(value)) {
    return value;
  }

  if (value.includes(".")) {
    return `https://${value}`;
  }

  return "/og-image.jpg";
}
