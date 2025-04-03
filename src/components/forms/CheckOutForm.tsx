/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
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
import { sendStkPush } from "@/util/mpesaActions/stkPush";
import { stkPushQuery } from "@/util/mpesaActions/stkPushQuery";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { sendBook } from "@/app/(main)/book-checkout/actions/sendBook";
import { sendArticle } from "@/app/(main)/article-checkout/actions/sendArticle";

interface CheckOutFormProps {
  user: { email: string; name: string };
  item: { id: string; price: number; title?: string };
  type: "article" | "book";
}

function CheckOutForm({ user, item, type }: CheckOutFormProps) {
  const [stkLoading, setStkLoading] = useState<boolean>(false);
  const [checkoutRequestID, setCheckoutRequestID] = useState<string | null>(
    null,
  );
  const router = useRouter();

  const form = useForm<CheckOutTypes>({
    resolver: zodResolver(checkOutSchema),
    defaultValues: {
      amount: item.price,
      email: user.email,
      name: user.name,
      phoneNumber: "",
    },
  });

  // sends the stk push notification
  const { mutate: sendPayment, isPending: isPaymentPending } = useMutation({
    mutationFn: sendStkPush,
    onSuccess: (data) => {
      const requestID = data?.data?.CheckoutRequestID;
      if (requestID) {
        setCheckoutRequestID(requestID);
        toast.success(
          "Payment request sent. Please check your phone and confirm payment.",
        );
      } else {
        toast.error("Payment request failed. Please try again.");
      }
    },
    onError: (error) => {
      toast.error("Failed to initiate payment. Please try again.");
      console.error(error);
    },
  });

  const { mutate: confirmPayment, isPending: isConfirmPending } = useMutation({
    mutationFn: async () => {
      if (!checkoutRequestID) {
        throw new Error(
          "No payment request found. Please initiate payment first.",
        );
      }

      const { data, error } = await stkPushQuery(checkoutRequestID);

      if (error) {
        throw new Error(
          (error as any).response?.data?.errorMessage ||
            "Payment verification failed",
        );
      }

      if (data?.ResultCode !== "0") {
        setCheckoutRequestID(null);
        throw new Error(data?.ResultDesc || "Payment was not successful");
      }

      return data;
    },

    onSuccess: async () => {
      setStkLoading(false);
      toast.success("Payment confirmed successfully");

      if (type === "article") {
        await sendArticle(item.id);
        router.replace(`/download`);
      } else {
        await sendBook(item.id);
        router.replace(`/download`);
      }
    },
    onError: (error) => {
      setStkLoading(false);
      toast.error(error.message);
    },
  });

  const onSubmit = (data: CheckOutTypes) => {
    setStkLoading(true);
    sendPayment(data);
  };

  const handleConfirmPayment = () => {
    confirmPayment();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
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
                <Input type="email" {...field} />
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
                <Input placeholder="2547XXXXXXXX" {...field} />
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
              <FormLabel>Amount (KES)</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2 md:flex-row">
          <LoadingButton
            type="submit"
            loading={isPaymentPending || stkLoading}
            className="w-full"
            disabled={!!checkoutRequestID}
          >
            Send Payment Request
          </LoadingButton>

          <LoadingButton
            loading={isConfirmPending}
            className="w-full"
            onClick={handleConfirmPayment}
            type={"button"}
            disabled={!checkoutRequestID}
          >
            Confirm Payment
          </LoadingButton>
        </div>

        {checkoutRequestID && (
          <p className="text-center text-sm text-muted-foreground">
            Please complete the payment on your phone and then click
            &#34;Confirm Payment&#34;
          </p>
        )}
      </form>
    </Form>
  );
}

export default CheckOutForm;
