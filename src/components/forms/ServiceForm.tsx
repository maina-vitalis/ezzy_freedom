/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { ServiceSchema, ServiceTypes } from "@/util/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import TinyMCE from "../TinyMCE";
import { Label } from "../ui/label";
import Image from "next/image";
import { UploadDropzone } from "@/util/uploadthing";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Service } from "@/generated/prisma/client";
import LoadingButton from "../LoadingButton";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface ServiceFormProps {
  service?: Service;
  method: "create" | "update";
}

function ServiceForm({ method, service }: ServiceFormProps) {
  const [coverImage, setCoverImage] = useState(service?.image || undefined);

  const form = useForm<ServiceTypes>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: service || {
      bannerText: "",
      description: "",
      image: "",
      name: "",
      overview: "",
    },
  });

  function handleReset() {
    form.reset();
    setCoverImage(undefined);
  }

  async function handleUploadImage(files: any) {
    form.setValue("image", files[0].url);
    setCoverImage(files[0].url);
  }

  //mutation api call
  const mutation = useMutation({
    mutationFn: async (data: ServiceTypes) => {
      if (method === "create") {
        return await axios.post("/api/services", data);
      }

      if (method === "update") {
        return await axios.put(`/api/services/${service?.id}`, data);
      }
    },

    onSuccess: () => {
      toast.success("success");
    },

    onError: (error) => {
      toast.error(error.message || "something went wrong");
    },
  });

  //submit func
  function onSubmitForm(data: ServiceTypes) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)}>
        <div className="flex flex-col md:flex-row md:gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bannerText"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Banner text <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="19-60 years" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="overview"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                Overview<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
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

        <div className="mb-5 flex-1">
          <Label>Cover image</Label>

          <div className="relative min-h-36 flex-1">
            {coverImage && (
              <Image
                src={coverImage}
                alt="cover image"
                fill
                className="mt-2 w-full object-cover"
              />
            )}
          </div>

          <UploadDropzone
            endpoint={"serviceImage"}
            onClientUploadComplete={handleUploadImage}
            onUploadError={(error) => console.error("Upload failed:", error)}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <LoadingButton
            loading={mutation.isPending}
            type="submit"
            className="w-full rounded-full"
          >
            Submit service
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
  );
}

export default ServiceForm;
