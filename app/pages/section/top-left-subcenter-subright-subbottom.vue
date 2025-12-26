<script setup lang="ts">
definePageMeta({
  // layout: "section-tlmrf",
  layout: false,
});
const slug = useRoute().params.slug;
console.log(slug);
</script>

<template>
  <!-- <NuxtLayout name="section-tlmrf"> -->
  <NuxtLayout name="section-tl(mrb)">
    <template #left>
      <div class="flex-1 flex justify-center items-center bg-accented">
        Left Slot In the Page
      </div>
    </template>
    <template #main>
      <div class="flex-1 flex justify-center items-center bg-accented">
        Main Slot In the Page
      </div>
    </template>
    <template #right>
      <div class="flex-1 flex justify-center items-center bg-accented">
        Right Slot In the Page
      </div>
    </template>
    <template #footer>
      <div class="flex-1 flex justify-center items-center bg-accented">
        Footer Slot In the Page
      </div>
    </template>
  </NuxtLayout>
</template>
