<script setup>

definePageMeta({
  layout: 'gof',
})

const slug = useRoute().params.slug
console.log(slug)

const { data: post } = await useAsyncData(`blog-${slug}`, () => {
  return queryCollection('blog').path(`/blog/${slug}`).first()
})

const { data: surround } = await useAsyncData(`blog-${slug}-surround`, () => {
  return queryCollectionItemSurroundings('blog', `/blog/${slug}`)
})

</script>

<template>
  <!-- Render the blog post as Prose & Vue components -->
<UPage>
      <template #left >
        <UContentToc :links="post?.body?.toc?.links" />
    </template >

    <UPageHeader :title="post.title" :description="post.description" />

    <UPageBody>
      <ContentRenderer :value="post" />

      <USeparator />

      <UContentSurround :surround="surround" />
    </UPageBody>


    <template #right >
        <UContentToc :links="post?.body?.toc?.links" />
    </template >
  </UPage>

  
</template>
