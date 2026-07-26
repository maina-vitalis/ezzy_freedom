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
import { Article } from "@/generated/prisma/client";
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
  article?: Article | null;
  method: "create" | "update";
}

export default function ArticleForm({ article, method }: ArticleFormProps) {
  const [imageUrl, setImageUrl] = useState(article?.coverImage || "");
  const [pdfName, setPdfName] = useState(
    article?.r2Key ? article.r2Key.split("/").pop() : undefined,
  );

  const form = useForm<ArticleType>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      title: article?.title || "",
      coverImage: article?.coverImage || "",
      downloadUrl: "",
      publishDate: article?.publishDate || new Date(),
      description: article?.description || "",
      price: article?.price || 0,
      r2Key: article?.r2Key || "",
    },
  });

  const handleReset = () => {
    form.reset({
      title: "",
      coverImage: "",
      downloadUrl: "",
      publishDate: new Date(),
      description: "",
      price: 0,
      r2Key: "",
    });
    setImageUrl("");
    setPdfName(undefined);
  };

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
      if (method === "create") handleReset();
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(
        error.response?.data?.message || `Failed to ${method} article`,
      );
    },
  });

  const onSubmit = (data: ArticleType) => {
    mutate(data);
  };

  const hasPdf = Boolean(form.watch("r2Key"));

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-background p-6 shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    placeholder="e.g 1000"
                    className="w-full"
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex-1 space-y-2">
              <Label>
                Article PDF <span className="text-destructive">*</span>
              </Label>
              {hasPdf ? (
                <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
                  <p className="font-semibold">
                    PDF on R2{pdfName ? `: ${pdfName}` : ""}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-amber-600">
                  No PDF on Cloudflare yet — upload one to enable downloads.
                </p>
              )}
              <R2Upload
                folder="articles/pdfs"
                accept="application/pdf,.pdf"
                label="Upload PDF to R2"
                onUploaded={({ key, name }) => {
                  form.setValue("r2Key", key, { shouldValidate: true });
                  form.setValue("downloadUrl", "");
                  setPdfName(name);
                }}
              />
              <FormField
                control={form.control}
                name="r2Key"
                render={() => <FormMessage />}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>
                Article Image <span className="text-destructive">*</span>
              </FormLabel>
              {imageUrl && (
                <div className="relative mt-2 h-48 w-full">
                  <Image
                    src={imageUrl}
                    alt="Article image"
                    fill
                    className="rounded-md object-cover"
                    unoptimized
                  />
                </div>
              )}
              <R2Upload
                folder="articles/covers"
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
                  setImageUrl(publicUrl);
                }}
              />
              <FormField
                control={form.control}
                name="coverImage"
                render={() => <FormMessage />}
              />
            </div>
          </div>

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
