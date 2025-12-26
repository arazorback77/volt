<script setup>
definePageMeta({
  layout: "false",
});

const slug = useRoute().params.slug;
console.log(slug);

const { data: navigation } = await useAsyncData("navigation", () => {
  return queryCollectionNavigation("blog");
});

const { data: post } = await useAsyncData(`blog-${slug}`, () => {
  return queryCollection("blog").path(`/blog/${slug}`).first();
});

const { data: surround } = await useAsyncData(`blog-${slug}-surround`, () => {
  return queryCollectionItemSurroundings("blog", `/blog/${slug}`);
});
</script>

<template>
  <TemplateGof>
    <template #left>
      <div class="ps-4">
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
      <div class="w-full flex flex-col px-8 gap-4">
        <div class="w-full h-10 bg-accent flex items-center flex-none px-0">
          <!-- <UBreadcrumb :items="items" /> -->
          <p>header for breadbrum</p>
        </div>
        <div
          class="w-full h-70 lg:min-h-[calc(100vh-var(--g-totalsum-height)-72px)] min-h-[calc(100vh-var(--g-innersum-height)-72px)] overflow-y-auto pb-16"
        >
          <ContentRenderer :value="post" />
        </div>
        <div
          class="w-full h-(--g-inner-height) flex-none justify-center items-center"
        >
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
      </div>
    </template>

    <template #right>
      <div class="flex flex-col py-10">
        <UContentToc :links="post?.body?.toc?.links" />
      </div>
    </template>
  </TemplateGof>
</template>
