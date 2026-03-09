<script setup lang="ts">
definePageMeta({
  layout: false,
});
const { data: users, pending, error } = await useFetch("/api/meta");
</script>

<template>
  <NuxtLayout name="base-top-main">
    <template #left>
      <div>
        <div>ZZZZ Page</div>
        <ULink to="/">Home</ULink>
        <ULink to="/two">Two</ULink>
        <ULink to="/qqq">Qqq</ULink>
        <ULink to="/www">WWW</ULink>
      </div>
    </template>
    <template #main>
      main
      <div>
        <h1>Users from DuckDB</h1>
        <div v-if="pending">Loading...</div>
        <div v-else-if="error">{{ error.message }}</div>
        <ul v-else>
          <li v-for="user in users" :key="user.BASE_DATE">
            {{ user.ATM }} - Age: {{ user.BASE_DATE }} - K2 : {{ user }}
          </li>
        </ul>
      </div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>main</div>
      <div>bbb</div>
      <div>bbb</div>
      <div>bbb</div>
      <div>bbb</div>
    </template>

    <template #right> right </template>

    <template #footer> footer </template>
  </NuxtLayout>
</template>
