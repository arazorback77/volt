<script setup lang="ts">
definePageMeta({
  layout: false,
});

const { data: duck } = await useFetch("/api/duck");
const { data: members } = await useFetch("/api/member");

interface KospiRow {
  trade_date: string;
  close_price: number;
  change: number;
}

const { data: kospi } = await useFetch<KospiRow[]>("/api/kospi");
const { data: meta } = await useFetch("/api/meta");
const { data: mother } = await useFetch("/api/mother");

const { data: users } = await useFetch("/api/ytm/20210305");
</script>

<template>
  <NuxtLayout name="base-left-main-right">
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
      <h1>Users from DuckDB</h1>

      <ul>
        <li v-for="user in kospi" :key="user.trade_date">
          {{ user.trade_date }} - Age: {{ user.close_price }} - K2 :
          {{ user.change }}
        </li>
      </ul>

      <div>members row: {{ members }}</div>
      <!-- <div>users row: {{ users.getRowObjectsJson() }}</div>
      <div>users col : {{ users.getColumnsObjectJson() }}</div>
      <div>users: {{ users.getRows() }}</div> -->
      <!-- <div>users: {{ users.getRows() }}</div> -->

      <div>duck row: {{ duck }}</div>
      <div>kospi row: {{ kospi }}</div>
      <div>meta row: {{ meta }}</div>
      <div>mother row: {{ mother }}</div>
      <div>users row: {{ users }}</div>
    </template>

    <template #right> right </template>
  </NuxtLayout>
</template>
