"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  AppointmentBookingSchema,
  AppointmentBookingType,
  appointmentTypes,
  timeSlots,
} from "@/util/validation";
import { toast } from "sonner";

interface AppointmentBookingFormProps {
  onSuccess?: () => void;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function AppointmentBookingForm({
  onSuccess,
}: AppointmentBookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();

  const form = useForm<AppointmentBookingType>({
    resolver: zodResolver(AppointmentBookingSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      timeSlot: "",
      type: "CONSULTATION",
    },
  });

  const { mutate: bookAppointment, isPending } = useMutation({
    mutationFn: async (data: AppointmentBookingType) => {
      return await axios.post("/api/appointments", data);
    },
    onSuccess: () => {
      toast.success(
        "Appointment booked successfully! We will contact you soon.",
      );
      form.reset();
      setSelectedDate(undefined);
      onSuccess?.();
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message =
        apiError.response?.data?.message || "Failed to book appointment";
      toast.error(message);
    },
  });

  const onSubmit = (data: AppointmentBookingType) => {
    bookAppointment(data);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      form.setValue("date", format(date, "yyyy-MM-dd"));
    }
  };

  // Disable past dates and weekends
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = date.getDay();
    return date < today || dayOfWeek === 0 || dayOfWeek === 6; // Disable Sundays (0) and Saturdays (6)
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary">Book an Appointment</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Schedule your session with our professional team
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Appointment Title *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Brief description of your session"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Appointment Type *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {appointmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={() => (
              <FormItem className="flex flex-col">
                <FormLabel>Preferred Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={isDateDisabled}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeSlot"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Time *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Information</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please share any additional details or concerns..."
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton type="submit" loading={isPending} className="w-full">
            Book Appointment
          </LoadingButton>
        </form>
      </Form>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          * Your appointment will be pending until confirmed by our team.
          <br />
          We will contact you within 24 hours to confirm your booking.
        </p>
      </div>
    </div>
  );
}
