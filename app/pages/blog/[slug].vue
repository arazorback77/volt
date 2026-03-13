<script setup lang="ts">
import TlTmrb from "~/layouts/section/tl(tmrb).vue";

definePageMeta({ layout: false });

const route = useRoute();
const slug = route.params.slug as string;
const toast = useToast();

const { data: navigation } = await useAsyncData("navigation", () =>
  queryCollectionNavigation("blog")
);
const { data: post } = await useAsyncData(`blog-${slug}`, () =>
  queryCollection("blog").path(`/blog/${slug}`).first()
);
const { data: surround } = await useAsyncData(`blog-${slug}-surround`, () =>
  queryCollectionItemSurroundings("blog", `/blog/${slug}`)
);

const docPath = `/blog/${slug}`;
const {
  contentContainer,
  myComments,
  myHighlights,
  pendingComments,
  approvedSupplements,
  selectedText,
  selectedColor,
  showContextMenu,
  showEditor,
  menuPosition,
  handleDocumentMouseUp,
  openEditor,
  closeAll,
  applyHighlights,
  fetchComments,
  createHighlight,
  createComment,
  createSupplement,
  updateComment,
  publishComment,
  cancelPublish,
  deleteComment,
  approveComment,
  rejectComment,
} = useDocComment(docPath);

const saving = ref(false);
const panelTab = ref("my");

// ── 보충 설명 스크롤 동기화 ─────────────────────────────────────────
const mainScrollEl = ref<HTMLElement | null>(null);
const activeHeadingId = ref<string | null>(null);

function handleMainScroll() {
  const container = contentContainer.value;
  const scrollEl = mainScrollEl.value;
  if (!container || !scrollEl) return;

  // 뷰포트 상단 + 60px 기준선 아래로 지나간 마지막 heading = active section
  const threshold = scrollEl.getBoundingClientRect().top + 60;
  const headings = Array.from(
    container.querySelectorAll("h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]")
  );

  let active: string | null = null;
  for (const h of headings) {
    if (h.getBoundingClientRect().top <= threshold) {
      active = (h as HTMLElement).id;
    }
  }
  if (active !== activeHeadingId.value) activeHeadingId.value = active;
}

function handleScrollToHeading(headingId: string) {
  const scrollEl = mainScrollEl.value;
  if (!scrollEl) return;
  const el = document.getElementById(headingId);
  if (!el) return;
  const containerTop = scrollEl.getBoundingClientRect().top;
  const elTop = el.getBoundingClientRect().top;
  scrollEl.scrollBy({ top: elTop - containerTop - 60, behavior: "smooth" });
}

function handleOpenEditor() {
  panelTab.value = "my";
  openEditor();
}

async function handleHighlight() {
  try {
    await createHighlight();
    await nextTick();
    applyHighlights(contentContainer.value);
    panelTab.value = "highlights";
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "저장 중 오류가 발생했습니다.";
    toast.add({ title: "하이라이트 실패", description: msg, color: "error" });
  }
}

async function handleCreate(body: string) {
  saving.value = true;
  try {
    await createComment(body);
    await nextTick();
    applyHighlights(contentContainer.value);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "저장 중 오류가 발생했습니다.";
    toast.add({ title: "저장 실패", description: msg, color: "error" });
  } finally {
    saving.value = false;
  }
}

async function handleUpdate(id: string, body: string) {
  try {
    await updateComment(id, body);
  } catch (e: unknown) {
    console.error("[handleUpdate]", e);
    const msg = e instanceof Error ? e.message : JSON.stringify(e);
    toast.add({ title: "수정 실패", description: msg, color: "error" });
  }
}

async function handleDelete(id: string) {
  try {
    await deleteComment(id);
    await nextTick();
    applyHighlights(contentContainer.value);
  } catch (e: unknown) {
    console.error("[handleDelete]", e);
    const msg = e instanceof Error ? e.message : JSON.stringify(e);
    toast.add({ title: "삭제 실패", description: msg, color: "error" });
  }
}

async function handlePublish(id: string) {
  try {
    await publishComment(id);
  } catch (e: unknown) {
    console.error("[handlePublish]", e);
    const msg = e instanceof Error ? e.message : JSON.stringify(e);
    toast.add({ title: "게시 요청 실패", description: msg, color: "error" });
  }
}

async function handleCancelPublish(id: string) {
  try {
    await cancelPublish(id);
  } catch (e: unknown) {
    console.error("[handleCancelPublish]", e);
    const msg = e instanceof Error ? e.message : JSON.stringify(e);
    toast.add({ title: "취소 실패", description: msg, color: "error" });
  }
}

async function handleReject(id: string) {
  try {
    await rejectComment(id);
    await nextTick();
    applyHighlights(contentContainer.value);
  } catch (e: unknown) {
    console.error("[handleReject]", e);
    const msg = e instanceof Error ? e.message : JSON.stringify(e);
    toast.add({ title: "반려 실패", description: msg, color: "error" });
  }
}

async function handleApprove(id: string) {
  try {
    await approveComment(id);
    await nextTick();
    applyHighlights(contentContainer.value);
    toast.add({ title: "승인 완료", description: "반영되었습니다.", color: "success" });
  } catch {
    toast.add({ title: "승인 실패", color: "error" });
  }
}

async function handleCreateSupplement(headingId: string, headingLabel: string, body: string) {
  try {
    await createSupplement(headingId, headingLabel, body);
    toast.add({ title: "보충 설명 저장", description: "승인 대기 탭에서 승인하면 바로 표시됩니다.", color: "success" });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "저장 중 오류가 발생했습니다.";
    toast.add({ title: "저장 실패", description: msg, color: "error" });
  }
}

onMounted(async () => {
  document.addEventListener("mouseup", handleDocumentMouseUp);
  mainScrollEl.value?.addEventListener("scroll", handleMainScroll, { passive: true });
  await fetchComments();
  await nextTick();
  applyHighlights(contentContainer.value);
});

onUnmounted(() => {
  document.removeEventListener("mouseup", handleDocumentMouseUp);
  mainScrollEl.value?.removeEventListener("scroll", handleMainScroll);
});
</script>

<template>
  <TlTmrb>
    <!-- Left: Navigation -->
    <template #left>
      <div class="px-4 py-4 overflow-y-auto h-full">
        <UContentNavigation
          :navigation="navigation"
          highlight
          color="primary"
          variant="pill"
          highlight-color="error"
          :ui="{
            root: 'ms-0',
            list: 'mx-0 mt-0',
            item: 'ps-0 ms-0',
            link: 'px-0',
            itemWithChildren: 'ps-0 ms-0',
            listWithChildren: 'ms-4',
          }"
        />
      </div>
    </template>

    <!-- TOC -->
    <template #toc>
      <div class="px-4 py-4 overflow-y-auto h-full">
        <UContentToc :links="post?.body?.toc?.links" />
      </div>
    </template>

    <!-- Main: Document content -->
    <template #main>
      <div ref="mainScrollEl" class="overflow-y-auto h-full">
        <div class="px-8 py-4">
          <template v-if="post">
            <div ref="contentContainer">
              <ContentRenderer :value="post" />
            </div>
            <div class="mt-8">
              <UContentSurround
                :surround="surround"
                :ui="{
                  root: '',
                  link: 'flex gap-4 py-2 px-2 items-center last:flex-row-reverse',
                  linkLeading: 'mb-0',
                  linkLeadingIcon: 'size-4',
                  linkTitle: 'text-md',
                }"
              />
            </div>
            <BoardThread :page-path="docPath" />
          </template>
          <div v-else class="flex items-center justify-center h-64 text-muted">
            페이지를 찾을 수 없습니다.
          </div>
        </div>
      </div>

      <CommentContextMenu
        :show="showContextMenu"
        :x="menuPosition.x"
        :y="menuPosition.y"
        :selected-color="selectedColor"
        @highlight="handleHighlight"
        @add-comment="handleOpenEditor"
        @close="closeAll"
        @update:selected-color="selectedColor = $event"
      />
    </template>

    <!-- Right: Comment panel (보충 설명 + 코멘트/하이라이트) -->
    <template #right>
      <CommentPanel
        v-model:tab="panelTab"
        :my-comments="myComments"
        :my-highlights="myHighlights"
        :pending-comments="pendingComments"
        :approved-supplements="approvedSupplements"
        :selected-text="selectedText"
        :show-editor="showEditor"
        :saving="saving"
        :toc-links="post?.body?.toc?.links"
        :active-heading-id="activeHeadingId"
        @create="handleCreate"
        @update="handleUpdate"
        @publish="handlePublish"
        @cancel-publish="handleCancelPublish"
        @delete="handleDelete"
        @approve="handleApprove"
        @reject="handleReject"
        @close-editor="closeAll"
        @create-supplement="handleCreateSupplement"
        @scroll-to-heading="handleScrollToHeading"
      />
    </template>
  </TlTmrb>
</template>
