<script setup>
definePageMeta({
  layout: "gof",
});

const slug = useRoute().params.slug;
console.log(slug);

const { data } = await useAsyncData("navigation", () => {
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
  <NuxtLayout name="gof" class="overflow-auto">
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

    <template #main>
      <UPage class="overflow-auto">
        <UPageHeader :title="post.title" :description="post.description" />

        <UPageBody>
          <ContentRenderer :value="post" />

          <USeparator />

          <UContentSurround :surround="surround" />
        </UPageBody>
      </UPage>
    </template>

    <template #right>
      <UContentToc :links="post?.body?.toc?.links" />
    </template>
  </NuxtLayout>
</template>
