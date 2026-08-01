/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LoadingButton from "@/components/LoadingButton";
import R2Upload from "@/components/R2Upload";
import TinyMCE from "@/components/TinyMCE";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/generated/prisma/client";
import {
  BlogPostSchema,
  BlogPostType,
  blogCategories,
} from "@/util/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type BlogFormProps = {
  post?: BlogPost | null;
  method: "create" | "update";
};

export default function BlogForm({ post, method }: BlogFormProps) {
  const router = useRouter();
  const [heroPreview, setHeroPreview] = useState(post?.heroImage || "");

  const form = useForm<BlogPostType>({
    resolver: zodResolver(BlogPostSchema) as any,
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      heroImage: post?.heroImage || "",
      category: post?.category || blogCategories[0],
      tags: post?.tags?.join(", ") || "",
      authorName: post?.authorName || "Clr. Ezra Karanja",
      status: post?.status || "DRAFT",
      publishedAt: post?.publishedAt || null,
      metaTitle: post?.metaTitle || "",
      metaDescription: post?.metaDescription || "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: BlogPostType) => {
      if (method === "create") {
        return axios.post("/api/blogs", data);
      }
      if (!post?.id) throw new Error("Missing blog post id");
      return axios.put(`/api/blogs/${post.id}`, data);
    },
    onSuccess: () => {
      toast.success(
        method === "create" ? "Blog post created" : "Blog post updated",
      );
      router.push("/dashboard/blog");
      router.refresh();
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : null;
      toast.error(message || `Failed to ${method} blog post`);
    },
  });

  return (
    <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutate(data))}
          className="space-y-8"
        >
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Post details
            </h2>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="A clear, compelling headline"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL slug</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="auto-from-title"
                      />
                    </FormControl>
                    <FormDescription>
                      Leave blank to generate from the title.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Category <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {blogCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Excerpt <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="One or two sentences that appear on listing cards and social previews."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="authorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Author <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Author name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="hope, recovery, mindfulness"
                      />
                    </FormControl>
                    <FormDescription>Comma-separated.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Hero image
            </h2>
            <FormField
              control={form.control}
              name="heroImage"
              render={() => (
                <FormItem>
                  <FormLabel>
                    Main image <span className="text-destructive">*</span>
                  </FormLabel>
                  {heroPreview ? (
                    <div className="relative mt-2 aspect-[21/9] w-full overflow-hidden rounded-md border border-border">
                      <Image
                        src={heroPreview}
                        alt="Hero preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : null}
                  <R2Upload
                    folder="blogs/heroes"
                    accept="image/*"
                    label="Upload hero image"
                    publicAsset
                    onUploaded={({ publicUrl }) => {
                      if (!publicUrl) {
                        toast.error("R2_PUBLIC_URL is not configured");
                        return;
                      }
                      form.setValue("heroImage", publicUrl, {
                        shouldValidate: true,
                      });
                      setHeroPreview(publicUrl);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Content
            </h2>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Body <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <TinyMCE
                      value={field.value}
                      onChange={field.onChange}
                      height={480}
                      enableImageUpload
                    />
                  </FormControl>
                  <FormDescription>
                    Use the image button to upload inline images to R2.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Publishing
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publishedAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Publish date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Auto on publish</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              SEO (optional)
            </h2>
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Defaults to post title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      rows={2}
                      placeholder="Defaults to excerpt"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <div className="flex flex-col gap-3 md:flex-row">
            <LoadingButton
              loading={isPending}
              type="submit"
              className="w-full rounded-full px-6"
            >
              {method === "create" ? "Create post" : "Save changes"}
            </LoadingButton>
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full px-6"
              onClick={() => router.push("/dashboard/blog")}
            >
              Back to posts
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
