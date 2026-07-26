"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import LoadingButton from "@/components/LoadingButton";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FaWhatsapp } from "react-icons/fa";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const { mutate, isPending } = useMutation<void, unknown, ContactFormValues>({
    mutationFn: async (data: ContactFormValues) => {
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

  const onSubmit = (data: ContactFormValues) => {
    mutate(data);
  };

  return (
    <div className="mt-3 space-y-8">
      <div className="before: relative left-0 h-[30vh] from-primary to-transparent before:absolute before:top-0 before:z-10 before:h-full before:w-full before:rounded-lg before:bg-primary/50 before:content-[''] md:before:bg-transparent md:before:bg-gradient-to-r md:before:opacity-90">
        <Image
          src={
            "https://35jq5szehk.ufs.sh/f/tNU9RDFz3KoOeQQSklyiu2YH8n5AWxKSMldjts96UrEGeQBy"
          }
          alt="Contact Us"
          fill
          className="rounded-lg object-cover"
        />
        <h1 className="absolute left-[50%] top-[30%] z-10 -translate-x-[50%] text-center text-3xl font-bold text-white">
          Contact Us
        </h1>
      </div>

      <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
        {/* Phone Card */}
        <Card className="flex flex-col items-center p-3 text-center">
          <Phone size={50} className="text-primary" />
          <p className="text-lg font-bold">Phone</p>
          <p className="text-sm">For any assistance, call us directly:</p>
          <a
            href="tel:+254791672961"
            className="text-sm font-medium text-primary underline"
          >
            click here
          </a>
        </Card>

        {/* Email Card */}

        <a href="info@ezzyfreedomandhope.or.ke" className="">
          <Card className="flex flex-col items-center p-3 text-center">
            <Mail size={50} className="text-primary" />
            <p className="text-lg font-bold">Email</p>
            <p className="text-sm">Reach out via email for inquiries:</p>
            <p className="text-sm font-semibold text-primary underline">
              info@ezzyfreedomandhope.or.ke
            </p>
          </Card>
        </a>

        {/* Location Card */}
        <Card className="flex flex-col items-center p-3 text-center">
          <MapPin size={50} className="text-primary" />
          <p className="text-lg font-bold">Visit Us</p>
          <p className="text-sm">Find us at our main office:</p>
          <p className="text-secondary_orange text-sm font-medium">
            NextGen Mall, Mombasa Rd
          </p>
        </Card>

        <Card className="flex flex-col items-center p-3 text-center">
          <FaWhatsapp size={50} className="text-primary" />
          <p className="text-lg font-bold">WhatsApp</p>
          <p className="text-sm">Contact us via WhatsApp</p>
          <a
            href={`https://wa.me/254791672961?text=${encodeURIComponent(
              "Hello, I would like to learn more about Ezzy Foundation services. Please assist me. Thank you!",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-primary underline"
          >
            Click Here
          </a>{" "}
        </Card>
      </div>

      <div className="flex flex-col gap-5 rounded-lg bg-muted p-5 md:flex-row">
        <div className="basis-1/2 space-y-3">
          <h1 className="font-bold text-primary">Get in Touch</h1>
          <h2 className="text-lg font-semibold md:text-xl">
            Feel Free to Reach Out to Us
          </h2>
          <p className="text-sm font-light">
            For any inquiries or assistance, please feel free to reach out to
            us. We are here to help and are committed to providing you with the
            best possible support.
          </p>

          <div className="flex flex-col gap-3 md:pt-5">
            <span className="flex items-center gap-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <Phone className="h-5 w-5 text-background" />
              </div>
              <div>
                <p className="text-sm font-normal">Drop a Line</p>
                <h4 className="text-sm font-bold">+254 791 672 961</h4>
              </div>
            </span>
            <span className="flex items-center gap-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <Mail className="h-5 w-5 text-background" />
              </div>
              <div>
                <p className="text-sm font-normal">Email Address</p>
                <h4 className="text-sm font-bold">
                  info@ezzyfreedomandhope.or.ke
                </h4>
              </div>
            </span>
          </div>
        </div>
        <div className="basis-1/2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Name"
                        {...field}
                        aria-label="Enter your full name"
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
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Email"
                        {...field}
                        aria-label="Enter your email address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="message"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your Message"
                        {...field}
                        aria-label="Enter your message"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <LoadingButton loading={isPending} className="w-full">
                  Submit
                </LoadingButton>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <div>
        <iframe
          className="w-full rounded-lg"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7534802458285!2d36.84146037363157!3d-1.3237711986636689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11be560b5283%3A0x9dacf93424a76a51!2sThe%20Nextgen%20Mall!5e0!3m2!1sen!2ske!4v1741416464759!5m2!1sen!2ske"
          height="450"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
