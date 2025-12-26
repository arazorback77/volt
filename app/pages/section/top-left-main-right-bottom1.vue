<script setup lang="ts">
definePageMeta({
  layout: "section-tlmrf",
  // layout: false,
});
const slug = useRoute().params.slug;
console.log(slug);
</script>

<template>
  <div class="flex flex-col flex-none justify-center items-center">
    <div class="flex-none bg-amber-400">Test Page</div>
    <div class="flex-none bg-green-700">Test Page</div>
  </div>
</template>
