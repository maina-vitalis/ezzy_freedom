import { z } from "zod";
const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9-_]+$/,
    "Only letters numbers, - and _ allowed",
  ),
  password: requiredString
    .min(8, "Must be at least 8 characters")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[\W_]/, "Must contain at least one special character")
    .regex(/^\S*$/, "No spaces allowed"),
});

export type signUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: requiredString.email("Enter a valid email"),
  password: requiredString,
  rememberMe: z.boolean().optional(),
});

export type loginValues = z.infer<typeof loginSchema>;

//checkout form
export const checkOutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email").min(1, "Email is required"),
  phoneNumber: z
    .string()
    .refine((value) => /^[+]?[\d\s()-]{7,15}$/.test(value), {
      message: "Invalid phone number format",
    }),
  amount: z.number(),
});

export type CheckOutTypes = z.infer<typeof checkOutSchema>;

//add book form validation
export const BookSchema = z.object({
  coverImage: requiredString,
  price: z.number({
    error: (issue) =>
      issue.input === undefined
        ? "A tour price is required"
        : "Must be a valid number",
  }),
  highlights: requiredString,
  additionalInfo: requiredString,
  targetAudience: requiredString,
  /** Kept for DB compatibility; PDF access uses r2Key + signed URLs. */
  downloadUrl: z.string(),
  title: requiredString,
  bookOverview: requiredString,
  fileKey: z.string(),
  r2Key: requiredString,
});

export type BookTypes = z.infer<typeof BookSchema>;

//service form validation
export const ServiceSchema = z.object({
  name: requiredString,
  bannerText: requiredString,
  overview: requiredString,
  description: requiredString,
  image: requiredString,
});
export type ServiceTypes = z.infer<typeof ServiceSchema>;

//create article schema
export const ArticleSchema = z.object({
  title: z.string().min(1, "An article name is required"),
  coverImage: requiredString,
  downloadUrl: z.string(),
  publishDate: z.date({
    error: (issue) =>
      issue.input === undefined
        ? "Publish date is required"
        : "Must be a valid date",
  }),
  description: requiredString,
  price: z.number({
    error: (issue) =>
      issue.input === undefined
        ? "A tour price is required"
        : "Must be a valid number",
  }),
  r2Key: requiredString,
});
export type ArticleType = z.infer<typeof ArticleSchema>;

// Appointment validation schemas
export const AppointmentBookingSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  type: z.enum([
    "CONSULTATION",
    "THERAPY",
    "FOLLOW_UP",
    "COUNSELING",
    "ADDICTION_SUPPORT",
    "COUPLES_THERAPY",
    "TEENAGE_SESSION",
  ]),
});

export const AppointmentUpdateSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED", "COMPLETED"]),
  notes: z.string().optional(),
});

export type AppointmentBookingType = z.infer<typeof AppointmentBookingSchema>;
export type AppointmentUpdateType = z.infer<typeof AppointmentUpdateSchema>;

export const appointmentTypes = [
  { value: "CONSULTATION", label: "General Consultation" },
  { value: "THERAPY", label: "Therapy Session" },
  { value: "FOLLOW_UP", label: "Follow-up Session" },
  { value: "COUNSELING", label: "Counseling" },
  { value: "ADDICTION_SUPPORT", label: "Addiction Support" },
  { value: "COUPLES_THERAPY", label: "Couples Therapy" },
  { value: "TEENAGE_SESSION", label: "Teenage Session" },
];

export const timeSlots = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
];
