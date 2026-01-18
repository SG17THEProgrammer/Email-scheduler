import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export default function EmailEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <Box
      sx={{
        border: "1px solid #e5e7eb",
        borderRadius: 2,
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
        <Typography sx={{padding:"10px 10px 0px 10px" , color:"grey"}}>Type Your Reply... </Typography>
      {/* Toolbar */}
      <Stack direction="row" spacing={1} p={1} borderBottom="1px solid #eee">
        <IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()}>
          <FormatBoldIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FormatItalicIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <FormatUnderlinedIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <FormatListBulletedIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <FormatListNumberedIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* Editor */}
      <Box sx={{ p: 2, minHeight: 180 }}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
