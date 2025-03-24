import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react"; // Icons relevant to articles
import { Button } from "./ui/button";

interface ArticleComponentProps {
  article: {
    id: string;
    title: string;
    coverImage: string;
    downloadUrl: string;
    publishMonth: string;
    description: string;
    slug: string;
    price: number;
  };
}

function ArticleComponent({ article }: ArticleComponentProps) {
  return (
    <div>
      <Link
        href={`/article-details/${article.slug}`} // Using slug for URL
        className="border-greenPrimary group grid h-[30%] gap-5 rounded-xl border-[1px] p-3 md:grid-cols-[2fr_3fr]"
      >
        {/* Left Side: Image */}
        <div className="sm:min-h-auto relative min-h-44">
          <Image
            src={article.coverImage}
            alt={`${article.title} cover image`}
            className="rounded-xl object-cover"
            fill
          />
        </div>

        {/* Right Side: Text and Button */}
        <div className="flex flex-col items-stretch justify-center gap-1">
          <div className="flex flex-col gap-1">
            <div className="flex flex-col justify-between gap-1 sm:gap-0 md:flex-row">
              <div className="basis-[80%] space-y-2">
                {/* Article Name */}
                <h3 className="place-content-end place-self-start text-sm font-semibold capitalize text-primary md:text-lg">
                  {article.title}
                </h3>

                {/* Publish Month */}
                <span className="mt-2 flex gap-1">
                  <Calendar size={15} />
                  <p className="text-xs font-semibold capitalize text-primary">
                    Published: {article.publishMonth}
                  </p>
                </span>

                {/* Price */}
                <span className="mt-2 flex gap-1">
                  <p className="text-sm font-semibold capitalize">
                    {article.price === 0 ? "Free" : `Ksh ${article.price}`}
                  </p>
                </span>

                {/* Description */}
                <p
                  className="mb-2 line-clamp-3 text-xs capitalize"
                  dangerouslySetInnerHTML={{ __html: article.description }}
                ></p>
              </div>
            </div>

            {/* Button */}
            <Button variant={"outline"} className="w-full bg-muted">
              More Details
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ArticleComponent;
