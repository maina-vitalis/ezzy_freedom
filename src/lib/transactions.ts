import prisma from "@/lib/prisma";
import { TransactionStatus, TransactionType } from "@prisma/client";

export interface CreateTransactionData {
  userId: string;
  phoneNumber: string;
  amount: number;
  itemType: TransactionType;
  itemId: string;
  itemTitle: string;
  customerName: string;
  customerEmail: string;
  checkoutRequestId?: string;
  merchantRequestId?: string;
}

export interface UpdateTransactionData {
  checkoutRequestId: string;
  mpesaReceiptNumber?: string;
  mpesaTransactionId?: string;
  transactionDate?: Date;
  status: TransactionStatus;
  failureReason?: string;
  notes?: string;
}

// Create a new transaction record
export async function createTransaction(data: CreateTransactionData) {
  try {
    const transaction = await prisma.transaction.create({
      data: {
        userId: data.userId,
        phoneNumber: data.phoneNumber,
        amount: data.amount,
        itemType: data.itemType,
        itemId: data.itemId,
        itemTitle: data.itemTitle,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        checkoutRequestId: data.checkoutRequestId,
        merchantRequestId: data.merchantRequestId,
        status: TransactionStatus.PENDING,
        paymentMethod: "MPESA",
        // Set book or article relation based on type
        ...(data.itemType === TransactionType.BOOK && { bookId: data.itemId }),
        ...(data.itemType === TransactionType.ARTICLE && {
          articleId: data.itemId,
        }),
      },
      include: {
        user: true,
        book: true,
        article: true,
      },
    });

    return { success: true, data: transaction };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, error: "Failed to create transaction" };
  }
}

// Update transaction with M-Pesa callback data
export async function updateTransactionFromCallback(
  data: UpdateTransactionData,
) {
  try {
    const transaction = await prisma.transaction.update({
      where: {
        checkoutRequestId: data.checkoutRequestId,
      },
      data: {
        mpesaReceiptNumber: data.mpesaReceiptNumber,
        mpesaTransactionId: data.mpesaTransactionId,
        transactionDate: data.transactionDate,
        status: data.status,
        failureReason: data.failureReason,
        notes: data.notes,
        updatedAt: new Date(),
      },
      include: {
        user: true,
        book: true,
        article: true,
      },
    });

    return { success: true, data: transaction };
  } catch (error) {
    console.error("Error updating transaction:", error);
    return { success: false, error: "Failed to update transaction" };
  }
}

// Get transaction by checkout request ID
export async function getTransactionByCheckoutId(checkoutRequestId: string) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: {
        checkoutRequestId,
      },
      include: {
        user: true,
        book: true,
        article: true,
      },
    });

    return { success: true, data: transaction };
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return { success: false, error: "Failed to fetch transaction" };
  }
}

// Get all transactions with pagination and filters
export async function getTransactions({
  page = 1,
  limit = 10,
  status,
  itemType,
  userId,
  dateFrom,
  dateTo,
}: {
  page?: number;
  limit?: number;
  status?: TransactionStatus;
  itemType?: TransactionType;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
} = {}) {
  try {
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status }),
      ...(itemType && { itemType }),
      ...(userId && { userId }),
      ...(dateFrom || dateTo
        ? {
            createdAt: {
              ...(dateFrom && { gte: dateFrom }),
              ...(dateTo && { lte: dateTo }),
            },
          }
        : {}),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              price: true,
            },
          },
          article: {
            select: {
              id: true,
              title: true,
              price: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      success: true,
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { success: false, error: "Failed to fetch transactions" };
  }
}

// Get transaction statistics
export async function getTransactionStats() {
  try {
    const [
      totalTransactions,
      completedTransactions,
      pendingTransactions,
      failedTransactions,
      totalRevenue,
      bookSales,
      articleSales,
    ] = await Promise.all([
      prisma.transaction.count(),
      prisma.transaction.count({
        where: { status: TransactionStatus.COMPLETED },
      }),
      prisma.transaction.count({
        where: { status: TransactionStatus.PENDING },
      }),
      prisma.transaction.count({ where: { status: TransactionStatus.FAILED } }),
      prisma.transaction.aggregate({
        where: { status: TransactionStatus.COMPLETED },
        _sum: { amount: true },
      }),
      prisma.transaction.count({
        where: {
          status: TransactionStatus.COMPLETED,
          itemType: TransactionType.BOOK,
        },
      }),
      prisma.transaction.count({
        where: {
          status: TransactionStatus.COMPLETED,
          itemType: TransactionType.ARTICLE,
        },
      }),
    ]);

    return {
      success: true,
      data: {
        totalTransactions,
        completedTransactions,
        pendingTransactions,
        failedTransactions,
        totalRevenue: totalRevenue._sum.amount || 0,
        bookSales,
        articleSales,
      },
    };
  } catch (error) {
    console.error("Error fetching transaction stats:", error);
    return { success: false, error: "Failed to fetch transaction stats" };
  }
}
