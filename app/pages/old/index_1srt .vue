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
  <div>
    <LayoutGof>
      <template #left>
        <div class="ps-4">
          <UContentNavigation
            :navigation="data"
            highlight
            color="primary"
            variant="pill"
            highlight-color="error"
            :ui="{
              root: 'ms-0',
              list: 'mx-0 mt-0',
              item: 'ps-0 ms-0',
              link: 'px-0',
              itemWithChildren: 'ps-0  ms-0',
              listWithChildren: 'ms-4',
            }"
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
        <div class="w-full flex flex-col min-h-75">
          <!-- <div class="w-full h-20 flex-none">
            <p>aaa</p>
          </div> -->
          <div
            class="w-full h-70 min-h-[calc(100vh-var(--ui-header-height))] overflow-y-auto"
          >
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>

            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
          </div>
          <div class="w-full h-20 flex-none">
            <p>qqqqqqqqq</p>
          </div>
        </div>
      </template>

      <template #right>
        right
        <NuxtLink to="/blog/boo">Boo</NuxtLink>
        <NuxtLink to="/blog/foo">Foo</NuxtLink>
        <NuxtLink to="/lay">Layout</NuxtLink>
        <NuxtLink to="/lay2">Layout2</NuxtLink>
      </template>
    </LayoutGof>
  </div>
</template>
