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
import { UploadDropzone } from "@/util/uploadthing";
import { Label } from "../ui/label";
import { useState } from "react";
import LoadingButton from "../LoadingButton";
import { Button } from "../ui/button";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { Books } from "@prisma/client";

interface AddBookFormProps {
  book?: Books;
  method: string;
}

function BookForm({ book, method }: AddBookFormProps) {
  const [coverImage, setCoverImage] = useState(book?.coverImage || undefined);
  const [bookName, setBookName] = useState(`${book?.title} pdf` || undefined);
  // const [isPending, startTransition] = useTransition();

  const form = useForm<BookTypes>({
    resolver: zodResolver(BookSchema),
    defaultValues: {
      additionalInfo: book?.additionalInfo || "",
      coverImage: book?.coverImage || "",
      downloadUrl: book?.downLoadUrl || "",
      highlights: book?.highlights || "",
      bookOverview: book?.bookOverview || "",
      price: book?.price || 0,
      targetAudience: book?.targetAudience || "",
      title: book?.title || "",
      fileKey: book?.fileKey || "",
    },
  });

  //handle reset
  function handleReset() {
    form.reset();
    setCoverImage(undefined);
    setBookName(undefined);
  }

  async function handleUploadPdf(files: any) {
    form.setValue("downloadUrl", files[0].url);
    form.setValue("fileKey", files[0].key);
    setBookName(files[0].name);
  }

  async function handleUploadImage(files: any) {
    form.setValue("coverImage", files[0].url);
    setCoverImage(files[0].url);
  }

  //mutation
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
      handleReset();
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong when updating the book",
      );
    },
  });

  //submit function
  function onSubmit(data: BookTypes) {
    mutate(data);
  }

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
                    <Input type="number" {...field} placeholder="3000" />
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
            <div className="flex-1">
              <Label>Book Upload</Label>
              {bookName ? (
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
              ) : (
                <UploadDropzone
                  endpoint={"bookUpload"}
                  onClientUploadComplete={handleUploadPdf}
                  onUploadError={(error) =>
                    console.error("Upload failed:", error)
                  }
                />
              )}
            </div>

            <div className="flex-1">
              <Label>Cover image</Label>
              {coverImage ? (
                <div className="relative min-h-36 flex-1">
                  <Image
                    src={coverImage}
                    alt="cover image"
                    fill
                    className="mt-2 w-full object-cover"
                  />
                </div>
              ) : (
                <UploadDropzone
                  endpoint={"coverImage"}
                  onClientUploadComplete={handleUploadImage}
                  onUploadError={(error) =>
                    console.error("Upload failed:", error)
                  }
                />
              )}
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
