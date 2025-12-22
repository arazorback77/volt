<script setup lang="ts">
definePageMeta({
  // layout: false,
});

const { isNotificationsSlideoverOpen } = useDashboard();

const { data } = await useAsyncData("navigation", () => {
  return queryCollectionNavigation("blog").order("title", "DESC");
});

const { data: files } = useLazyAsyncData(
  "search",
  () => queryCollectionSearchSections("blog"),
  {
    server: false,
  }
);
const links = [
  {
    label: "Docs",
    icon: "i-lucide-book",
    to: "/docs/getting-started",
  },
  {
    label: "Components",
    icon: "i-lucide-box",
    to: "/docs/components",
  },
  {
    label: "Showcase",
    icon: "i-lucide-presentation",
    to: "/showcase",
  },
];
const searchTerm = ref("");
</script>

<template>
  <div>
    <NuxtLayout name="gof">
      <template #left>
        <div class="flex flex-col gap-4 flex-1 overflow-y-auto px-4 py-2">
          <UContentSearchButton :collapsed="false" />
          <UContentNavigation
            :navigation="data"
            highlight
            color="primary"
            variant="pill"
            highlight-color="error"
          />

          <ClientOnly>
            <LazyUContentSearch
              v-model:search-term="searchTerm"
              :files="files"
              shortcut="meta_k"
              :navigation="data"
              :links="links"
              :fuse="{ resultLimit: 42 }"
            />
          </ClientOnly>
        </div>
      </template>
      <template #main> main </template>

      <template #right> right </template>
    </NuxtLayout>
  </div>
</template>
