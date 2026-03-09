<script setup lang="ts">
definePageMeta({
  layout: "default",
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
    <div>aaaaa</div>
    <NuxtLink to="/two">Two</NuxtLink>
    <NuxtLink to="/zzz">zzz</NuxtLink>
    <NuxtLink to="/qqq">qqq</NuxtLink>
    <ULink to="/www">www</ULink>
    <ULink to="/main">main</ULink>
  </div>
</template>
