<template>
  <UApp class="overflow-auto">
    <NuxtLoadingIndicator />

    <!-- <NuxtLayout :name="gof">
      <NuxtPage />
    </NuxtLayout> -->

    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">
const gof = "gof";
</script>
