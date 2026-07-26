"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  BarChart3,
  BookOpen,
  Calendar,
  DollarSign,
  FileText,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Import the table components
import ArticlesManagementTable from "./(article)/ArticlesManagementTable";
import BooksManagementTable from "./(book)/BooksManagementTable";
import ServicesManagementTable from "./(service)/ServicesManagementTable";

const fetchDashboardData = async () => {
  const [booksRes, articlesRes, servicesRes, appointmentsRes] =
    await Promise.all([
      fetch("/api/books"),
      fetch("/api/articles"),
      fetch("/api/services"),
      fetch("/api/appointments"),
    ]);

  const [booksData, articlesData, servicesData, appointmentsData] =
    await Promise.all([
      booksRes.json(),
      articlesRes.json(),
      servicesRes.json(),
      appointmentsRes.json(),
    ]);

  return {
    books: Array.isArray(booksData) ? booksData : booksData?.data || [],
    articles: Array.isArray(articlesData)
      ? articlesData
      : articlesData?.data || [],
    services: Array.isArray(servicesData)
      ? servicesData
      : servicesData?.data || [],
    appointments: Array.isArray(appointmentsData)
      ? appointmentsData
      : appointmentsData?.data || [],
  };
};

const fetchTransactionStats = async () => {
  const response = await fetch("/api/transactions?includeStats=true&limit=1");
  if (!response.ok) {
    throw new Error("Failed to fetch transaction stats");
  }
  const data = await response.json();
  return data.stats;
};

export default function AdminDashboardView() {
  const [activeTab, setActiveTab] = useState("books");

  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    refetch,
  } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: fetchDashboardData,
    refetchInterval: 30000,
  });

  const { data: transactionStats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["transaction-stats"],
    queryFn: fetchTransactionStats,
    refetchInterval: 30000,
  });

  const isLoading = isDashboardLoading || isStatsLoading;

  const stats = {
    totalBooks: dashboardData?.books?.length || 0,
    totalArticles: dashboardData?.articles?.length || 0,
    totalServices: dashboardData?.services?.length || 0,
    totalAppointments: dashboardData?.appointments?.length || 0,
    pendingAppointments: Array.isArray(dashboardData?.appointments)
      ? dashboardData.appointments.filter(
          (apt: { status: string }) => apt.status === "PENDING",
        ).length
      : 0,
    approvedAppointments: Array.isArray(dashboardData?.appointments)
      ? dashboardData.appointments.filter(
          (apt: { status: string }) => apt.status === "APPROVED",
        ).length
      : 0,
    totalRevenue: transactionStats?.totalRevenue || 0,
    completedTransactions: transactionStats?.completedTransactions || 0,
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          <span className="text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Comprehensive overview of platform performance, sales, and content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
            <Activity className="mr-1 h-3 w-3" />
            Live Data
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              KES {stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.completedTransactions} completed transactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Items</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalBooks + stats.totalArticles}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalBooks} books, {stats.totalArticles} articles
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingAppointments} pending, {stats.approvedAppointments}{" "}
              approved
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServices}</div>
            <p className="text-xs text-muted-foreground">
              Active service offerings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Quick Management Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild className="h-auto flex-col gap-2 p-4">
              <Link href="/dashboard/create-books">
                <BookOpen className="h-6 w-6" />
                <span>Add New Book</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
            >
              <Link href="/dashboard/create-article">
                <FileText className="h-6 w-6" />
                <span>Add New Article</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
            >
              <Link href="/dashboard/create-service">
                <Users className="h-6 w-6" />
                <span>Add New Service</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
            >
              <Link href="/dashboard/transactions">
                <BarChart3 className="h-6 w-6" />
                <span>Transactions & Analytics</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Management Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="books" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Books ({stats.totalBooks})
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Articles ({stats.totalArticles})
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Services ({stats.totalServices})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="books" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Books Management
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage your digital book collection
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link
                    href="/dashboard/create-books"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Book
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <BooksManagementTable data={dashboardData?.books || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Articles Management
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage your digital article collection
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link
                    href="/dashboard/create-article"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Article
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ArticlesManagementTable data={dashboardData?.articles || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Services Management
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage your service offerings
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link
                    href="/dashboard/create-service"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Service
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ServicesManagementTable data={dashboardData?.services || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
