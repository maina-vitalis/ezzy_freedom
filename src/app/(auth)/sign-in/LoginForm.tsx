"use client";

import LoadingButton from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, loginValues } from "@/util/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

function LoginForm() {
  const [error, setError] = useState<string>();
  const [loading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const form = useForm<loginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
      email: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: loginValues) {
    setError(undefined);
    await signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
      callbackURL: decodeURIComponent(callbackUrl),

      fetchOptions: {
        onResponse: () => {
          setIsLoading(false);
        },
        onRequest: () => {
          setIsLoading(true);
        },

        onError: (context) => {
          toast.error(context.error.message);
        },

        onSuccess: () => {
          router.push("/");
        },
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
        {error && <p className="text-center text-destructive">{error}</p>}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="username" type="email" />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} placeholder="Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between pt-3">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-2 space-y-0.5">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Remember me</FormLabel>
              </FormItem>
            )}
          />

          <Link href={"/forget-password"} className="text-sm hover:underline">
            Forgot password?
          </Link>
        </div>

        <LoadingButton loading={loading} className="w-full">
          Login
        </LoadingButton>
      </form>
    </Form>
  );
}

export default LoginForm;
