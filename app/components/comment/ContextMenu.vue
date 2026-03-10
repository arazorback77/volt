<template>
  <Teleport to="body">
    <div
      v-if="show"
      ref="menuRef"
      class="fixed z-50 bg-default border border-default rounded-lg shadow-lg py-2 min-w-44"
      :style="{ left: `${x}px`, top: `${y}px` }"
    >
      <!-- 색상 선택 -->
      <div class="px-3 pb-2 flex items-center gap-1.5">
        <span class="text-xs text-muted mr-1">색상</span>
        <button
          v-for="(val, key) in HIGHLIGHT_COLORS"
          :key="key"
          class="size-5 rounded-full border-2 transition-transform hover:scale-110"
          :class="selectedColor === key ? 'border-primary scale-110' : 'border-transparent'"
          :style="{ backgroundColor: val.bg }"
          :title="val.label"
          @mousedown.prevent="emit('update:selected-color', key as HighlightColor)"
        />
      </div>
      <div class="border-t border-default my-1" />
      <!-- Highlight only -->
      <button
        class="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-elevated transition-colors text-left"
        @click="emit('highlight')"
      >
        <UIcon name="i-lucide-highlighter" class="size-4 text-primary" />
        Highlight
      </button>
      <!-- Add Comment -->
      <button
        class="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-elevated transition-colors text-left"
        @click="emit('add-comment')"
      >
        <UIcon name="i-lucide-message-square-plus" class="size-4 text-primary" />
        Add Comment
      </button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { HIGHLIGHT_COLORS, type HighlightColor } from "~/composables/useDocComment";

const props = defineProps<{
  show: boolean;
  x: number;
  y: number;
  selectedColor: HighlightColor;
}>();

const emit = defineEmits<{
  highlight: [];
  "add-comment": [];
  close: [];
  "update:selected-color": [color: HighlightColor];
}>();

const menuRef = ref<HTMLElement | null>(null);

function handleOutsideClick(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    emit("close");
  }
}

watch(
  () => props.show,
  (val) => {
    if (val) {
      setTimeout(
        () => document.addEventListener("mousedown", handleOutsideClick),
        0
      );
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
  }
);

onUnmounted(() => {
  document.removeEventListener("mousedown", handleOutsideClick);
});
</script>
