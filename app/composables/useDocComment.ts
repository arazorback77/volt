export type CommentStatus = "draft" | "pending" | "approved" | "rejected";
export type CommentType = "comment" | "highlight" | "supplement";
export type HighlightColor = "yellow" | "green" | "blue" | "red" | "purple";

export const HIGHLIGHT_COLORS: Record<HighlightColor, { bg: string; label: string }> = {
  yellow: { bg: "rgba(254, 240, 138, 0.7)", label: "노랑" },
  green:  { bg: "rgba(187, 247, 208, 0.7)", label: "초록" },
  blue:   { bg: "rgba(191, 219, 254, 0.7)", label: "파랑" },
  red:    { bg: "rgba(254, 202, 202, 0.7)", label: "빨강" },
  purple: { bg: "rgba(233, 213, 255, 0.7)", label: "보라" },
};

export interface DocComment {
  id: string;
  doc_path: string;
  selected_text: string;
  anchor_context: string | null;
  anchor_offset: number;
  body: string;
  author_id: string;
  status: CommentStatus;
  highlight_color: HighlightColor;
  type: CommentType;
  created_at: string;
  updated_at: string;
  approved_by: string | null;
  approved_at: string | null;
}

export function useDocComment(docPath: string) {
  const authorId = useCookie("volt-doc-uid", {
    default: () => crypto.randomUUID(),
    maxAge: 60 * 60 * 24 * 365,
  });

  const comments = ref<DocComment[]>([]);
  const loading = ref(false);

  const selectedText = ref("");
  const anchorContext = ref("");
  const anchorOffset = ref(0);
  const menuPosition = ref({ x: 0, y: 0 });
  const showContextMenu = ref(false);
  const showEditor = ref(false);
  const selectedColor = ref<HighlightColor>("yellow");

  // content 영역 ref (page에서 주입)
  const contentContainer = ref<HTMLElement | null>(null);

  // 선택 시작점의 컨테이너 내 문자 오프셋 — 중복 텍스트 중 정확한 위치 특정
  function getSelectionOffset(selection: Selection, container: HTMLElement): number {
    const range = selection.getRangeAt(0);
    const preRange = document.createRange();
    preRange.selectNodeContents(container);
    preRange.setEnd(range.startContainer, range.startOffset);
    return preRange.toString().length;
  }

  function getAnchorContext(selection: Selection): string {
    const range = selection.getRangeAt(0);
    const container = range.startContainer;
    const paragraph =
      container.nodeType === Node.TEXT_NODE
        ? container.parentElement?.closest(
            "p, li, h1, h2, h3, h4, h5, h6, blockquote"
          ) ?? container.parentElement
        : (container as Element);
    return (paragraph?.textContent ?? "").slice(0, 200);
  }

  // document level mouseup — content 영역 내 선택만 처리
  function handleDocumentMouseUp(e: MouseEvent) {
    // editor 가 열려 있는 동안은 새 선택 무시
    if (showEditor.value) return;

    const container = contentContainer.value;
    if (!container) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) return;

    const range = selection.getRangeAt(0);
    if (!container.contains(range.commonAncestorContainer)) return;

    selectedText.value = selection.toString().trim();
    anchorContext.value = getAnchorContext(selection);
    anchorOffset.value = getSelectionOffset(selection, container);
    menuPosition.value = { x: e.clientX, y: e.clientY };
    showContextMenu.value = true;
  }

  function openEditor() {
    showContextMenu.value = false;
    showEditor.value = true;
  }

  function closeAll() {
    showContextMenu.value = false;
    showEditor.value = false;
    selectedText.value = "";
    anchorContext.value = "";
    anchorOffset.value = 0;
  }

  // ── Highlight DOM manipulation ───────────────────────────────────

  function clearHighlights(container: HTMLElement) {
    const marks = container.querySelectorAll<HTMLElement>("[data-comment-id]");
    marks.forEach((mark) => {
      const parent = mark.parentNode;
      if (!parent) return;
      while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
      parent.removeChild(mark);
    });
    container.normalize();
  }

  function highlightOne(container: HTMLElement, comment: DocComment) {
    if (!comment.selected_text) return;
    const color =
      HIGHLIGHT_COLORS[comment.highlight_color]?.bg ?? HIGHLIGHT_COLORS.yellow.bg;
    const text = comment.selected_text;
    const targetOffset = comment.anchor_offset ?? 0;

    let charCount = 0;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode() as Text | null;

    while (node) {
      // 이미 mark 안에 있는 노드는 스킵 (charCount는 계속 누적)
      if (node.parentElement?.closest("mark[data-comment-id]")) {
        charCount += node.textContent?.length ?? 0;
        node = walker.nextNode() as Text | null;
        continue;
      }

      const content = node.textContent ?? "";
      const nodeEnd = charCount + content.length;

      if (targetOffset >= charCount && targetOffset < nodeEnd) {
        const localOffset = targetOffset - charCount;
        const idx = content.indexOf(text, localOffset);
        if (idx !== -1) {
          const mid = node.splitText(idx);
          mid.splitText(text.length);

          const mark = document.createElement("span");
          mark.dataset.commentId = comment.id;
          mark.style.cursor = "pointer";
          if (comment.type !== "highlight") {
            mark.style.textDecoration = "underline dotted";
            mark.style.textDecorationColor = color;
            mark.style.textDecorationThickness = "6px";
            mark.style.textUnderlineOffset = "4px";
          } else {
            mark.style.backgroundColor = color;
            mark.style.borderRadius = "2px";
            mark.style.padding = "0 1px";
          }
          if (comment.body) mark.title = comment.body.slice(0, 80);

          mid.parentNode?.insertBefore(mark, mid);
          mark.appendChild(mid);
          return;
        }
      }

      charCount = nodeEnd;
      node = walker.nextNode() as Text | null;
    }
  }

  function applyHighlights(container: HTMLElement | null) {
    if (!container) return;
    clearHighlights(container);
    const active = comments.value.filter((c) => c.status !== "rejected");
    for (const c of active) highlightOne(container, c);
  }

  // ── API calls ────────────────────────────────────────────────────

  async function fetchComments() {
    loading.value = true;
    try {
      const data = await $fetch<DocComment[]>("/api/comments", {
        query: { path: docPath, author_id: authorId.value },
      });
      comments.value = data;
    } finally {
      loading.value = false;
    }
  }

  // ── Internal helpers ─────────────────────────────────────────────

  /** Replace a comment in the local list by id (splice for Vue reactivity). */
  function replaceComment(id: string, updated: DocComment) {
    const idx = comments.value.findIndex((c) => c.id === id);
    if (idx !== -1) comments.value.splice(idx, 1, updated);
  }

  /** Common POST body fields for createHighlight / createComment. */
  function selectionPayload() {
    return {
      doc_path: docPath,
      selected_text: selectedText.value,
      anchor_context: anchorContext.value || null,
      anchor_offset: anchorOffset.value,
      author_id: authorId.value,
      highlight_color: selectedColor.value,
    };
  }

  async function createHighlight() {
    if (!selectedText.value) throw new Error("선택된 텍스트가 없습니다.");
    const item = await $fetch<DocComment>("/api/comments", {
      method: "POST",
      body: { ...selectionPayload(), type: "highlight" },
    });
    comments.value.push(item);
    closeAll();
    return item;
  }

  async function createSupplement(headingId: string, headingLabel: string, body: string) {
    const item = await $fetch<DocComment>("/api/comments", {
      method: "POST",
      body: {
        doc_path: docPath,
        selected_text: headingLabel || headingId,
        anchor_context: headingId || null,
        anchor_offset: 0,
        body,
        type: "supplement",
        status: "pending",
        author_id: authorId.value,
      },
    });
    comments.value.push(item);
    return item;
  }

  async function createComment(commentBody: string) {
    if (!selectedText.value) throw new Error("선택된 텍스트가 없습니다.");
    const comment = await $fetch<DocComment>("/api/comments", {
      method: "POST",
      body: { ...selectionPayload(), body: commentBody, type: "comment" },
    });
    comments.value.push(comment);
    closeAll();
    return comment;
  }

  async function updateComment(id: string, body: string) {
    const updated = await $fetch<DocComment>(`/api/comments/${id}`, {
      method: "PATCH",
      body: { body },
    });
    replaceComment(id, updated);
    return updated;
  }

  async function publishComment(id: string) {
    const updated = await $fetch<DocComment>(`/api/comments/${id}`, {
      method: "PATCH",
      body: { status: "pending" },
    });
    replaceComment(id, updated);
    return updated;
  }

  async function cancelPublish(id: string) {
    const updated = await $fetch<DocComment>(`/api/comments/${id}`, {
      method: "PATCH",
      body: { status: "draft" },
    });
    replaceComment(id, updated);
    return updated;
  }

  async function deleteComment(id: string) {
    await $fetch(`/api/comments/${id}`, { method: "DELETE" });
    comments.value = comments.value.filter((c) => c.id !== id);
  }

  async function approveComment(id: string) {
    await $fetch(`/api/comments/${id}/approve`, { method: "POST" });
    const idx = comments.value.findIndex((c) => c.id === id);
    if (idx !== -1) comments.value.splice(idx, 1, { ...comments.value[idx], status: "approved" });
  }

  async function rejectComment(id: string) {
    const updated = await $fetch<DocComment>(`/api/comments/${id}`, {
      method: "PATCH",
      body: { status: "rejected" },
    });
    replaceComment(id, updated);
  }

  const myComments = computed(() =>
    comments.value.filter((c) => c.type === "comment" && c.status !== "approved")
  );
  const myHighlights = computed(() =>
    comments.value.filter((c) => c.type === "highlight")
  );
  const pendingComments = computed(() =>
    comments.value.filter((c) => c.type !== "highlight" && c.status === "pending")
  );
  const approvedSupplements = computed(() =>
    comments.value.filter((c) => c.type === "supplement" && c.status === "approved")
  );

  return {
    authorId,
    contentContainer,
    comments,
    myComments,
    myHighlights,
    pendingComments,
    approvedSupplements,
    loading,
    selectedText,
    anchorContext,
    menuPosition,
    showContextMenu,
    showEditor,
    selectedColor,
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
  };
}
