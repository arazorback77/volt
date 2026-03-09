<template>
  <SplitterGroup
    id="lmr-group"
    auto-save-id="gof-splitter2"
    direction="horizontal"
    class="min-h-[calc(100dvh-var(--ui-header-height)-var(--g-foot-height))]"
  >
    <template v-if="$slots.left">
      <SplitterPanel
        id="lmr-group-left"
        ref="leftPanelRef"
        collapsible
        :default-size="leftSize"
        :collapsed-size="0"
        :min-size="0"
        class="bg-muted flex flex-col px-0"
      >
        <slot name="left" />
      </SplitterPanel>
      <SplitterResizeHandle
        class="w-0.5 bg-accented hover:bg-secondary hover:w-2"
      />
    </template>
    <SplitterPanel
      id="lmr-group-main"
      :default-size="mainSize"
      class="bg-muted flex flex-col px-10 pb-10"
    >
      <div class="flex justify-center bg-muted">Main Section of Layout</div>
      <slot name="main" />
    </SplitterPanel>

    <SplitterResizeHandle
      id="lmr-group-right"
      class="w-0.5 bg-accented hover:bg-secondary hover:w-2"
    />

    <template v-if="$slots.right">
      <SplitterPanel
        ref="rightPanelRef"
        collapsible
        :collapsed-size="0"
        :min-size="0"
        :default-size="15"
        class="bg-muted flex flex-col px-10 pb-10"
      >
        <div class="flex justify-center">Right Section of Layout</div>
        <slot name="right" />
      </SplitterPanel>
    </template>
  </SplitterGroup>
</template>

<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui";

definePageMeta({});
const { leftSize = 25, rightSize = 15 } = defineProps<{
  leftSize?: number;
  rightSize?: number;
}>();

// const mainSize = computed(() => {
//   return 100 - leftSize - rightSize;
// });

const slots = useSlots();
const mainSize = computed(() => {
  if (!slots.left && !slots.right) {
    return 100;
  } else if (!slots.left && slots.right) {
    return 100 - rightSize;
  } else if (slots.left && !slots.right) {
    return 100 - leftSize;
  } else {
    return 100 - leftSize - rightSize;
  }
});

// const leftPanelRef = ref<InstanceType<typeof SplitterPanel>>("l");
// const panelRefRight = useTemplateRef<InstanceType<typeof SplitterPanel>>();
const leftPanelRef =
  useTemplateRef<InstanceType<typeof SplitterPanel>>("leftPanelRef");
const rightPanelRef =
  useTemplateRef<InstanceType<typeof SplitterPanel>>("rightPanelRef");

definePageMeta({});

defineExpose({
  leftPanelRef,
  rightPanelRef,
});
</script>
