"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import LoadingButton from "../LoadingButton";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

function ReachOut() {
  const formSchema = z.object({
    name: z.string().min(1, "A name is required"),
    email: z.string().min(1, "An Email is required"),
    message: z.string().min(10, "A message is required atleast 10 characters"),
  });

  type formTypes = z.infer<typeof formSchema>;

  const form = useForm<formTypes>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const { mutate, isPending } = useMutation<void, unknown, formTypes>({
    mutationFn: async (data: formTypes) => {
      const resp = await axios.post("/api/contact", data);
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Email sent successfully!");
    },
    onError: (error) => {
      toast.error("Failed to send email. Please try again.");
      console.error("Error sending email:", error);
    },
  });

  const onSubmit = (data: formTypes) => {
    mutate(data);
  };
  return (
    <div className="rounded-lg border p-5">
      <h1 className="mb-5 text-2xl font-bold md:text-4xl">Get in Touch</h1>
      <div className="flex flex-col gap-10 md:flex-row">
        <div className="basis-2/3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col gap-5 md:flex-row">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="john maina"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="johnmaina@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                name="message"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Message" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoadingButton loading={isPending} className="w-full">
                Submit
              </LoadingButton>
            </form>
          </Form>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <span className="flex items-center gap-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                <Phone className="text-greenPrimary h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-normal">Drop a Line</p>
                <h4 className="text-sm font-bold">+254 791 672 961</h4>
              </div>
            </span>
            <span className="flex items-center gap-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                <Mail className="text-greenPrimary h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-normal">Email Address</p>
                <h4 className="text-sm font-bold">info@ezzyfoundation.co.ke</h4>
              </div>
            </span>
            <span className="flex items-center gap-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                <MapPin className="text-greenPrimary h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-normal">Visit the office</p>
                <p className="text-sm font-normal">business centre</p>
                <h4 className="text-sm font-bold">Nairobi, Nextgen Mall</h4>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReachOut;
