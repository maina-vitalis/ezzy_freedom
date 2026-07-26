import BookForm from "@/components/forms/BookForm";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type UpdateBookProps = Promise<{
  bookId: string;
}>;

export const metadata = {
  title: "Update Book – EZZ Freedom and Hope",
};

async function UpdateBookPage(props: { params: UpdateBookProps }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/not-found");
  }

  const { bookId } = await props.params;

  const book = await prisma.books.findUnique({
    where: { id: bookId },
  });

  if (!book) {
    return (
      <div className="mt-5 text-center text-sm font-semibold text-destructive">
        Book not found
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Update Book</h1>
      <BookForm book={book} method="update" />
    </div>
  );
}

export default UpdateBookPage;
