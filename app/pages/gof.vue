<script setup lang="ts">
definePageMeta({
  // layout: false,
});

const { data } = await useAsyncData("navigation", () => {
  return queryCollectionNavigation("blog").order("path", "ASC");
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
    <LayoutGof>
      <template #left>
        <div class="lg:block lg:max-h-[calc(100vh-60px)] overflow-y-auto">
          <!-- <div class="sticky top-0 bg-amber-700 h-60"> -->
          <!-- <UContentSearchButton :collapsed="false" /> -->
          <!-- </div> -->
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
      <template #main>
        <div class="min-h-[calc(100vh-var(--ui-header-height))] overflow-auto">
          main
        </div>
      </template>

      <template #right>
        right
        <NuxtLink to="/blog/boo">Boo</NuxtLink>
        <NuxtLink to="/blog/foo">Foo</NuxtLink>
        <NuxtLink to="/lay">Layout</NuxtLink>
        <NuxtLink to="/lay2">Layout2</NuxtLink>
      </template>
    </LayoutGoF>

</template>
