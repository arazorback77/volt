<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Link.configure({ openOnClick: false }),
    Placeholder.configure({
      placeholder: props.placeholder ?? "댓글을 입력하세요...",
    }),
  ],
  editorProps: {
    attributes: {
      class: "board-editor-content",
    },
  },
  onUpdate({ editor }) {
    emit("update:modelValue", editor.getHTML());
  },
});

// 부모에서 v-model 값이 바뀌면 동기화 (reset용)
watch(
  () => props.modelValue,
  (val) => {
    if (editor.value && val !== editor.value.getHTML()) {
      editor.value.commands.setContent(val ?? "", false);
    }
  }
);

onBeforeUnmount(() => editor.value?.destroy());

type Level = 1 | 2 | 3;

const tools = [
  { icon: "i-lucide-bold", title: "굵게", action: () => editor.value?.chain().focus().toggleBold().run(), isActive: () => editor.value?.isActive("bold") },
  { icon: "i-lucide-italic", title: "기울임", action: () => editor.value?.chain().focus().toggleItalic().run(), isActive: () => editor.value?.isActive("italic") },
  { icon: "i-lucide-strikethrough", title: "취소선", action: () => editor.value?.chain().focus().toggleStrike().run(), isActive: () => editor.value?.isActive("strike") },
  { icon: "i-lucide-code", title: "인라인 코드", action: () => editor.value?.chain().focus().toggleCode().run(), isActive: () => editor.value?.isActive("code") },
  { type: "divider" },
  { icon: "i-lucide-list", title: "목록", action: () => editor.value?.chain().focus().toggleBulletList().run(), isActive: () => editor.value?.isActive("bulletList") },
  { icon: "i-lucide-list-ordered", title: "번호 목록", action: () => editor.value?.chain().focus().toggleOrderedList().run(), isActive: () => editor.value?.isActive("orderedList") },
  { icon: "i-lucide-quote", title: "인용", action: () => editor.value?.chain().focus().toggleBlockquote().run(), isActive: () => editor.value?.isActive("blockquote") },
  { icon: "i-lucide-code-2", title: "코드 블록", action: () => editor.value?.chain().focus().toggleCodeBlock().run(), isActive: () => editor.value?.isActive("codeBlock") },
];
</script>

<template>
  <div class="board-editor rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- 툴바 -->
    <div class="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-wrap">
      <template v-for="(tool, i) in tools" :key="i">
        <div v-if="tool.type === 'divider'" class="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          v-else
          :title="tool.title"
          :class="[
            'p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors',
            tool.isActive?.() ? 'bg-gray-200 dark:bg-gray-700 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400',
          ]"
          type="button"
          @mousedown.prevent="tool.action?.()"
        >
          <UIcon :name="tool.icon!" class="size-3.5" />
        </button>
      </template>
    </div>

    <!-- 에디터 본문 -->
    <EditorContent :editor="editor" />
  </div>
</template>

<style>
.board-editor-content {
  min-height: 80px;
  padding: 8px 12px;
  outline: none;
  font-size: 0.875rem;
  line-height: 1.6;
}

/* Placeholder */
.board-editor-content p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #9ca3af;
  pointer-events: none;
  height: 0;
}

/* 기본 HTML 요소 스타일 */
.board-editor-content p { margin: 0 0 0.4em; }
.board-editor-content p:last-child { margin-bottom: 0; }
.board-editor-content strong { font-weight: 600; }
.board-editor-content em { font-style: italic; }
.board-editor-content s { text-decoration: line-through; }
.board-editor-content code {
  font-family: ui-monospace, monospace;
  font-size: 0.8em;
  background: rgb(0 0 0 / 0.06);
  border-radius: 3px;
  padding: 0.1em 0.3em;
}
.dark .board-editor-content code {
  background: rgb(255 255 255 / 0.1);
}
.board-editor-content pre {
  background: rgb(0 0 0 / 0.06);
  border-radius: 6px;
  padding: 0.6em 1em;
  overflow-x: auto;
  margin: 0.4em 0;
}
.dark .board-editor-content pre {
  background: rgb(255 255 255 / 0.06);
}
.board-editor-content pre code { background: none; padding: 0; }
.board-editor-content ul { list-style: disc; padding-left: 1.4em; margin: 0.4em 0; }
.board-editor-content ol { list-style: decimal; padding-left: 1.4em; margin: 0.4em 0; }
.board-editor-content blockquote {
  border-left: 3px solid #d1d5db;
  padding-left: 0.8em;
  color: #6b7280;
  margin: 0.4em 0;
}
.dark .board-editor-content blockquote { border-color: #4b5563; color: #9ca3af; }
.board-editor-content a { color: #3b82f6; text-decoration: underline; }
</style>
