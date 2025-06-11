"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { useState } from "react";

import AppointmentBookingForm from "@/components/forms/AppointmentBookingForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AppointmentStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";
type AppointmentType =
  | "CONSULTATION"
  | "THERAPY"
  | "FOLLOW_UP"
  | "COUNSELING"
  | "ADDICTION_SUPPORT"
  | "COUPLES_THERAPY"
  | "TEENAGE_SESSION";

interface Appointment {
  id: string;
  title: string;
  description?: string;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  type: AppointmentType;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  APPROVED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  CANCELLED: "bg-gray-100 text-gray-800 border-gray-200",
  COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
};

const typeLabels = {
  CONSULTATION: "General Consultation",
  THERAPY: "Therapy Session",
  FOLLOW_UP: "Follow-up Session",
  COUNSELING: "Counseling",
  ADDICTION_SUPPORT: "Addiction Support",
  COUPLES_THERAPY: "Couples Therapy",
  TEENAGE_SESSION: "Teenage Session",
};

export default function UserAppointments() {
  const [activeTab, setActiveTab] = useState("book");

  const {
    data: appointments,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-appointments"],
    queryFn: async () => {
      const response = await axios.get("/api/appointments");
      return response.data.data as Appointment[];
    },
  });

  const handleBookingSuccess = () => {
    setActiveTab("appointments");
    refetch();
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-primary">
          My Appointments
        </h1>
        <p className="text-muted-foreground">
          Manage your therapy sessions and consultations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="book">Book New Appointment</TabsTrigger>
          <TabsTrigger value="appointments">My Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <AppointmentBookingForm onSuccess={handleBookingSuccess} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="mt-6">
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : appointments?.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CalendarIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    No appointments yet
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Book your first appointment to get started with your
                    journey.
                  </p>
                  <Button onClick={() => setActiveTab("book")}>
                    Book Your First Appointment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              appointments?.map((appointment: Appointment) => (
                <Card
                  key={appointment.id}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {appointment.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {typeLabels[appointment.type]}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={statusColors[appointment.status]}
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <CalendarIcon className="h-4 w-4" />
                          {format(new Date(appointment.date), "PPP")}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {appointment.timeSlot}
                        </div>
                      </div>

                      {appointment.description && (
                        <>
                          <Separator />
                          <div>
                            <p className="mb-1 text-sm font-medium">
                              Description:
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.description}
                            </p>
                          </div>
                        </>
                      )}

                      {appointment.notes &&
                        appointment.status !== "PENDING" && (
                          <>
                            <Separator />
                            <div>
                              <p className="mb-1 text-sm font-medium">
                                Admin Notes:
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.notes}
                              </p>
                            </div>
                          </>
                        )}

                      <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-muted-foreground">
                          Requested on{" "}
                          {format(new Date(appointment.createdAt), "PPp")}
                        </p>

                        {appointment.status === "PENDING" && (
                          <div className="text-xs font-medium text-orange-600">
                            Awaiting confirmation
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
