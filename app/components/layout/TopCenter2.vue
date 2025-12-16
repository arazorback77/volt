<script setup lang="ts">
import items from "../../../public/data/menu.json";
// const router = useRouter();

const { orientaion = "horizontal" } = defineProps<{
  orientaion?: "vertical" | "horizontal";
}>();

const active = ref();

defineShortcuts({
  1: () => {
    active.value = "0";
  },
  2: () => {
    active.value = "1";
  },
  3: () => {
    active.value = "2";
  },
});
</script>

<template>
  <UNavigationMenu
    v-model="active"
    highlight
    highlight-color="primary"
    :orientation="orientaion"
    :items="items"
    arrow
    class="w-full justify-between px-30 z-20"
  >
    <template #components-trailing>
      <UBadge label="3" variant="solid" size="xs" class="rounded-full" />
    </template>
  </UNavigationMenu>
</template>

<!-- arrow -->
<!-- highlight
    color="primary"
    highlight-color="primary" -->
