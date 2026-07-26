"use server";

import BookEmail from "@/components/Email/BookEmail";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBook(bookId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.error("Unauthorized request: No user found.");
      return;
    }

    const user = session.user;

    const book = await prisma.books.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      console.error("Book not found for ID:", bookId);
      return;
    }

    const data = await resend.emails.send({
      from: "Ezz freedom and hope <no-reply@ezzfreedomandhope.or.ke>",
      to: [user.email],
      subject: `Your Requested Book: ${book.title}`,
      react: BookEmail({
        bookTitle: book.title,
        downloadLink: book.downLoadUrl,
        recipientName: user.name,
      }),
    });

    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Error emailing the book:", error);
  }
}
