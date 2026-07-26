import { auth } from "@/lib/auth";
import { getTransactions, getTransactionStats } from "@/lib/transactions";
import { TransactionStatus, TransactionType } from "@/generated/prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") as TransactionStatus | null;
    const itemType = searchParams.get("itemType") as TransactionType | null;
    const userId = searchParams.get("userId") || undefined;
    const dateFrom = searchParams.get("dateFrom")
      ? new Date(searchParams.get("dateFrom")!)
      : undefined;
    const dateTo = searchParams.get("dateTo")
      ? new Date(searchParams.get("dateTo")!)
      : undefined;
    const includeStats = searchParams.get("includeStats") === "true";

    // Fetch transactions
    const transactionsResult = await getTransactions({
      page,
      limit,
      status: status || undefined,
      itemType: itemType || undefined,
      userId,
      dateFrom,
      dateTo,
    });

    if (!transactionsResult.success) {
      return NextResponse.json(
        { error: transactionsResult.error },
        { status: 500 },
      );
    }

    let stats = null;
    if (includeStats) {
      const statsResult = await getTransactionStats();
      if (statsResult.success) {
        stats = statsResult.data;
      }
    }

    return NextResponse.json({
      success: true,
      data: transactionsResult.data,
      stats,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
