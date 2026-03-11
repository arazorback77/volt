<script setup lang="ts">
const emit = defineEmits<{
  submit: [body: string];
}>();

const { user, isSignedIn } = useUser();
const body = ref("");

const isEmpty = computed(() => {
  const stripped = body.value.replace(/<[^>]*>/g, "").trim();
  return stripped.length === 0;
});

const initials = computed(() => {
  if (!user.value) return "";
  const name = user.value.username ?? user.value.firstName ?? "U";
  return name.slice(0, 2).toUpperCase();
});

function handleSubmit() {
  if (isEmpty.value) return;
  emit("submit", body.value);
  body.value = "";
}
</script>

<template>
  <SignedOut>
    <div
      class="flex items-center gap-3 py-3 px-4 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 text-sm"
    >
      <UIcon name="i-lucide-message-circle" class="text-gray-400 shrink-0" />
      <span class="text-gray-500">댓글을 남기려면 로그인하세요.</span>
      <SignInButton mode="modal">
        <UButton size="sm" variant="soft" class="ml-auto">로그인</UButton>
      </SignInButton>
    </div>
  </SignedOut>

  <SignedIn>
    <div class="flex gap-3">
      <UAvatar
        :src="user?.imageUrl"
        :alt="user?.username ?? user?.firstName ?? 'User'"
        :text="initials"
        size="md"
        class="shrink-0 mt-0.5"
      />
      <div class="flex-1">
        <BoardEditor
          v-model="body"
          placeholder="댓글을 입력하세요..."
          class="mb-2"
        />
        <UButton
          size="sm"
          :disabled="isEmpty"
          @click="handleSubmit"
        >
          등록
        </UButton>
      </div>
    </div>
  </SignedIn>
</template>
