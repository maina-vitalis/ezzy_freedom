"use server";
import { createTransaction } from "@/lib/transactions";
import { TransactionType } from "@prisma/client";
import axios from "axios";

interface CheckOutData {
  phoneNumber: string;
  name: string;
  amount: number;
  email: string;
  userId: string;
  itemType: "book" | "article";
  itemId: string;
  itemTitle: string;
}

interface StkPushResponse {
  data?: {
    CheckoutRequestID: string;
    CustomerMessage: string;
    MerchantRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
  };
  error?: string;
}

export async function sendStkPush(
  body: CheckOutData,
): Promise<StkPushResponse> {
  const mpesaEnv = process.env.MPESA_ENVIRONMENT;
  const MPESA_BASE_URL =
    mpesaEnv === "live"
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";

  const {
    phoneNumber,
    amount,
    userId,
    itemType,
    itemId,
    itemTitle,
    name,
    email,
  } = body;

  try {
    //create an encoded token
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`,
    ).toString("base64");

    //generate the token
    const resp = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
    );

    const token = resp.data.access_token;

    const cleanedNumber = phoneNumber.replace(/\D/g, "");
    const formattedPhone = `254${cleanedNumber.slice(-9)}`;

    const date = new Date();
    const timestamp =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const password: string = Buffer.from(
      process.env.MPESA_SHORTCODE! + process.env.MPESA_PASSKEY + timestamp,
    ).toString("base64");

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: process.env.MPESA_TRANSACTION_TYPE,
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_TILL_NO,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback`,
        AccountReference: phoneNumber,
        TransactionDesc: "payment",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // Create transaction record if M-Pesa request is successful
    if (response.data.ResponseCode === "0") {
      const transactionResult = await createTransaction({
        userId,
        phoneNumber: formattedPhone,
        amount,
        itemType:
          itemType === "book" ? TransactionType.BOOK : TransactionType.ARTICLE,
        itemId,
        itemTitle,
        customerName: name,
        customerEmail: email,
        checkoutRequestId: response.data.CheckoutRequestID,
        merchantRequestId: response.data.MerchantRequestID,
      });

      if (!transactionResult.success) {
        console.error(
          "Failed to create transaction record:",
          transactionResult.error,
        );
      }
    }

    return { data: response.data };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error.response, "token generation");
    return { error: error.message || "something went wrong" };
  }
}
