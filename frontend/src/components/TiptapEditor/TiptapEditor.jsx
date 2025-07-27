import  { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import "./TiptapEditor.css";

// eslint-disable-next-line react/prop-types
const TiptapEditor = ({ value, onChange }) => {
  const [editorLoaded, setEditorLoaded] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "Ürün açıklamasını buraya yazın...",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value]);

  if (!editorLoaded || !editor) return <div>Yükleniyor...</div>;

  return (
    <div className="tiptap-container">
      <div className="tiptap-toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <b>B</b>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <i>I</i>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "is-active" : ""}
        >
          <u>U</u>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          • Liste
        </button>
        <button
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          Temizle
        </button>
      </div>
      <EditorContent editor={editor} className="tiptap-editor" />
    </div>
  );
};

export default TiptapEditor;
