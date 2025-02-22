import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { resend } from "../components/Email/resend";
import { ezzyResetPasswordEmail } from "@/components/Email/rest-password";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await resend.emails.send({
        from: "TumainiFitnessCentre<no-reply@tumainifitness.co.ke>",
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
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
