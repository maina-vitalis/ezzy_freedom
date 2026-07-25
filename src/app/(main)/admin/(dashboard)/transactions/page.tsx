"use client";

import {
  Transaction,
  TransactionsTable,
} from "@/components/admin/TransactionsTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  TrendingUp,
  CircleX,
} from "lucide-react";
import { useState } from "react";

interface TransactionStats {
  totalTransactions: number;
  completedTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  totalRevenue: number;
  bookSales: number;
  articleSales: number;
}

interface TransactionsResponse {
  success: boolean;
  data: {
    transactions: Transaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  stats?: TransactionStats;
}

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState<{
    status?: string;
    itemType?: string;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
  }>({});

  // Fetch transactions with filters
  const { data: transactionsData, isLoading } = useQuery<TransactionsResponse>({
    queryKey: ["transactions", page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        includeStats: "true",
        ...Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== undefined),
        ),
      });

      const response = await fetch(`/api/transactions?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const transactions = transactionsData?.data?.transactions || [];
  const pagination = transactionsData?.data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };
  const stats = transactionsData?.stats;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when changing filters
  };

  // Calculate conversion rate
  const conversionRate = stats
    ? stats.totalTransactions > 0
      ? (stats.completedTransactions / stats.totalTransactions) * 100
      : 0
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">
            Monitor and manage all M-Pesa transactions and purchases
          </p>
        </div>
        <Badge variant="outline" className="text-primary">
          Live Data
        </Badge>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                KES {stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                From {stats.completedTransactions} completed transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Success Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {conversionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.completedTransactions} of {stats.totalTransactions}{" "}
                transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.pendingTransactions}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting payment confirmation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <CircleX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.failedTransactions}
              </div>
              <p className="text-xs text-muted-foreground">
                Failed or cancelled payments
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sales Breakdown */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Book Sales</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.bookSales}</div>
              <p className="text-xs text-muted-foreground">
                Digital book purchases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Article Sales
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.articleSales}</div>
              <p className="text-xs text-muted-foreground">
                Digital article purchases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Transactions
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalTransactions}
              </div>
              <p className="text-xs text-muted-foreground">
                All payment attempts
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transactions Table */}
      <TransactionsTable
        data={transactions}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onFiltersChange={handleFiltersChange}
        loading={isLoading}
      />
    </div>
  );
}
