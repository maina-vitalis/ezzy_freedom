/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LoadingButton from "@/components/LoadingButton";
import TinyMCE from "@/components/TinyMCE";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
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
import { cn } from "@/lib/utils";
import { UploadDropzone } from "@/util/uploadthing";
import { ArticleSchema, ArticleType } from "@/util/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "../ui/label";

interface ArticleFormProps {
  article?: (ArticleType & { id?: string }) | null;
  method: "create" | "update";
}

export default function ArticleForm({ article, method }: ArticleFormProps) {
  const [imageUrl, setImageUrl] = useState(article?.coverImage || "");
  const [bookName, setBookName] = useState(article?.downloadUrl);

  const form = useForm<ArticleType>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      title: article?.title || "",
      coverImage: article?.coverImage || "",
      downloadUrl: article?.downloadUrl || "",
      publishDate: article?.publishDate || new Date(),
      description: article?.description || "",
      price: article?.price || 0,
    },
  });

  // Reset form
  const handleReset = () => {
    form.reset();
    setImageUrl("");
  };

  // Handle image upload
  const handleUploadImage = (files: any) => {
    const url = files[0].url;
    form.setValue("coverImage", url);
    setImageUrl(url);
  };

  //handle the pdf
  async function handleUploadPdf(files: any) {
    form.setValue("downloadUrl", files[0].url);
    setBookName(files[0].name);
  }

  // Mutation for creating/updating article
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ArticleType) => {
      if (method === "create") {
        return await axios.post("/api/articles", data);
      }
      if (method === "update" && article?.id) {
        return await axios.put(`/api/articles/${article.id}`, data);
      }
    },
    onSuccess: () => {
      toast.success(
        `${method === "create" ? "Created" : "Updated"} article successfully`,
      );
      handleReset();
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(
        error.response?.data?.message || `Failed to ${method} article`,
      );
    },
  });

  // Submit handler
  const onSubmit = (data: ArticleType) => {
    mutate(data);
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-background p-6 shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Article Name */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Article Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter article title"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Publish Date */}
          <FormField
            control={form.control}
            name="publishDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Publish Date <span className="text-destructive">*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Article price <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g 1000"
                    className="w-full"
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Article Content */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Article Content <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <TinyMCE value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Article Upload */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex-1">
              <Label>Article Upload</Label>
              {bookName && (
                <div>
                  <p className="text-sm font-semibold">
                    You have already uploaded the: {bookName}
                  </p>

                  <i className="text-sm">
                    to upload a new book click on the{" "}
                    <span className="font-bold text-primary">
                      reset form button
                    </span>
                  </i>
                </div>
              )}

              <UploadDropzone
                endpoint={"articleUpload"}
                onClientUploadComplete={handleUploadPdf}
                onUploadError={(error) =>
                  console.error("Upload failed:", error)
                }
              />
            </div>

            {/* image upload */}
            <div>
              <FormLabel>Article Image</FormLabel>
              {imageUrl && (
                <div className="relative mt-2 h-48 w-full">
                  <Image
                    src={imageUrl}
                    alt="Article image"
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              )}
              <UploadDropzone
                endpoint="articleCoverImage"
                onClientUploadComplete={handleUploadImage}
                onUploadError={(error) => {
                  toast.error(`Upload failed: ${error.message}`);
                }}
                className="mt-2"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex w-full flex-col gap-4 md:flex-row">
            <LoadingButton
              loading={isPending}
              type="submit"
              className="w-full rounded-full px-6"
            >
              {method === "create" ? "Create Article" : "Update Article"}
            </LoadingButton>
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full px-6"
              onClick={handleReset}
            >
              Reset Form
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
