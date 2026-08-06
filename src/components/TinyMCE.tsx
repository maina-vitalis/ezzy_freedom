"use client";

import { Editor } from "@tinymce/tinymce-react";
import { memo, useRef } from "react";
import { toast } from "sonner";

type TinyMCEProps = {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  /** When true, enables image insert + upload to R2 (`blogs/content`). */
  enableImageUpload?: boolean;
};

async function uploadImageToR2(file: File): Promise<string> {
  const presignRes = await fetch("/api/r2/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || "image/jpeg",
      folder: "blogs/content",
      public: true,
    }),
  });

  const presign = await presignRes.json();
  if (!presignRes.ok) {
    throw new Error(presign.error || "Failed to get upload URL");
  }

  const putRes = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "image/jpeg" },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error("Upload to Cloudflare R2 failed");
  }

  if (!presign.publicUrl) {
    throw new Error("R2_PUBLIC_URL is not configured");
  }

  return presign.publicUrl as string;
}

function TinyMCEEditor({
  value,
  onChange,
  height = 300,
  enableImageUpload = false,
}: TinyMCEProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  const plugins = [
    "advlist",
    "autolink",
    "lists",
    "link",
    "preview",
    "visualblocks",
    "code",
    "fullscreen",
    "help",
    ...(enableImageUpload ? ["image", "media"] : []),
  ];

  const toolbar = enableImageUpload
    ? "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat | preview code | help"
    : "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help";

  return (
    <div>
      <Editor
        apiKey={
          process.env.NEXT_PUBLIC_TINYMCE_API_KEY ||
          "sfvyeotaq4ey9mcd1lju6ts0eil7i61yo8johznft527c1l1"
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onInit={(_evt, editor: any) => {
          editorRef.current = editor;
        }}
        // ✅ Use initialValue instead of value.
        // `value` makes TinyMCE a fully-controlled input — React re-renders
        // push the value back into the editor on every keystroke, which
        // destroys the cursor position. `initialValue` seeds the content
        // once on mount and then lets TinyMCE own its own internal state.
        initialValue={value}
        onEditorChange={onChange}
        init={{
          height,
          menubar: false,
          plugins,
          toolbar,
          branding: false,
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:15px; line-height:1.6; } img { max-width:100%; height:auto; }",
          ...(enableImageUpload
            ? {
                image_caption: true,
                image_title: true,
                automatic_uploads: true,
                file_picker_types: "image",
                images_upload_handler: async (blobInfo: {
                  blob: () => Blob;
                  filename: () => string;
                }) => {
                  try {
                    const blob = blobInfo.blob();
                    const file = new File(
                      [blob],
                      blobInfo.filename() || `image-${Date.now()}.png`,
                      { type: blob.type || "image/png" },
                    );
                    return await uploadImageToR2(file);
                  } catch (err) {
                    const message =
                      err instanceof Error ? err.message : "Image upload failed";
                    toast.error(message);
                    throw new Error(message);
                  }
                },
              }
            : {}),
        }}
      />
    </div>
  );
}

// Wrap in memo so the editor is not re-mounted when the parent form
// re-renders (e.g. on validation state changes).
export default memo(TinyMCEEditor);
