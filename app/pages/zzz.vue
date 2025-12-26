<script setup lang="ts">
definePageMeta({
  layout: false,
});
</script>

<template>
  <NuxtLayout name="custom">
    <template #left>
      <div>
        <div>ZZZZ Page</div>
        <ULink to="/">Home</ULink>
        <ULink to="/two">Two</ULink>
      </div>
    </template>
    <template #main> main </template>

    <template #right> right </template>
  </NuxtLayout>
</template>
