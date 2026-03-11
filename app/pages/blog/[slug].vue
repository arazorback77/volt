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
  updateComment,
  publishComment,
  cancelPublish,
  deleteComment,
  approveComment,
  rejectComment,
} = useDocComment(docPath);

const saving = ref(false);
const panelTab = ref("my");

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
    toast.add({ title: "승인 완료", description: "문서에 반영되었습니다.", color: "success" });
  } catch {
    toast.add({ title: "승인 실패", color: "error" });
  }
}

onMounted(async () => {
  document.addEventListener("mouseup", handleDocumentMouseUp);
  await fetchComments();
  await nextTick();
  applyHighlights(contentContainer.value);
});

onUnmounted(() => {
  document.removeEventListener("mouseup", handleDocumentMouseUp);
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
      <div class="px-8 py-4 overflow-y-auto h-full">
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

    <!-- Right: Comment panel -->
    <template #right>
      <CommentPanel
        v-model:tab="panelTab"
        :my-comments="myComments"
        :my-highlights="myHighlights"
        :pending-comments="pendingComments"
        :selected-text="selectedText"
        :show-editor="showEditor"
        :saving="saving"
        @create="handleCreate"
        @update="handleUpdate"
        @publish="handlePublish"
        @cancel-publish="handleCancelPublish"
        @delete="handleDelete"
        @approve="handleApprove"
        @reject="handleReject"
        @close-editor="closeAll"
      />
    </template>
  </TlTmrb>
</template>
