<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="px-3 py-2 border-b border-default flex items-center justify-between flex-none">
      <span class="text-sm font-medium">Comments</span>
      <UBadge v-if="pendingComments.length" color="warning" variant="soft" size="xs">
        {{ pendingComments.length }} 대기
      </UBadge>
    </div>

    <!-- Tabs -->
    <UTabs
      v-model="activeTab"
      :items="tabs"
      class="flex flex-col flex-1 min-h-0"
      :ui="{ root: 'flex flex-col flex-1 min-h-0', content: 'flex-1 overflow-y-auto' }"
    >
      <template #content="{ item }">
        <!-- My Comments tab -->
        <div v-if="item.value === 'my'" class="flex flex-col gap-2 p-2">
          <!-- New comment editor -->
          <CommentEditor
            v-if="showEditor"
            :selected-text="selectedText"
            :saving="saving"
            @save="handleCreate"
            @cancel="closeAll"
          />

          <template v-if="myComments.length">
            <CommentCard
              v-for="c in myComments"
              :key="c.id"
              :comment="c"
              :loading="actionLoading === c.id"
              author-view
              @update="handleUpdate"
              @publish="handlePublish"
              @cancel-publish="handleCancelPublish"
              @delete="handleDelete"
              @approve="handleApprove"
              @reject="handleReject"
            />
          </template>
          <div v-else-if="!showEditor" class="text-xs text-muted text-center py-8">
            텍스트를 선택하고 코멘트를 추가하세요.
          </div>
        </div>

        <!-- Highlights tab -->
        <div v-else-if="item.value === 'highlights'" class="flex flex-col gap-2 p-2">
          <template v-if="myHighlights.length">
            <CommentCard
              v-for="c in myHighlights"
              :key="c.id"
              :comment="c"
              :loading="actionLoading === c.id"
              @delete="handleDelete"
              @update="handleUpdate"
              @publish="handlePublish"
              @cancel-publish="handleCancelPublish"
              @approve="handleApprove"
              @reject="handleReject"
            />
          </template>
          <div v-else class="text-xs text-muted text-center py-8">
            텍스트를 선택하고 Highlight 하세요.
          </div>
        </div>

        <!-- Pending tab -->
        <div v-else-if="item.value === 'pending'" class="flex flex-col gap-2 p-2">
          <template v-if="pendingComments.length">
            <CommentCard
              v-for="c in pendingComments"
              :key="c.id"
              :comment="c"
              :loading="actionLoading === c.id"
              @update="handleUpdate"
              @publish="handlePublish"
              @cancel-publish="handleCancelPublish"
              @delete="handleDelete"
              @approve="handleApprove"
              @reject="handleReject"
            />
          </template>
          <div v-else class="text-xs text-muted text-center py-8">
            승인 대기 중인 코멘트가 없습니다.
          </div>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import type { DocComment } from "~/composables/useDocComment";

const props = defineProps<{
  myComments: DocComment[];
  myHighlights: DocComment[];
  pendingComments: DocComment[];
  selectedText: string;
  showEditor: boolean;
  saving?: boolean;
}>();

const emit = defineEmits<{
  create: [body: string];
  update: [id: string, body: string];
  publish: [id: string];
  "cancel-publish": [id: string];
  delete: [id: string];
  approve: [id: string];
  reject: [id: string];
  "close-editor": [];
}>();

const activeTab = defineModel<string>("tab", { default: "my" });
const actionLoading = ref<string | null>(null);

const tabs = computed(() => [
  { label: "코멘트", value: "my" },
  {
    label: `하이라이트${props.myHighlights.length ? ` (${props.myHighlights.length})` : ""}`,
    value: "highlights",
  },
  {
    label: `승인 대기${props.pendingComments.length ? ` (${props.pendingComments.length})` : ""}`,
    value: "pending",
  },
]);

async function withLoading(id: string, fn: () => Promise<void>) {
  actionLoading.value = id;
  try { await fn(); } finally { actionLoading.value = null; }
}

function closeAll() { emit("close-editor"); }
function handleCreate(body: string) { emit("create", body); }
function handleUpdate(id: string, body: string) { withLoading(id, () => { emit("update", id, body); return Promise.resolve(); }); }
function handlePublish(id: string) { withLoading(id, () => { emit("publish", id); return Promise.resolve(); }); }
function handleCancelPublish(id: string) { withLoading(id, () => { emit("cancel-publish", id); return Promise.resolve(); }); }
function handleDelete(id: string) { withLoading(id, () => { emit("delete", id); return Promise.resolve(); }); }
function handleApprove(id: string) { withLoading(id, () => { emit("approve", id); return Promise.resolve(); }); }
function handleReject(id: string) { withLoading(id, () => { emit("reject", id); return Promise.resolve(); }); }
</script>
