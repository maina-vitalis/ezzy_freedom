"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import {
  CalendarIcon,
  CircleCheck,
  Clock,
  Eye,
  Filter,
  MoreHorizontal,
  Trash2,
  User,
  CircleX,
} from "lucide-react";
import { useState } from "react";

import LoadingButton from "@/components/LoadingButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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

interface User {
  id: string;
  name: string;
  email: string;
}

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
  user: User;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  APPROVED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  CANCELLED: "bg-gray-100 text-gray-800 border-gray-200",
  COMPLETED: "bg-primary/10 text-primary border-primary/20",
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

export default function AdminAppointmentsView() {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "ALL">(
    "ALL",
  );
  const [notes, setNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: async () => {
      const response = await axios.get("/api/appointments");
      return response.data.data as Appointment[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      appointmentId,
      status,
      notes,
    }: {
      appointmentId: string;
      status: AppointmentStatus;
      notes?: string;
    }) => {
      return await axios.put(`/api/appointments/${appointmentId}`, {
        status,
        notes,
      });
    },
    onSuccess: () => {
      toast.success("Appointment status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      setIsDialogOpen(false);
      setNotes("");
      setSelectedAppointment(null);
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      toast.error(
        apiError.response?.data?.message || "Failed to update appointment",
      );
    },
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: async (appointmentId: string) => {
      return await axios.delete(`/api/appointments/${appointmentId}`);
    },
    onSuccess: () => {
      toast.success("Appointment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      toast.error(
        apiError.response?.data?.message || "Failed to delete appointment",
      );
    },
  });

  const handleStatusUpdate = (status: AppointmentStatus) => {
    if (selectedAppointment) {
      updateStatusMutation.mutate({
        appointmentId: selectedAppointment.id,
        status,
        notes,
      });
    }
  };

  const handleDelete = (appointmentId: string) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      deleteAppointmentMutation.mutate(appointmentId);
    }
  };

  const filteredAppointments =
    appointments?.filter(
      (appointment) =>
        statusFilter === "ALL" || appointment.status === statusFilter,
    ) || [];

  const getStatusCounts = (): Record<AppointmentStatus, number> => {
    if (!appointments) return {} as Record<AppointmentStatus, number>;
    return appointments.reduce(
      (acc, appointment) => {
        acc[appointment.status] = (acc[appointment.status] || 0) + 1;
        return acc;
      },
      {} as Record<AppointmentStatus, number>,
    );
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="container mx-auto max-w-7xl p-2 md:p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-primary">
          Appointment Management
        </h1>
        <p className="text-muted-foreground">
          Manage and track all patient appointments
        </p>
      </div>

      {/* Status Overview Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        <Card
          className="cursor-pointer transition-shadow hover:shadow-md"
          onClick={() => setStatusFilter("ALL")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">
              {appointments?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        {(
          ["PENDING", "APPROVED", "REJECTED", "CANCELLED", "COMPLETED"] as const
        ).map((status) => (
          <Card
            key={status}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => setStatusFilter(status)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {statusCounts[status] || 0}
              </div>
              <div className="text-sm text-muted-foreground">{status}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Controls */}
      <div className="mb-4 flex items-center gap-2">
        <Filter className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Filter by status:</span>
        <Badge
          variant={statusFilter === "ALL" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setStatusFilter("ALL")}
        >
          All ({appointments?.length || 0})
        </Badge>
        {(["PENDING", "APPROVED", "REJECTED"] as const).map((status) => (
          <Badge
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setStatusFilter(status)}
          >
            {status} ({statusCounts[status] || 0})
          </Badge>
        ))}
      </div>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Appointments {statusFilter !== "ALL" && `(${statusFilter})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="py-8 text-center">
              <CalendarIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                No appointments found
              </h3>
              <p className="text-muted-foreground">
                {statusFilter === "ALL"
                  ? "No appointments have been scheduled yet."
                  : `No ${statusFilter.toLowerCase()} appointments found.`}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <div>
                          <div className="font-medium">
                            {appointment.user.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{appointment.title}</div>
                      {appointment.description && (
                        <div className="max-w-xs truncate text-sm text-muted-foreground">
                          {appointment.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {typeLabels[appointment.type]}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        {format(new Date(appointment.date), "MMM dd, yyyy")}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {appointment.timeSlot}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[appointment.status]}
                      >
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {format(
                          new Date(appointment.createdAt),
                          "MMM dd, hh:mm a",
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setNotes(appointment.notes || "");
                              setIsDialogOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {appointment.status === "PENDING" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  handleStatusUpdate("APPROVED");
                                }}
                                className="text-green-600"
                              >
                                <CircleCheck className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setIsDialogOpen(true);
                                }}
                                className="text-red-600"
                              >
                                <CircleX className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(appointment.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Patient</Label>
                <div className="text-sm">{selectedAppointment.user.name}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedAppointment.user.email}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Title</Label>
                <div className="text-sm">{selectedAppointment.title}</div>
              </div>

              <div>
                <Label className="text-sm font-medium">Type</Label>
                <div className="text-sm">
                  {typeLabels[selectedAppointment.type]}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Date & Time</Label>
                <div className="text-sm">
                  {format(new Date(selectedAppointment.date), "PPP")} at{" "}
                  {selectedAppointment.timeSlot}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Current Status</Label>
                <Badge className={statusColors[selectedAppointment.status]}>
                  {selectedAppointment.status}
                </Badge>
              </div>

              {selectedAppointment.description && (
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <div className="text-sm">
                    {selectedAppointment.description}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="notes" className="text-sm font-medium">
                  Admin Notes
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes for this appointment..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                {selectedAppointment.status === "PENDING" && (
                  <>
                    <LoadingButton
                      onClick={() => handleStatusUpdate("APPROVED")}
                      loading={updateStatusMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CircleCheck className="mr-2 h-4 w-4" />
                      Approve
                    </LoadingButton>
                    <LoadingButton
                      onClick={() => handleStatusUpdate("REJECTED")}
                      loading={updateStatusMutation.isPending}
                      variant="destructive"
                      className="flex-1"
                    >
                      <CircleX className="mr-2 h-4 w-4" />
                      Reject
                    </LoadingButton>
                  </>
                )}

                {selectedAppointment.status === "APPROVED" && (
                  <LoadingButton
                    onClick={() => handleStatusUpdate("COMPLETED")}
                    loading={updateStatusMutation.isPending}
                    className="flex-1"
                  >
                    Mark as Completed
                  </LoadingButton>
                )}

                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
