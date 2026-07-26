/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { BookSchema, BookTypes } from "@/util/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import TinyMCE from "../TinyMCE";
import { Textarea } from "../ui/textarea";
import R2Upload from "@/components/R2Upload";
import { Label } from "../ui/label";
import { useState } from "react";
import LoadingButton from "../LoadingButton";
import { Button } from "../ui/button";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { Books } from "@/generated/prisma/client";

interface AddBookFormProps {
  book?: Books;
  method: string;
}

function BookForm({ book, method }: AddBookFormProps) {
  const [coverImage, setCoverImage] = useState(book?.coverImage || undefined);
  const [bookName, setBookName] = useState(
    book?.r2Key ? book.r2Key.split("/").pop() : undefined,
  );

  const form = useForm<BookTypes>({
    resolver: zodResolver(BookSchema),
    defaultValues: {
      additionalInfo: book?.additionalInfo || "",
      coverImage: book?.coverImage || "",
      downloadUrl: "",
      highlights: book?.highlights || "",
      bookOverview: book?.bookOverview || "",
      price: book?.price || 0,
      targetAudience: book?.targetAudience || "",
      title: book?.title || "",
      fileKey: book?.r2Key || book?.fileKey || "",
      r2Key: book?.r2Key || "",
    },
  });

  function handleReset() {
    form.reset({
      additionalInfo: "",
      coverImage: "",
      downloadUrl: "",
      highlights: "",
      bookOverview: "",
      price: 0,
      targetAudience: "",
      title: "",
      fileKey: "",
      r2Key: "",
    });
    setCoverImage(undefined);
    setBookName(undefined);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async (bookData: BookTypes) => {
      if (method === "create") {
        return await axios.post("/api/books", bookData);
      }

      if (method === "update") {
        return await axios.put(`/api/books/${book?.id}`, bookData);
      }
    },
    onSuccess: () => {
      toast.success("success");
      if (method === "create") handleReset();
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong when updating the book",
      );
    },
  });

  function onSubmit(data: BookTypes) {
    mutate(data);
  }

  const hasPdf = Boolean(form.watch("r2Key"));

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Title <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="The coiled viper" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Price <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : e.target.valueAsNumber,
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      placeholder="3000"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Target Audience <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      placeholder="target audience"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="highlights"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Highlights <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <TinyMCE value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bookOverview"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Book overview <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Additional Info <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="The author and the author's inspiration to write the book"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-5 md:flex-row">
            <div className="flex-1 space-y-2">
              <Label>
                Book PDF <span className="text-destructive">*</span>
              </Label>
              {hasPdf ? (
                <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
                  <p className="font-semibold">
                    PDF on R2
                    {bookName ? `: ${bookName}` : ""}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Upload a new file below to replace it. Old UploadThing links
                    are not used.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-amber-600">
                  No PDF on Cloudflare yet — upload one to enable downloads.
                </p>
              )}
              <R2Upload
                folder="books/pdfs"
                accept="application/pdf,.pdf"
                label="Upload PDF to R2"
                onUploaded={({ key, name }) => {
                  form.setValue("r2Key", key, { shouldValidate: true });
                  form.setValue("fileKey", key);
                  form.setValue("downloadUrl", "");
                  setBookName(name);
                }}
              />
              <FormField
                control={form.control}
                name="r2Key"
                render={() => <FormMessage />}
              />
            </div>

            <div className="flex-1 space-y-2">
              <Label>
                Cover image <span className="text-destructive">*</span>
              </Label>
              {coverImage && (
                <div className="relative min-h-36 flex-1">
                  <Image
                    src={coverImage}
                    alt="cover image"
                    fill
                    className="mt-2 w-full object-cover"
                    unoptimized
                  />
                </div>
              )}
              <R2Upload
                folder="books/covers"
                accept="image/*"
                label="Upload cover to R2"
                publicAsset
                onUploaded={({ publicUrl }) => {
                  if (!publicUrl) {
                    toast.error("R2_PUBLIC_URL is not configured");
                    return;
                  }
                  form.setValue("coverImage", publicUrl, {
                    shouldValidate: true,
                  });
                  setCoverImage(publicUrl);
                }}
              />
              <FormField
                control={form.control}
                name="coverImage"
                render={() => <FormMessage />}
              />
            </div>
          </div>

          <div className="flex flex-col gap-5 md:flex-row">
            <LoadingButton
              loading={isPending}
              type="submit"
              className="w-full rounded-full"
            >
              Submit book
            </LoadingButton>

            <Button
              type="button"
              variant={"outline"}
              className="w-full rounded-full"
              onClick={handleReset}
            >
              Reset form
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default BookForm;
