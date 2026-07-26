import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  BookOpen,
  FileText,
  Library,
  Lock,
  ShoppingBag,
} from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import DownloadButton from "./DownloadButton";

export const metadata = {
  title: "My Library – EZZ Freedom and Hope",
  description: "Access all your purchased books and articles.",
};

async function LibraryPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  // Fetch all purchases for this user (books + articles)
  const purchases = await prisma.userPurchase.findMany({
    where: { userId: session.user.id },
    include: {
      book: {
        select: {
          id: true,
          title: true,
          coverImage: true,
          slug: true,
          r2Key: true,
          downLoadUrl: true,
        },
      },
      article: {
        select: {
          id: true,
          title: true,
          coverImage: true,
          slug: true,
          r2Key: true,
          downloadUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const bookPurchases = purchases.filter((p) => p.itemType === "BOOK" && p.book);
  const articlePurchases = purchases.filter(
    (p) => p.itemType === "ARTICLE" && p.article,
  );

  return (
    <div className="min-h-screen space-y-10 py-8">
      {/* ── Header ── */}
      <div className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Library className="h-6 w-6" />
          <span className="text-sm font-semibold uppercase tracking-widest">
            My Library
          </span>
        </div>
        <h1 className="text-4xl font-bold text-foreground">Your Purchased Content</h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          All your books and articles are here. Click{" "}
          <strong>Download</strong> to get a secure, time-limited link to your
          file.
        </p>
      </div>

      {/* ── Empty state ── */}
      {purchases.length === 0 && (
        <Card className="mx-auto max-w-lg border-dashed border-primary/30">
          <CardContent className="flex flex-col items-center gap-5 py-16 text-center">
            <div className="rounded-full bg-primary/10 p-5">
              <ShoppingBag className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">No purchases yet</h2>
              <p className="text-sm text-muted-foreground">
                Browse our books and articles and complete a purchase to see
                them here.
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild className="rounded-full">
                <Link href="/books">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Books
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/articles">
                  <FileText className="mr-2 h-4 w-4" />
                  Browse Articles
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Books ── */}
      {bookPurchases.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Books</h2>
            <Badge variant="secondary" className="ml-1">
              {bookPurchases.length}
            </Badge>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookPurchases.map(({ book }) => (
              <LibraryItemCard
                key={book!.id}
                id={book!.id}
                title={book!.title}
                coverImage={book!.coverImage}
                detailsHref={`/book-details/${book!.slug}`}
                itemType="BOOK"
                hasR2Key={!!book!.r2Key}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Articles ── */}
      {articlePurchases.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Articles</h2>
            <Badge variant="secondary" className="ml-1">
              {articlePurchases.length}
            </Badge>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articlePurchases.map(({ article }) => (
              <LibraryItemCard
                key={article!.id}
                id={article!.id}
                title={article!.title}
                coverImage={article!.coverImage}
                detailsHref={`/article-details/${article!.slug}`}
                itemType="ARTICLE"
                hasR2Key={!!article!.r2Key}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Security notice ── */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-4 p-5">
          <Lock className="h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            Download links are generated fresh each time and expire after{" "}
            <strong>1 hour</strong> for your security. Simply click Download
            again if your link expires.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Item Card (server) ─────────────────────────────────────────────────────────
function LibraryItemCard({
  id,
  title,
  coverImage,
  detailsHref,
  itemType,
  hasR2Key,
}: {
  id: string;
  title: string;
  coverImage: string;
  detailsHref: string;
  itemType: "BOOK" | "ARTICLE";
  hasR2Key: boolean;
}) {
  return (
    <Card className="group overflow-hidden border border-border/50 shadow-md transition-shadow hover:shadow-lg">
      {/* Cover */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-muted">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">
          {itemType === "BOOK" ? "Book" : "Article"}
        </Badge>
      </div>

      <CardContent className="space-y-4 p-4">
        <h3 className="line-clamp-2 font-semibold leading-snug text-foreground">
          {title}
        </h3>
        <div className="flex flex-col gap-2">
          {/* Client download button handles the API call */}
          <DownloadButton itemId={id} itemType={itemType} />
          <Button variant="outline" size="sm" className="w-full rounded-full" asChild>
            <Link href={detailsHref}>
              {itemType === "BOOK" ? (
                <BookOpen className="mr-2 h-3 w-3" />
              ) : (
                <FileText className="mr-2 h-3 w-3" />
              )}
              View Details
            </Link>
          </Button>
        </div>
        {!hasR2Key && (
          <p className="text-center text-[11px] text-muted-foreground">
            * Legacy download link (UploadThing). Admin can migrate to R2.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default LibraryPage;
