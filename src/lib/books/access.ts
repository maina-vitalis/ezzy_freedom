import prisma from "@/lib/prisma";

export class BookAccessError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "BookAccessError";
    this.status = status;
  }
}

/** Alias for article/book readable content errors. */
export const ContentAccessError = BookAccessError;

export type ReadableContent = {
  id: string;
  title: string;
  slug: string;
  r2Key: string;
  price: number;
  coverImage: string;
};

export type BookAccessResult = {
  book: ReadableContent;
  purchaseId: string | null;
};

export type ArticleAccessResult = {
  article: ReadableContent;
  purchaseId: string | null;
};

/**
 * Verifies the user may access a book PDF.
 * Ownership = UserPurchase row, or free book (price === 0).
 */
export async function assertCanAccessBook(
  userId: string,
  bookId: string,
): Promise<BookAccessResult> {
  const book = await prisma.books.findUnique({
    where: { id: bookId },
    select: {
      id: true,
      title: true,
      slug: true,
      r2Key: true,
      price: true,
      coverImage: true,
    },
  });

  if (!book) {
    throw new BookAccessError("Book not found", 404);
  }

  if (!book.r2Key) {
    throw new BookAccessError(
      "This ebook is not available for reading yet. Please contact support.",
      404,
    );
  }

  const purchase = await prisma.userPurchase.findFirst({
    where: { userId, bookId },
    select: { id: true },
  });

  if (!purchase && book.price !== 0) {
    throw new BookAccessError("You have not purchased this ebook", 403);
  }

  return {
    book: {
      id: book.id,
      title: book.title,
      slug: book.slug,
      r2Key: book.r2Key,
      price: book.price,
      coverImage: book.coverImage,
    },
    purchaseId: purchase?.id ?? null,
  };
}

/**
 * Verifies the user may access an article PDF.
 * Ownership = UserPurchase row, or free article (price === 0).
 */
export async function assertCanAccessArticle(
  userId: string,
  articleId: string,
): Promise<ArticleAccessResult> {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: {
      id: true,
      title: true,
      slug: true,
      r2Key: true,
      price: true,
      coverImage: true,
    },
  });

  if (!article) {
    throw new BookAccessError("Article not found", 404);
  }

  if (!article.r2Key) {
    throw new BookAccessError(
      "This article is not available for reading yet. Please contact support.",
      404,
    );
  }

  const purchase = await prisma.userPurchase.findFirst({
    where: { userId, articleId },
    select: { id: true },
  });

  if (!purchase && article.price !== 0) {
    throw new BookAccessError("You have not purchased this article", 403);
  }

  return {
    article: {
      id: article.id,
      title: article.title,
      slug: article.slug,
      r2Key: article.r2Key,
      price: article.price,
      coverImage: article.coverImage,
    },
    purchaseId: purchase?.id ?? null,
  };
}
