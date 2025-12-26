<script setup lang="ts">
definePageMeta({
  layout: false,
});
</script>

<template>
  <div>
    <NuxtLayout name="twoslot" class="flex flex-col">
      <template #left>
        <p>App</p>
        <ULink to="/">Home</ULink>
        <ULink to="/zzz">zzz</ULink>
      </template>
      <template #default>
        <div>Default</div>
      </template>
    </NuxtLayout>
  </div>
</template>
