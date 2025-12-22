<template>
  <div>
    <h1>Index page</h1>
    <NuxtLink to="/blog/boo">Boo</NuxtLink>
    <NuxtLink to="/blog/foo">Foo</NuxtLink>
    <NuxtLink to="/lay">Layout</NuxtLink>
    <NuxtLink to="/lay2">Layout2</NuxtLink>
    <VoltSecondaryButton label="VoltSecondaryButton" />
    <VoltButton label="VoltButton" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "gof",
});
</script>
