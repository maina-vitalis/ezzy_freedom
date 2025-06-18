import CheckOutForm from "@/components/forms/CheckOutForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  Shield,
  Star,
  User,
} from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type CheckOutProps = Promise<{ slug: string }>;

async function ArticleCheckOut(props: { params: CheckOutProps }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Get the current path with query parameters
  const currentPath = encodeURIComponent(
    (await headers()).get("referer") || "/",
  );

  if (!session?.user) redirect(`/sign-in?callbackUrl=${currentPath}`);

  // User prop data
  const user = {
    email: session?.user.email,
    name: session?.user.name,
  };

  const { slug } = await props.params;

  // Fetch item based on type
  const article = await prisma.article.findFirst({
    where: { slug },
  });

  if (!article) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6">
        <div className="rounded-full bg-destructive/10 p-4">
          <FileText className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Article Not Found
          </h2>
          <p className="max-w-md text-muted-foreground">
            The article you&apos;re looking for doesn&apos;t exist or may have
            been removed.
          </p>
        </div>
        <Button
          size="lg"
          asChild
          className="rounded-full bg-primary hover:bg-primary/90"
        >
          <Link href="/articles" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Browse All Articles
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <Button
            variant="ghost"
            asChild
            className="group -ml-4 text-muted-foreground hover:text-primary"
          >
            <Link href="/articles" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Articles
            </Link>
          </Button>

          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Secure Checkout</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Complete Your Purchase
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              You&apos;re just one step away from accessing your digital
              article. Complete the payment to get instant access.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Article Details Card */}
            <Card className="overflow-hidden border-0 bg-card/50 shadow-xl backdrop-blur-sm">
              <CardHeader className="border-b border-border/50 bg-primary/5 pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5 text-primary" />
                  Article Details
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Article Cover and Basic Info */}
                  <div className="flex gap-4">
                    <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded-lg shadow-lg">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="line-clamp-2 text-xl font-semibold text-foreground">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          By EZZ Freedom & Hope
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-3 w-3 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Digital Article
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Article Description */}
                  {article.description && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">
                        Description
                      </h4>
                      <p className="line-clamp-4 text-sm text-muted-foreground">
                        {article.description}
                      </p>
                    </div>
                  )}

                  {/* Purchase Details */}
                  <div className="space-y-3 rounded-lg bg-primary/5 p-4">
                    <h4 className="text-sm font-medium text-primary">
                      What You&apos;ll Get
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Download className="h-3 w-3 text-primary" />
                        <span>Instant digital download</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-3 w-3 text-primary" />
                        <span>PDF format for all devices</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-3 w-3 text-primary" />
                        <span>Lifetime access guarantee</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="space-y-3 rounded-lg border border-primary/20 bg-background p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Article Price:
                      </span>
                      <span className="text-sm font-medium">
                        KES {article.price}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Processing Fee:
                      </span>
                      <span className="text-sm font-medium">Free</span>
                    </div>
                    <div className="border-t border-border/50 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">
                          Total Amount:
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary"
                          >
                            KES {article.price}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Publication Info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Published {new Date(article.publishDate).getFullYear()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>Digital Article</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <div className="space-y-6">
              <CheckOutForm
                user={user}
                item={{
                  id: article.id,
                  price: article.price,
                  title: article.title,
                }}
                type="article"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleCheckOut;
