import { useCallback, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import styles from './styles.module.css';

interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export const TextEditor = ({ content, onChange }: TextEditorProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    //Tiptap Error: SSR has been detected, please set `immediatelyRender` explicitly to `false` to avoid hydration mismatches.
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: 'Start typing...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    editable: true,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => {
      setIsFocused(false);
    },
  });

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor?.chain().focus().toggleUnderline().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={`${styles['editor-wrapper']} ${isFocused ? styles.focused : ''}`}
    >
      <div className={styles.toolbar}>
        <button
          type="button"
          onClick={toggleBold}
          className={`${styles['toolbar-button']} ${editor.isActive('bold') ? styles.active : ''}`}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={toggleItalic}
          className={`${styles['toolbar-button']} ${editor.isActive('italic') ? styles.active : ''}`}
          title="Italic"
        >
          /
        </button>
        <button
          type="button"
          onClick={toggleUnderline}
          className={`${styles['toolbar-button']} ${editor.isActive('underline') ? styles.active : ''}`}
          title="Underline"
        >
          U
        </button>
      </div>

      <div className={styles['editor-content']}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
