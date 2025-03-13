"use client";

import React, { useRef, useCallback, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import LoadingButton from "../LoadingButton";
import { checkOutSchema, CheckOutTypes } from "@/util/validation";
import { useMutation } from "@tanstack/react-query";
import { sendStkPush } from "@/app/(main)/checkout/actions/stkPush";
import { stkPushQuery } from "@/app/(main)/checkout/actions/stkPushQuery";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Books } from "@prisma/client";
import { sendBook } from "@/app/(main)/checkout/actions/sendBook";

interface User {
  user: {
    email: string;
    name: string;
  };

  book: Books;
}

function CheckOutForm({ user, book }: User) {
  // const [success, setSuccess] = useState<boolean>(false);
  const [stkLoading, setStkLoading] = useState<boolean>(false);
  const router = useRouter();

  const requestCountRef = useRef(0);
  const queryTimerRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<CheckOutTypes>({
    resolver: zodResolver(checkOutSchema),
    defaultValues: {
      amount: book.price,
      email: user.email,
      name: user.name,
      phoneNumber: "",
    },
  });

  const handleStkPushQuery = useCallback((CheckoutRequestID: string) => {
    requestCountRef.current = 0;
    setStkLoading(true);

    queryTimerRef.current = setInterval(async () => {
      requestCountRef.current += 1;

      if (requestCountRef.current >= 10) {
        clearInterval(queryTimerRef.current!);
        setStkLoading(false);
        // setSuccess(false);
        toast.info("You took too long to pay.");
        return;
      }

      try {
        const { data, error } = await stkPushQuery(CheckoutRequestID);

        if (error) {
          clearInterval(queryTimerRef.current!);
          setStkLoading(false);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((error as any).response?.data?.errorCode !== "500.001.1001") {
            toast.error(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (error as any).response?.data?.errorMessage || "Payment failed.",
            );
          }
          return;
        }

        if (data?.ResultCode === "0") {
          setStkLoading(false);
          clearInterval(queryTimerRef.current!);
          toast.success("payment successful");

          await sendBook(book.id);
          router.replace(`/download`);
        } else {
          clearInterval(queryTimerRef.current!);
          setStkLoading(false);
          toast.info(data?.ResultDesc || "Payment failed.");
        }
      } catch (error1) {
        console.log(error1);
      }
    }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { mutate: sendPayment, isPending } = useMutation({
    mutationFn: sendStkPush,
    onSuccess: (data) => {
      const requestID = data?.data?.CheckoutRequestID;
      if (requestID) {
        handleStkPushQuery(requestID);
      } else {
        toast.error("Payment request failed. Try again.");
      }
    },
  });

  const onSubmit = useCallback(
    (data: CheckOutTypes) => {
      sendPayment(data);
    },
    [sendPayment],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
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
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} className="py-0" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mpesa Phone Number</FormLabel>
              <FormControl>
                <Input {...field} className="py-0" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input {...field} disabled className="py-0" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          loading={isPending || stkLoading}
          className="mt-5 w-full"
        >
          Check out
        </LoadingButton>
      </form>
    </Form>
  );
}

export default CheckOutForm;
