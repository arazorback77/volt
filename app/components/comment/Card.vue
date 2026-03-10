<template>
  <div
    class="flex flex-col gap-2 p-3 rounded-lg border transition-colors"
    :class="cardClass"
  >
    <!-- ── Highlight-only card ── -->
    <template v-if="comment.type === 'highlight'">
      <div class="flex items-start gap-2">
        <span
          class="mt-0.5 size-3 rounded-full flex-none"
          :style="{ backgroundColor: highlightBg }"
        />
        <span class="text-xs italic text-muted line-clamp-3">"{{ comment.selected_text }}"</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-xs text-muted">{{ formattedDate }}</span>
        <UButton size="xs" color="error" variant="ghost" icon="i-lucide-trash-2" :loading="loading" @click="handleDelete" />
      </div>
    </template>

    <!-- ── Comment card ── -->
    <template v-else>
      <!-- Selected text -->
      <div class="text-xs text-muted italic line-clamp-2 border-l-2 border-primary/40 pl-2">
        "{{ comment.selected_text }}"
      </div>

      <!-- Edit mode -->
      <template v-if="editing">
        <UTextarea v-model="editBody" :rows="3" class="text-sm" />
        <div class="flex justify-end gap-2">
          <UButton size="xs" color="neutral" variant="ghost" @click="editing = false">취소</UButton>
          <UButton size="xs" color="primary" :loading="loading" @click="handleUpdate">저장</UButton>
        </div>
      </template>

      <!-- View mode -->
      <template v-else>
        <p class="text-sm whitespace-pre-wrap">{{ comment.body }}</p>

        <!-- Status badge -->
        <div class="flex items-center justify-between">
          <UBadge :color="statusColor" variant="soft" size="xs">
            {{ statusLabel }}
          </UBadge>
          <span class="text-xs text-muted">{{ formattedDate }}</span>
        </div>

        <!-- Actions -->
        <div class="flex gap-1 flex-wrap">
          <!-- draft 상태 -->
          <template v-if="comment.status === 'draft'">
            <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-pencil" @click="startEdit">수정</UButton>
            <UButton size="xs" color="error" variant="ghost" icon="i-lucide-trash-2" :loading="loading" @click="handleDelete">삭제</UButton>
            <UButton size="xs" color="primary" variant="soft" icon="i-lucide-send" :loading="loading" @click="handlePublish">게시 요청</UButton>
          </template>

          <!-- pending 상태 (작성자 뷰: 게시 취소) -->
          <template v-else-if="comment.status === 'pending' && authorView">
            <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-x" :loading="loading" @click="handleCancelPublish">게시 취소</UButton>
          </template>

          <!-- pending 상태 (승인자 뷰: 승인/반려) -->
          <template v-else-if="comment.status === 'pending'">
            <UButton size="xs" color="success" variant="soft" icon="i-lucide-check" :loading="loading" @click="handleApprove">승인</UButton>
            <UButton size="xs" color="error" variant="ghost" icon="i-lucide-x" :loading="loading" @click="handleReject">반려</UButton>
          </template>

          <!-- approved / rejected 상태: 초안과 동일한 버튼 -->
          <template v-else-if="comment.status === 'approved' || comment.status === 'rejected'">
            <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-pencil" @click="startEdit">수정</UButton>
            <UButton size="xs" color="error" variant="ghost" icon="i-lucide-trash-2" :loading="loading" @click="handleDelete">삭제</UButton>
            <UButton size="xs" color="primary" variant="soft" icon="i-lucide-send" :loading="loading" @click="handlePublish">게시 요청</UButton>
          </template>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { HIGHLIGHT_COLORS } from "~/composables/useDocComment";
import type { DocComment } from "~/composables/useDocComment";

const props = defineProps<{
  comment: DocComment;
  loading?: boolean;
  authorView?: boolean;
}>();

const emit = defineEmits<{
  update: [id: string, body: string];
  publish: [id: string];
  "cancel-publish": [id: string];
  delete: [id: string];
  approve: [id: string];
  reject: [id: string];
}>();

const editing = ref(false);
const editBody = ref(props.comment.body);

function startEdit() {
  editBody.value = props.comment.body;
  editing.value = true;
}

function handleUpdate() {
  emit("update", props.comment.id, editBody.value);
  editing.value = false;
}

function handlePublish() { emit("publish", props.comment.id); }
function handleCancelPublish() { emit("cancel-publish", props.comment.id); }
function handleDelete() { emit("delete", props.comment.id); }
function handleApprove() { emit("approve", props.comment.id); }
function handleReject() { emit("reject", props.comment.id); }

const highlightBg = computed(() =>
  HIGHLIGHT_COLORS[props.comment.highlight_color]?.bg ?? HIGHLIGHT_COLORS.yellow.bg
);

const statusLabel = computed(() => {
  const map: Record<string, string> = {
    draft: "초안",
    pending: "승인 대기",
    approved: "승인됨",
    rejected: "반려됨",
  };
  return map[props.comment.status] ?? props.comment.status;
});

const statusColor = computed(() => {
  const map: Record<string, string> = {
    draft: "neutral",
    pending: "warning",
    approved: "success",
    rejected: "error",
  };
  return (map[props.comment.status] ?? "neutral") as "neutral" | "warning" | "success" | "error";
});

const cardClass = computed(() => {
  if (props.comment.type === "highlight") return "border-default bg-default";
  const map: Record<string, string> = {
    draft: "border-default bg-default",
    pending: "border-warning/30 bg-warning/5",
    approved: "border-success/30 bg-success/5",
    rejected: "border-error/30 bg-error/5 opacity-60",
  };
  return map[props.comment.status] ?? "border-default";
});

const formattedDate = computed(() => {
  return new Date(props.comment.created_at).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});
</script>
