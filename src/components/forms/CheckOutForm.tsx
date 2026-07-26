/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { sendStkPush } from "@/util/mpesaActions/stkPush";
import { stkPushQuery } from "@/util/mpesaActions/stkPushQuery";
import { checkOutSchema, CheckOutTypes } from "@/util/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  CircleAlert,
  CircleCheck,
  CreditCard,
  DollarSign,
  Mail,
  Phone,
  Shield,
  Smartphone,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import LoadingButton from "../LoadingButton";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface CheckOutFormProps {
  user: { id: string; email: string; name: string };
  item: { id: string; price: number; title?: string };
  type: "article" | "book";
}

function CheckOutForm({ user, item, type }: CheckOutFormProps) {
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
      toast.success("Payment confirmed! Redirecting to your library...");
      router.replace("/dashboard/library");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: CheckOutTypes) => {
    // Include additional parameters for transaction tracking
    const paymentData = {
      ...data,
      userId: user.id,
      itemType: type,
      itemId: item.id,
      itemTitle: item.title || `${type} purchase`,
    };
    sendPayment(paymentData);
  };

  const handleConfirmPayment = () => {
    confirmPayment();
  };

  return (
    <div className="space-y-6">
      {/* Payment Security Badge */}
      <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary">
        <Shield className="h-4 w-4" />
        <span className="font-medium">Secure Payment with M-Pesa</span>
      </div>

      <Card className="border-0 bg-card/50 shadow-lg backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment Details
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete your payment to access your {type}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <User className="h-4 w-4" />
                  Personal Information
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            className="h-11 border-border/50 bg-background/50 transition-colors focus:border-primary focus:bg-background"
                            placeholder="Enter your full name"
                          />
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
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            className="h-11 border-border/50 bg-background/50 transition-colors focus:border-primary focus:bg-background"
                            placeholder="Enter your email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Payment Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Smartphone className="h-4 w-4" />
                  Payment Information
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          M-Pesa Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="2547XXXXXXXX"
                            {...field}
                            className="h-11 border-border/50 bg-background/50 transition-colors focus:border-primary focus:bg-background"
                          />
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
                        <FormLabel className="flex items-center gap-2">
                          <DollarSign className="h-3 w-3" />
                          Amount (KES)
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              disabled
                              className="h-11 border-border/50 bg-muted/30 pr-12 font-semibold text-primary"
                            />
                            <Badge
                              variant="secondary"
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary/10 text-primary"
                            >
                              KES
                            </Badge>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-2">
                {!checkoutRequestID ? (
                  <LoadingButton
                    type="submit"
                    loading={isPaymentPending}
                    className="h-12 w-full rounded-lg bg-primary font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl"
                    disabled={!!checkoutRequestID}
                  >
                    <Smartphone className="mr-2 h-4 w-4" />
                    Send Payment Request
                  </LoadingButton>
                ) : (
                  <div className="space-y-4">
                    {/* Payment Status Card */}
                    <Card className="border-primary/20 bg-primary/5">
                      <CardContent className="flex items-center gap-3 p-4">
                        <div className="rounded-full bg-primary/20 p-2">
                          <CircleAlert className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-primary">
                            Payment Request Sent
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Check your phone and complete the M-Pesa payment
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <LoadingButton
                      loading={isConfirmPending}
                      className="h-12 w-full rounded-lg bg-green-600 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-green-700 hover:shadow-xl"
                      onClick={handleConfirmPayment}
                      type="button"
                    >
                      <CircleCheck className="mr-2 h-4 w-4" />
                      Confirm Payment
                    </LoadingButton>
                  </div>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <Card className="border-dashed border-primary/30 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/20 p-1.5">
              <Smartphone className="h-3 w-3 text-primary" />
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-medium text-primary">Payment Instructions:</p>
              <ol className="space-y-0.5 text-muted-foreground">
                <li>
                  1. Click &quot;Send Payment Request&quot; to initiate M-Pesa
                  payment
                </li>
                <li>2. Check your phone for M-Pesa STK push notification</li>
                <li>3. Enter your M-Pesa PIN to complete the payment</li>
                <li>
                  4. Click &quot;Confirm Payment&quot; to verify and complete
                  the purchase
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CheckOutForm;
