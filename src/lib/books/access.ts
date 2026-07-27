import prisma from "@/lib/prisma";

export class BookAccessError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "BookAccessError";
    this.status = status;
  }
}

export type BookAccessResult = {
  book: {
    id: string;
    title: string;
    slug: string;
    r2Key: string;
    price: number;
    coverImage: string;
  };
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
