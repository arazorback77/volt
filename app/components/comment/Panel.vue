<template>
  <div class="flex flex-col h-full">
    <!-- ── 보충 설명 섹션 ── -->
    <div class="flex-none border-b border-default">
      <div class="px-3 py-2 flex items-center justify-between">
        <span class="text-xs font-semibold text-muted uppercase tracking-wide">보충 설명</span>
        <UButton
          size="xs"
          color="neutral"
          variant="ghost"
          icon="i-lucide-plus"
          @click="toggleSupplementForm"
        />
      </div>

      <!-- 작성 폼 -->
      <div v-if="showSupplementForm" class="px-3 pb-3 flex flex-col gap-2">
        <USelect
          v-model="supplementHeadingId"
          :items="headingOptions"
          placeholder="섹션 선택..."
          size="xs"
        />
        <UTextarea
          v-model="supplementBody"
          :rows="4"
          placeholder="MDC 문법으로 작성하세요. (예: **굵게**, ::XlsxTable 컴포넌트 사용 가능)"
          class="text-xs"
        />
        <div class="flex justify-end gap-2">
          <UButton size="xs" color="neutral" variant="ghost" @click="cancelSupplementForm">취소</UButton>
          <UButton
            size="xs"
            color="primary"
            :disabled="!supplementBody.trim() || !supplementHeadingId"
            :loading="supplementSaving"
            @click="handleCreateSupplement"
          >
            저장
          </UButton>
        </div>
      </div>

      <!-- approved supplements 목록 (스크롤 동기화: 본문 active 섹션 하이라이트) -->
      <div
        v-if="approvedSupplements.length"
        ref="supplementListRef"
        class="px-3 pb-3 flex flex-col gap-2 max-h-52 overflow-y-auto"
      >
        <div
          v-for="s in approvedSupplements"
          :key="s.id"
          :data-heading-id="s.anchor_context"
          class="rounded border p-2 transition-all duration-200 cursor-pointer"
          :class="s.anchor_context === activeHeadingId
            ? 'border-primary/50 bg-primary/5 shadow-sm'
            : 'border-success/20 bg-success/5'"
          @click="handleSupplementClick(s.anchor_context)"
        >
          <div class="text-xs font-medium text-muted mb-1">
            {{ getHeadingLabel(s.anchor_context) }}
          </div>
          <MDC :value="s.body ?? ''" tag="div" class="prose prose-xs max-w-none" />
        </div>
      </div>
      <div v-else-if="!showSupplementForm" class="px-3 pb-3 text-xs text-muted">
        승인된 보충 설명이 없습니다.
      </div>
    </div>

    <!-- ── Header ── -->
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

interface TocLink {
  id: string;
  text: string;
  depth: number;
  children?: TocLink[];
}

const props = defineProps<{
  myComments: DocComment[];
  myHighlights: DocComment[];
  pendingComments: DocComment[];
  approvedSupplements: DocComment[];
  selectedText: string;
  showEditor: boolean;
  saving?: boolean;
  tocLinks?: TocLink[];
  activeHeadingId?: string | null;
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
  "create-supplement": [headingId: string, headingLabel: string, body: string];
  "scroll-to-heading": [headingId: string];
}>();

const activeTab = defineModel<string>("tab", { default: "my" });
const actionLoading = ref<string | null>(null);

// ── 스크롤 동기화: 본문 active 섹션에 맞춰 supplement 카드 하이라이트 + scrollIntoView ──
const supplementListRef = ref<HTMLElement | null>(null);

watch(() => props.activeHeadingId, (id) => {
  if (!id || !supplementListRef.value) return;
  const card = supplementListRef.value.querySelector<HTMLElement>(`[data-heading-id="${id}"]`);
  card?.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

// ── Supplement form state ─────────────────────────────────────────
const showSupplementForm = ref(false);
const supplementHeadingId = ref("");
const supplementBody = ref("");
const supplementSaving = ref(false);

function toggleSupplementForm() {
  showSupplementForm.value = !showSupplementForm.value;
  if (!showSupplementForm.value) {
    supplementHeadingId.value = "";
    supplementBody.value = "";
  }
}

function cancelSupplementForm() {
  showSupplementForm.value = false;
  supplementHeadingId.value = "";
  supplementBody.value = "";
}

function handleCreateSupplement() {
  if (!supplementBody.value.trim() || !supplementHeadingId.value) return;
  const option = headingOptions.value.find((o) => o.value === supplementHeadingId.value);
  emit(
    "create-supplement",
    supplementHeadingId.value,
    option?.label ?? supplementHeadingId.value,
    supplementBody.value.trim()
  );
  cancelSupplementForm();
}

// TOC links를 flat한 드롭다운 옵션으로 변환 (USelect: { value, label } 형식)
function flattenLinks(links: TocLink[]): { value: string; label: string }[] {
  const result: { value: string; label: string }[] = [];
  for (const link of links) {
    const indent = "—".repeat(Math.max(0, link.depth - 1));
    result.push({ value: link.id, label: `${indent ? indent + " " : ""}${link.text}` });
    if (link.children?.length) {
      result.push(...flattenLinks(link.children));
    }
  }
  return result;
}

const headingOptions = computed(() =>
  props.tocLinks ? flattenLinks(props.tocLinks) : []
);

function getHeadingLabel(anchorContext: string | null): string {
  if (!anchorContext) return "";
  const option = headingOptions.value.find((o) => o.value === anchorContext);
  return option?.label ?? anchorContext;
}

// ── Tabs ─────────────────────────────────────────────────────────
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

function handleSupplementClick(headingId: string | null) {
  if (!headingId) return;
  emit("scroll-to-heading", headingId);
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
