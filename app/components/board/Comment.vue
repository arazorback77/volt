<script setup lang="ts">
import type { BoardCommentNode, BoardAuthor } from "~/composables/useBoardComment";

const props = defineProps<{
  comment: BoardCommentNode;
  currentUserId: string | null;
  depth?: number;
  getDisplayName: (author: BoardAuthor | null) => string;
  getInitials: (author: BoardAuthor | null) => string;
}>();

const emit = defineEmits<{
  update: [id: string, body: string];
  delete: [id: string];
  reply: [parentId: string, body: string];
}>();

const depth = computed(() => props.depth ?? 0);
const isOwner = computed(() => props.currentUserId === props.comment.author_id);

// ── 수정 ──
const editing = ref(false);
const editBody = ref("");

function startEdit() {
  editBody.value = props.comment.body;
  editing.value = true;
}

const editEmpty = computed(() => {
  const stripped = editBody.value.replace(/<[^>]*>/g, "").trim();
  return stripped.length === 0;
});

function saveEdit() {
  if (editEmpty.value) return;
  emit("update", props.comment.id, editBody.value);
  editing.value = false;
}

// ── 답글 ──
const replying = ref(false);
const replyBody = ref("");

const replyEmpty = computed(() => {
  const stripped = replyBody.value.replace(/<[^>]*>/g, "").trim();
  return stripped.length === 0;
});

function submitReply() {
  if (replyEmpty.value) return;
  emit("reply", props.comment.id, replyBody.value);
  replyBody.value = "";
  replying.value = false;
}

// ── 4줄 ellipsis ──
const bodyRef = ref<HTMLElement | null>(null);
const expanded = ref(false);
const overflows = ref(false);

onMounted(() => {
  nextTick(() => {
    if (bodyRef.value) {
      overflows.value = bodyRef.value.scrollHeight > bodyRef.value.clientHeight + 2;
    }
  });
});

// ── 날짜 ──
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <div :class="['flex gap-3 py-3', depth > 0 ? 'pl-2' : '']">
    <!-- 왼쪽 연결선 (depth > 0) -->
    <div v-if="depth > 0" class="w-px bg-gray-200 dark:bg-gray-700 shrink-0 -ml-4 mr-1" />

    <UAvatar
      :src="comment.author?.avatar_url ?? undefined"
      :alt="getDisplayName(comment.author)"
      :text="getInitials(comment.author)"
      :size="depth > 0 ? 'sm' : 'md'"
      class="shrink-0 mt-0.5"
    />

    <div class="flex-1 min-w-0">
      <!-- 헤더 -->
      <div class="flex items-center gap-2 mb-1 flex-wrap">
        <span class="font-medium text-sm">{{ getDisplayName(comment.author) }}</span>
        <UBadge
          v-if="comment.author?.role === 'admin'"
          label="관리자"
          color="primary"
          variant="soft"
          size="xs"
        />
        <span class="text-xs text-gray-400">{{ formatDate(comment.created_at) }}</span>
      </div>

      <!-- 본문 (수정 모드) -->
      <template v-if="editing">
        <BoardEditor v-model="editBody" class="mb-2" />
        <div class="flex gap-2">
          <UButton size="xs" :disabled="editEmpty" @click="saveEdit">저장</UButton>
          <UButton size="xs" variant="ghost" color="neutral" @click="editing = false">취소</UButton>
        </div>
      </template>

      <!-- 본문 (읽기 모드) -->
      <template v-else>
        <div
          ref="bodyRef"
          :class="[
            'board-comment-body text-sm',
            !expanded ? 'line-clamp-4' : '',
          ]"
          v-html="comment.body"
        />
        <button
          v-if="overflows && !expanded"
          class="text-xs text-primary-500 hover:underline mt-0.5"
          @click="expanded = true"
        >
          더보기
        </button>
        <button
          v-if="overflows && expanded"
          class="text-xs text-gray-400 hover:underline mt-0.5"
          @click="expanded = false"
        >
          접기
        </button>

        <!-- 액션 버튼 -->
        <div class="flex items-center gap-1 mt-1.5">
          <SignedIn>
            <UButton
              size="xs"
              variant="ghost"
              color="neutral"
              icon="i-lucide-corner-down-right"
              @click="replying = !replying"
            >
              답글
            </UButton>
          </SignedIn>
          <template v-if="isOwner">
            <UButton size="xs" variant="ghost" color="neutral" @click="startEdit">수정</UButton>
            <UButton size="xs" variant="ghost" color="error" @click="emit('delete', comment.id)">삭제</UButton>
          </template>
        </div>

        <!-- 답글 입력 폼 -->
        <div v-if="replying" class="mt-3">
          <BoardEditor
            v-model="replyBody"
            placeholder="답글을 입력하세요..."
            class="mb-2"
          />
          <div class="flex gap-2">
            <UButton size="xs" :disabled="replyEmpty" @click="submitReply">등록</UButton>
            <UButton size="xs" variant="ghost" color="neutral" @click="replying = false; replyBody = ''">취소</UButton>
          </div>
        </div>
      </template>

      <!-- 자식 댓글 재귀 렌더링 -->
      <div
        v-if="comment.children.length"
        class="mt-2 pl-4 border-l border-gray-200 dark:border-gray-700 space-y-0"
      >
        <BoardComment
          v-for="child in comment.children"
          :key="child.id"
          :comment="child"
          :current-user-id="currentUserId"
          :depth="depth + 1"
          :get-display-name="getDisplayName"
          :get-initials="getInitials"
          @update="(id, body) => emit('update', id, body)"
          @delete="(id) => emit('delete', id)"
          @reply="(parentId, body) => emit('reply', parentId, body)"
        />
      </div>
    </div>
  </div>
</template>

<style>
/* Tiptap HTML 렌더링 스타일 (읽기 전용) */
.board-comment-body p { margin: 0 0 0.3em; }
.board-comment-body p:last-child { margin-bottom: 0; }
.board-comment-body strong { font-weight: 600; }
.board-comment-body em { font-style: italic; }
.board-comment-body s { text-decoration: line-through; }
.board-comment-body code {
  font-family: ui-monospace, monospace;
  font-size: 0.8em;
  background: rgb(0 0 0 / 0.06);
  border-radius: 3px;
  padding: 0.1em 0.3em;
}
.dark .board-comment-body code { background: rgb(255 255 255 / 0.1); }
.board-comment-body pre {
  background: rgb(0 0 0 / 0.06);
  border-radius: 6px;
  padding: 0.5em 0.8em;
  overflow-x: auto;
  margin: 0.3em 0;
  font-size: 0.8em;
}
.dark .board-comment-body pre { background: rgb(255 255 255 / 0.06); }
.board-comment-body pre code { background: none; padding: 0; }
.board-comment-body ul { list-style: disc; padding-left: 1.4em; margin: 0.3em 0; }
.board-comment-body ol { list-style: decimal; padding-left: 1.4em; margin: 0.3em 0; }
.board-comment-body blockquote {
  border-left: 3px solid #d1d5db;
  padding-left: 0.7em;
  color: #6b7280;
  margin: 0.3em 0;
}
.dark .board-comment-body blockquote { border-color: #4b5563; color: #9ca3af; }
.board-comment-body a { color: #3b82f6; text-decoration: underline; }
</style>
