"use server";

import ArticleEmail from "@/components/Email/ArticleEmail";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendArticle(articleId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.error("Unauthorized request: No user found.");
      return;
    }

    const user = session.user;

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      console.error("Article not found for ID:", articleId);
      return;
    }

    const data = await resend.emails.send({
      from: "Ezz freedom and hope <no-reply@ezzfreedomandhope.or.ke>",
      to: [user.email],
      subject: `Your Requested Article: ${article.title}`,
      react: ArticleEmail({
        articleTitle: article.title,
        downloadLink: article.downloadUrl,
        recipientName: user.name,
      }),
    });

    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Error emailing the article:", error);
  }
}
