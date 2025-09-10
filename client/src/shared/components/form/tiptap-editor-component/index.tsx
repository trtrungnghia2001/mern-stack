import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./tiptap.css";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo2,
  Redo2,
  Code,
  Code2,
} from "lucide-react";

interface TiptapEditorComponentProps {
  content: string;
}

const TiptapEditorComponent = ({ content }: TiptapEditorComponentProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
  });

  if (!editor) return null;

  const sizeIcon = 14;

  const toolbar = [
    {
      icon: <Bold size={sizeIcon} />,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      icon: <Italic size={sizeIcon} />,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      icon: <Strikethrough size={sizeIcon} />,
      title: "Strikethrough",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    {
      icon: <Heading2 size={sizeIcon} />,
      title: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <List size={sizeIcon} />,
      title: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered size={sizeIcon} />,
      title: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
    {
      icon: <Quote size={sizeIcon} />,
      title: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
    },
    {
      icon: <Code size={sizeIcon} />,
      title: "Inline Code",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code"),
    },
    {
      icon: <Code2 size={sizeIcon} />,
      title: "Code Block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
    },
    {
      icon: <Minus size={sizeIcon} />,
      title: "Horizontal Rule",
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      icon: <Undo2 size={sizeIcon} />,
      title: "Undo",
      action: () => editor.chain().focus().undo().run(),
    },
    {
      icon: <Redo2 size={sizeIcon} />,
      title: "Redo",
      action: () => editor.chain().focus().redo().run(),
    },
  ];

  return (
    <div className="w-full border rounded-lg p-3 bg-white space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {toolbar.map((item, idx) => (
          <button
            key={idx}
            title={item.title}
            onClick={item.action}
            className={`p-1 rounded hover:bg-gray-200 ${
              item.isActive?.() ? "bg-gray-300" : ""
            }`}
          >
            {item.icon}
          </button>
        ))}
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="tiptap prose max-w-none outline-none focus:outline-none focus:ring-0"
      />
    </div>
  );
};

export default TiptapEditorComponent;
