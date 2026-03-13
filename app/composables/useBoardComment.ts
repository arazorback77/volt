export interface BoardAuthor {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: string;
}

export interface BoardComment {
  id: string;
  page_path: string;
  author_id: string;
  body: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  author: BoardAuthor | null;
}

export interface BoardCommentNode extends BoardComment {
  children: BoardCommentNode[];
}

function buildTree(comments: BoardComment[]): BoardCommentNode[] {
  const map = new Map<string, BoardCommentNode>(
    comments.map(c => [c.id, { ...c, children: [] }])
  )
  const roots: BoardCommentNode[] = []
  for (const node of map.values()) {
    if (node.parent_id === null) roots.push(node)
    else map.get(node.parent_id)?.children.push(node)
  }
  return roots
}

export function useBoardComment(pagePath: string) {
  const comments = ref<BoardComment[]>([]);
  const loading = ref(false);

  const commentTree = computed<BoardCommentNode[]>(() =>
    buildTree(comments.value)
  );

  async function fetchComments() {
    loading.value = true;
    try {
      comments.value = await $fetch<BoardComment[]>("/api/board", {
        query: { path: pagePath },
      });
    } finally {
      loading.value = false;
    }
  }

  async function createComment(body: string, parentId?: string) {
    const created = await $fetch<BoardComment>("/api/board", {
      method: "POST",
      body: { page_path: pagePath, body, parent_id: parentId ?? null },
    });
    comments.value.push(created);
    return created;
  }

  async function updateComment(id: string, body: string) {
    const updated = await $fetch<BoardComment>(`/api/board/${id}`, {
      method: "PATCH",
      body: { body },
    });
    const idx = comments.value.findIndex((c) => c.id === id);
    if (idx !== -1) comments.value.splice(idx, 1, updated);
    return updated;
  }

  async function deleteComment(id: string) {
    await $fetch(`/api/board/${id}`, { method: "DELETE" });
    const idx = comments.value.findIndex((c) => c.id === id);
    if (idx !== -1) comments.value.splice(idx, 1);
  }

  function getDisplayName(author: BoardAuthor | null): string {
    if (!author) return "Anonymous";
    return author.display_name ?? "User";
  }

  function getInitials(author: BoardAuthor | null): string {
    return getDisplayName(author).slice(0, 2).toUpperCase();
  }

  return {
    comments,
    commentTree,
    loading,
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
    getDisplayName,
    getInitials,
  };
}
