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
  price: z.coerce.number({
    required_error: "A tour price is required",
    invalid_type_error: "Must be a valid number",
  }),
  highlights: requiredString,
  additionalInfo: requiredString,
  targetAudience: requiredString,
  downloadUrl: requiredString,
  title: requiredString,
  bookOverview: requiredString,
  fileKey: z.string(),
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
  downloadUrl: requiredString,
  publishMonth: requiredString,
  description: requiredString,
  price: z.coerce.number({
    required_error: "A tour price is required",
    invalid_type_error: "Must be a valid number",
  }),
});
export type ArticleType = z.infer<typeof ArticleSchema>;
