"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import LoadingButton from "../LoadingButton";

interface UserProps {
  user: {
    username: string;
    email: string;
  };
}

function UserDetailsForm({ user }: UserProps) {
  const personalDataSchema = z.object({
    username: z.string().min(1, "cant update blank field"),
    email: z
      .string()
      .min(1, "cant update blank field")
      .email("enter a valid email"),
  });

  type personalDataType = z.infer<typeof personalDataSchema>;

  const form = useForm<personalDataType>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
    },
  });

  //function to update the data
  function onSubmit(data: personalDataType) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <h2 className="md:text-2xl font-semibold text-xl mb-4 ">
          User Details
        </h2>

        <div className="w-full flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" {...field} className="py-0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} className="py-0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <LoadingButton className="mt-5 self-end rounded-full" loading={false}>
          Save Changes
        </LoadingButton>
      </form>
    </Form>
  );
}

export default UserDetailsForm;
