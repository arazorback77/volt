<script setup lang="ts">
import { useBoardComment } from "~/composables/useBoardComment";

const props = defineProps<{
  pagePath: string;
}>();

const { user, isSignedIn } = useUser();
const toast = useToast();

const {
  commentTree,
  loading,
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
  getDisplayName,
  getInitials,
  comments,
} = useBoardComment(props.pagePath);

// 내부 users.id (소유자 판단용) — sync 응답에서 받아옴
const internalUserId = ref<string | null>(null);

// Clerk 로그인 시 DuckDB users 동기화 (provider-agnostic)
watch(
  isSignedIn,
  async (val) => {
    if (!val || !user.value) {
      internalUserId.value = null;
      return;
    }
    const u = user.value;
    const displayName =
      u.username ??
      ([u.firstName, u.lastName].filter(Boolean).join(" ") || null);
    const result = await $fetch<{ id: string } | null>("/api/auth/sync", {
      method: "POST",
      body: {
        provider: "clerk",
        email: u.primaryEmailAddress?.emailAddress ?? null,
        display_name: displayName,
        avatar_url: u.imageUrl ?? null,
      },
    }).catch(() => null);
    internalUserId.value = result?.id ?? null;
  },
  { immediate: true }
);

onMounted(fetchComments);

async function handleSubmit(body: string) {
  try {
    await createComment(body);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "오류가 발생했습니다.";
    toast.add({ title: "댓글 등록 실패", description: msg, color: "error" });
  }
}

async function handleReply(parentId: string, body: string) {
  try {
    await createComment(body, parentId);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "오류가 발생했습니다.";
    toast.add({ title: "답글 등록 실패", description: msg, color: "error" });
  }
}

async function handleUpdate(id: string, body: string) {
  try {
    await updateComment(id, body);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "오류가 발생했습니다.";
    toast.add({ title: "수정 실패", description: msg, color: "error" });
  }
}

async function handleDelete(id: string) {
  try {
    await deleteComment(id);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "오류가 발생했습니다.";
    toast.add({ title: "삭제 실패", description: msg, color: "error" });
  }
}
</script>

<template>
  <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
    <h3 class="text-base font-semibold mb-6">
      댓글
      <span
        v-if="comments.length"
        class="text-sm font-normal text-gray-500 ml-1"
      >
        ({{ comments.length }})
      </span>
    </h3>

    <BoardForm class="mb-8" @submit="handleSubmit" />

    <div v-if="loading" class="text-sm text-gray-400 text-center py-6">
      불러오는 중...
    </div>

    <template v-else-if="commentTree.length">
      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <BoardComment
          v-for="node in commentTree"
          :key="node.id"
          :comment="node"
          :current-user-id="internalUserId"
          :depth="0"
          :get-display-name="getDisplayName"
          :get-initials="getInitials"
          @update="handleUpdate"
          @delete="handleDelete"
          @reply="handleReply"
        />
      </div>
    </template>

    <div v-else class="text-sm text-gray-400 text-center py-8">
      첫 번째 댓글을 남겨보세요!
    </div>
  </div>
</template>
