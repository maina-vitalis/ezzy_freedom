"use server";

import BookEmail from "@/components/Email/BookEmail";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBook(bookId: string) {
  console.log(bookId, "wawawawa");
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    console.log(session);

    if (!session) {
      console.error("Unauthorized request: No user found.");
      return;
    }

    const book = await prisma.books.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      console.error("Book not found for ID:", bookId);
      return;
    }

    const recipientEmail = "mainavitalis65@gmail.com";

    const data = await resend.emails.send({
      from: "Tumaini Fitness Centre <no-reply@tumainifitness.co.ke>",
      to: [recipientEmail],
      subject: `Your Requested Book: ${book.title}`,
      react: BookEmail({
        bookTitle: book.title,
        downloadLink: book.downLoadUrl,
        recipientName: "vitalis",
      }),
    });

    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Error emailing the book:", error);
  }
}
