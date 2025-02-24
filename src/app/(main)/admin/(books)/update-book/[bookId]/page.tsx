import BookForm from "@/components/forms/BookForm";
import prisma from "@/lib/prisma";

type UpdateBookProps = Promise<{
  bookId: string;
}>;

async function UpdateBook(props: { params: UpdateBookProps }) {
  const { bookId } = await props.params;

  //fetch book
  const book = await prisma.books.findUnique({
    where: {
      id: bookId,
    },
  });

  if (!book) {
    return (
      <div className="mt-5 text-center text-sm font-semibold">
        No book found
      </div>
    );
  }

  return (
    <div>
      <BookForm book={book} method="update" />
    </div>
  );
}

export default UpdateBook;
