<template>
  <UNavigationMenu
    v-model="active"
    highlight
    highlight-color="error"
    :orientation="orientaion"
    :items="items"
    color="info"
    arrow
    :ui="{
      root: 'w-full justify-between px-30 z-20',
      // link: 'data-[state=open]:text-primary ',
      linkLeadingIcon:
        'shrink-0 size-5 text-(--g-head-font) group-data-[state=open]:text-primary',
      linkLabel:
        'text-base text-(--g-head-font) group-data-[state=open]:text-primary',
      linkTrailingIcon:
        'shrink-0 size-5 text-(--g-head-font) group-data-[state=open]:text-primary',
      // linkLabelExternalIcon: 'text-(--g-head-inv)',
      // childLabel: 'text-xs text-primary',
      childLink:
        'text-(--g-head-font) dark:hover:bg-slate-700 hover:bg-slate-800',
      childLinkIcon: 'group-hover:text-primary',
      childLinkLabel: 'text-(--g-head-font) group-hover:text-primary',
      childLinkDescription: 'text-(--g-head-accent) group-hover:text-primary',
      // childLinkLabelExternalIcon: 'text-(--g-head-inv)',
      separator: 'bg-primary',
      // viewport: 'bg-neutral-800/20  ring-(--ui-bg) z-100',
      // viewport: 'bg-slate-700  ring-(--ui-bg) z-100',
      viewport: 'bg-(--ui-bg) ring-(--g-head-bg) z-100',
      arrow: 'border-(--g-head-accent) bg-(--g-head-accent)',
    }"
  >
    <template #components-trailing>
      <UBadge label="3" variant="solid" size="xs" class="rounded-full" />
    </template>
  </UNavigationMenu>
</template>

<script setup lang="ts">
import items from "../../../../public/data/menu.json";
// const router = useRouter();

const { orientaion = "horizontal" } = defineProps<{
  orientaion?: "vertical" | "horizontal";
}>();

const active = ref();

defineShortcuts({
  1: () => {
    active.value = "item-0";
  },
  2: () => {
    active.value = "item-1";
  },
  3: () => {
    active.value = "item-2";
  },
});
</script>
