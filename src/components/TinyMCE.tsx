import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinyMCEProps {
  value: string;
  onChange: (content: string) => void;
}

const TinyMCE: React.FC<TinyMCEProps> = ({ value, onChange }) => {
  const editorRef = useRef<Editor | null>(null);

  return (
    <div className="">
      <Editor
        apiKey="sfvyeotaq4ey9mcd1lju6ts0eil7i61yo8johznft527c1l1"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onInit={(_evt, editor: any) => (editorRef.current = editor)}
        value={value} // ✅ Bind value from the form
        onEditorChange={onChange} // ✅ Update form state on change
        init={{
          height: 300,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "preview",
            "visualblocks",
            "code",
            "fullscreen",
            "code",
            "help",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }",
        }}
      />
    </div>
  );
};

export default TinyMCE;
