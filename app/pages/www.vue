<script setup lang="ts">
definePageMeta({
  layout: false,
});
</script>

<template>
  <NuxtLayout name="base-left-main-right-nest">
    <template #left>
      <div>
        <div>ZZZZ Page</div>
        <ULink to="/">Home</ULink>
        <ULink to="/two">Two</ULink>
        <ULink to="/qqq">Qqq</ULink>
        <ULink to="/www">WWW</ULink>
      </div>
    </template>
    <template #main> main </template>

    <template #right> right </template>

    <template #footer> footer </template>
  </NuxtLayout>
</template>
