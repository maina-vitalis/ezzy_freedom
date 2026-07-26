import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserAvatar from "@/components/UserAvatar";
import { BookOpen, Calendar, Library, Sparkles, User as UserIcon } from "lucide-react";
import Link from "next/link";

interface UserDashboardViewProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export default function UserDashboardView({ user }: UserDashboardViewProps) {
  return (
    <div className="space-y-8 py-2">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary to-primary/80 p-8 text-primary-foreground shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <UserAvatar imageUrl={user.image ?? undefined} className="size-16 border-2 border-white/30" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold capitalize">Welcome back, {user.name}!</h1>
                <Sparkles className="h-5 w-5 text-yellow-300" />
              </div>
              <p className="text-sm opacity-90">{user.email}</p>
            </div>
          </div>
          <Button asChild variant="secondary" className="rounded-full font-semibold shadow-sm">
            <Link href="/dashboard/profile">
              <UserIcon className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </div>

      {/* Navigation Quick Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">My Library</CardTitle>
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Library className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Access your purchased books, articles, and secure digital downloads anytime.
            </p>
            <Button asChild className="w-full rounded-full">
              <Link href="/dashboard/library">Open Library</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Appointments</CardTitle>
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Book a consultation, therapy session, or manage your scheduled appointments.
            </p>
            <Button asChild className="w-full rounded-full" variant="outline">
              <Link href="/dashboard/appointments">View Appointments</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Browse Resources</CardTitle>
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Explore our full collection of books, articles, and therapy service offerings.
            </p>
            <Button asChild className="w-full rounded-full" variant="outline">
              <Link href="/books">Explore Store</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
