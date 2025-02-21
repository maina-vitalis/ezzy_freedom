"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import LoadingButton from "../LoadingButton";

const passwordUpdateForm = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    passwordConfirm: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

type PasswordUpdateType = z.infer<typeof passwordUpdateForm>;

function PasswordUpdate() {
  const form = useForm<PasswordUpdateType>({
    resolver: zodResolver(passwordUpdateForm),
    defaultValues: {
      oldPassword: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = (data: PasswordUpdateType) => {
    console.log("Password Updated:", data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full flex flex-col"
      >
        <h2 className="md:text-2xl font-semibold text-xl ">Password Update</h2>
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          loading={false}
          type="submit"
          className="self-end rounded-full hover:shadow-lg"
        >
          Update Password
        </LoadingButton>
      </form>
    </Form>
  );
}

export default PasswordUpdate;
