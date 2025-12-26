<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";
import { findPageBreadcrumb } from "@nuxt/content/utils";

const slug = useRoute().params.slug;
console.log(slug);

const { data } = await useAsyncData("navigation", () => {
  return queryCollectionNavigation("blog").order("path", "ASC");
});
const breadcrumb = findPageBreadcrumb(data.value, "/blog/aaa");

const breadcrumb2 = breadcrumb.map((item) => {
  return {
    label: item.title,
    icon: "i-lucide-book",
    to: item.path,
  };
});
console.log(breadcrumb2);
</script>

<template>
  <div>test</div>
</template>
