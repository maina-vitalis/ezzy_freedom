import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  bookUpload: f({
    pdf: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.session || session.user.role === "user")
        throw new UploadThingError("Unauthorized");
      const user = session.user;
      return { user };
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.user.id };
    }),

  //article upload pdf
  articleUpload: f({
    pdf: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.session || session.user.role === "user")
        throw new UploadThingError("Unauthorized");
      const user = session.user;
      return { user };
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.user.id };
    }),

  //article cover image
  articleCoverImage: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.session || session.user.role === "user")
        throw new UploadThingError("Unauthorized");
      const user = session.user;
      return { user };
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.user.id };
    }),

  //upload cover image
  coverImage: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.session || session.user.role === "user")
        throw new UploadThingError("Unauthorized");
      const user = session.user;
      return { user };
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.user.id };
    }),

  serviceImage: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.session || session.user.role === "user")
        throw new UploadThingError("Unauthorized");
      const user = session.user;
      return { user };
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.user.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
