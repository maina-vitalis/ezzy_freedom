import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { resend } from "../components/Email/resend";
import { ezzyResetPasswordEmail } from "@/components/Email/reset-password";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await resend.emails.send({
        from: "EzzFreedomAndHope<no-reply@ezzyfreedomandhope.org>",
        to: user.email,
        subject: "Reset your password",
        react: ezzyResetPasswordEmail({
          username: user.email,
          resetLink: url,
        }),
      });
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
