import { format } from "date-fns";
import { ArrowRight, Calendar, Star, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { normalizeImageSrc } from "@/lib/image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";

interface ArticleComponentProps {
  article: {
    id: string;
    title: string;
    coverImage: string;
    downloadUrl: string;
    publishDate: Date;
    description: string;
    slug: string;
    price: number;
  };
}

function ArticleComponent({ article }: ArticleComponentProps) {
  return (
    <Card className="group bg-primary/10 overflow-hidden border-0 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
      <div className="grid gap-0 md:grid-cols-[300px_1fr]">
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden md:h-auto">
          <Link href={`/article-details/${article.slug}`}>
            <Image
              src={normalizeImageSrc(article.coverImage)}
              alt={`${article.title} - Mental Health Article`}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              fill
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Price Badge */}
            <div className="absolute top-3 right-3">
              <Badge
                className={`${article.price === 0 ? "bg-green-500" : "bg-primary"} rounded-full text-white shadow-lg backdrop-blur-xs`}
              >
                {article.price === 0 ? "Free" : `KES ${article.price}`}
              </Badge>
            </div>

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <Badge
                variant="secondary"
                className="text-primary rounded-full bg-white/90 backdrop-blur-xs"
              >
                <Tag size={12} className="mr-1" />
                Article
              </Badge>
            </div>
          </Link>
        </div>

        {/* Content Section */}
        <CardContent className="flex flex-col justify-between space-y-4 p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="space-y-3">
              <Link href={`/article-details/${article.slug}`}>
                <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-xl leading-tight font-bold transition-colors duration-300 md:text-2xl">
                  {article.title}
                </h3>
              </Link>

              {/* Metadata */}
              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>
                    Published{" "}
                    {format(new Date(article.publishDate), "MMM yyyy")}
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-current" />
                ))}
                <span className="text-muted-foreground ml-1 text-sm">
                  (4.7)
                </span>
              </div>
            </div>

            {/* Description */}
            <div
              className="text-muted-foreground line-clamp-3 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.description }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="border-primary/30 text-primary text-xs"
              >
                Mental Health
              </Badge>
              <Badge
                variant="outline"
                className="text-primary border-blue-600/30 text-xs"
              >
                Wellness
              </Badge>
              <Badge
                variant="outline"
                className="border-green-600/30 text-xs text-green-600"
              >
                Recovery
              </Badge>
            </div>
          </div>

          {/* Footer */}
          <CardFooter className="p-0 pt-4">
            <Button
              asChild
              className="from-primary to-primary/70 hover:from-primary/80 hover:to-primary/60 w-full rounded-full bg-linear-to-r text-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <Link
                href={`/article-details/${article.slug}`}
                className="flex items-center justify-center gap-2"
              >
                <span className="font-medium">Read Full Article</span>
                <ArrowRight size={16} />
              </Link>
            </Button>
          </CardFooter>
        </CardContent>
      </div>
    </Card>
  );
}

export default ArticleComponent;
