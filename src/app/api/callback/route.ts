import prisma from "@/lib/prisma";
import { updateTransactionFromCallback } from "@/lib/transactions";
import { TransactionStatus, TransactionType } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Handle M-Pesa Callback
export async function POST(req: NextRequest) {
  try {
    const callbackData = await req.json();
    console.log("🔔 M-Pesa Callback Data:", callbackData);

    // Validate request
    if (!callbackData.Body || !callbackData.Body.stkCallback) {
      return NextResponse.json(
        { message: "Invalid callback data" },
        { status: 400 },
      );
    }

    const stkCallback = callbackData.Body.stkCallback;
    const { CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

    // Determine transaction status based on result code
    let status: TransactionStatus;
    let mpesaReceiptNumber: string | undefined;
    let mpesaTransactionId: string | undefined;
    let transactionDate: Date | undefined;
    let failureReason: string | undefined;

    if (ResultCode === 0) {
      // Payment successful
      status = TransactionStatus.COMPLETED;

      // Extract M-Pesa details from callback items
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];

      for (const item of callbackMetadata) {
        switch (item.Name) {
          case "MpesaReceiptNumber":
            mpesaReceiptNumber = item.Value;
            break;
          case "TransactionDate": {
            // Convert M-Pesa timestamp to Date
            const timestamp = item.Value.toString();
            transactionDate = new Date(
              `${timestamp.slice(0, 4)}-${timestamp.slice(4, 6)}-${timestamp.slice(6, 8)} ` +
                `${timestamp.slice(8, 10)}:${timestamp.slice(10, 12)}:${timestamp.slice(12, 14)}`,
            );
            break;
          }
          case "MpesaTransactionId":
            mpesaTransactionId = item.Value;
            break;
        }
      }
    } else {
      // Payment failed
      status = TransactionStatus.FAILED;
      failureReason = ResultDesc;
    }

    // Update transaction record
    const updateResult = await updateTransactionFromCallback({
      checkoutRequestId: CheckoutRequestID,
      mpesaReceiptNumber,
      mpesaTransactionId,
      transactionDate,
      status,
      failureReason,
      notes: `M-Pesa callback processed. Result: ${ResultDesc}`,
    });

    if (updateResult.success && updateResult.data) {
      console.log("✅ Transaction updated successfully:", updateResult.data.id);

      // ── Grant library access on successful payment ─────────────────────────
      // Create a UserPurchase record so the user can access their content
      // (books in the in-app reader; articles via download).
      if (status === TransactionStatus.COMPLETED) {
        const tx = updateResult.data;
        try {
          if (
            tx.itemType === TransactionType.BOOK &&
            tx.bookId &&
            tx.userId
          ) {
            await prisma.userPurchase.upsert({
              where: { userId_bookId: { userId: tx.userId, bookId: tx.bookId } },
              create: {
                userId: tx.userId,
                itemType: TransactionType.BOOK,
                bookId: tx.bookId,
              },
              update: {}, // idempotent – do nothing if already exists
            });
            console.log(`📚 Library access granted: userId=${tx.userId}, bookId=${tx.bookId}`);
          } else if (
            tx.itemType === TransactionType.ARTICLE &&
            tx.articleId &&
            tx.userId
          ) {
            await prisma.userPurchase.upsert({
              where: { userId_articleId: { userId: tx.userId, articleId: tx.articleId } },
              create: {
                userId: tx.userId,
                itemType: TransactionType.ARTICLE,
                articleId: tx.articleId,
              },
              update: {},
            });
            console.log(`📄 Library access granted: userId=${tx.userId}, articleId=${tx.articleId}`);
          }
        } catch (purchaseError) {
          // Log but don't fail the callback response – Safaricom expects 200
          console.error("❌ Failed to create UserPurchase:", purchaseError);
        }
      }
    } else {
      console.error("❌ Failed to update transaction:", updateResult.error);
    }

    return NextResponse.json({
      success: true,
      message: "Callback processed successfully",
    });
  } catch (error) {
    console.log("❌ Error handling callback:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
