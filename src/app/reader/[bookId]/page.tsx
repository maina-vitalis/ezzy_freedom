import EbookReader from "@/components/reader/EbookReader";
import ReaderError from "@/components/reader/ReaderError";
import { auth } from "@/lib/auth";
import { assertCanAccessBook, BookAccessError } from "@/lib/books/access";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Ebook Reader",
  robots: { index: false, follow: false },
};

type Params = Promise<{ bookId: string }>;

export default async function ReaderPage({ params }: { params: Params }) {
  const { bookId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/reader/${bookId}`)}`);
  }

  try {
    const { book } = await assertCanAccessBook(session.user.id, bookId);
    return (
      <EbookReader
        bookId={book.id}
        initialTitle={book.title}
        bookSlug={book.slug}
      />
    );
  } catch (error) {
    if (error instanceof BookAccessError) {
      let slug: string | undefined;
      if (error.status === 403) {
        const book = await prisma.books.findUnique({
          where: { id: bookId },
          select: { slug: true },
        });
        slug = book?.slug;
      }
      return (
        <div className="min-h-dvh bg-neutral-950">
          <ReaderError
            status={error.status}
            message={error.message}
            bookSlug={slug}
          />
        </div>
      );
    }
    throw error;
  }
}
