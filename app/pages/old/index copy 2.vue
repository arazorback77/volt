<script setup lang="ts">
definePageMeta({
  // layout: false,
});
const slug = useRoute().params.slug;
console.log(slug);

const { data } = await useAsyncData("navigation", () => {
  return queryCollectionNavigation("blog").order("path", "ASC");
});

// const breadcrumb = findPageBreadcrumb(data.value, "/blog/aaa");

// const breadcrumb2 = breadcrumb[0]?.children.map((item) => {
//   return {
//     label: item.title,
//     icon: "i-lucide-book",
//     to: item.path,
//   };
// });

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
    <TemplateGof>
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
        <div class="w-full flex flex-col px-4">
          <div class="w-full h-10 bg-accent flex items-center flex-none px-4">
            <!-- <UBreadcrumb :items="items" /> -->
            <p>header for breadbrum</p>
          </div>
          <div
            class="w-full h-70 lg:min-h-[calc(100vh-var(--g-totalsum-height)-40px)] overflow-y-auto"
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
          </div>
          <div
            class="w-full h-(--g-inner-height) flex flex-none justify-center items-center"
          >
            <div>qqqqqqqqq</div>
          </div>
        </div>
      </template>

      <template #right>
        <div class="flex flex-col py-10">
          <NuxtLink to="/blog/boo">Boo</NuxtLink>
          <NuxtLink to="/blog/foo">Foo</NuxtLink>
          <NuxtLink to="/lay">Layout</NuxtLink>
          <NuxtLink to="/lay2">Layout2</NuxtLink>
        </div>
      </template>
    </TemplateGof>
  </div>
</template>
