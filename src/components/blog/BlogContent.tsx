import { cn } from "@/lib/utils";

type BlogContentProps = {
  html: string;
  className?: string;
};

/** Renders sanitized-looking blog HTML with readable typography. */
export default function BlogContent({ html, className }: BlogContentProps) {
  return (
    <div
      className={cn(
        "blog-content custom-html-content max-w-none text-base leading-relaxed text-foreground",
        "[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold",
        "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold",
        "[&_p]:mb-5 [&_p]:leading-relaxed",
        "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6",
        "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_li]:mb-2",
        "[&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline",
        "[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
        "[&_img]:my-8 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-md",
        "[&_figure]:my-8",
        "[&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-muted-foreground",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
