<template>
  <div class="min-h-screen flex flex-col">
    <!-- <div
      class="h-20 bg-primary flex items-center justify-center border-2 border-secondary"
    >
      <p class="text-white">Header Section of Layout</p>
      <UButton
        icon="i-lucide-chevron-left"
        size="md"
        color="secondary"
        variant="solid"
        class="rounded-full"
        to="/section/top-left-center"
      />

      <UButton
        icon="i-lucide-chevron-left"
        size="md"
        color="secondary"
        variant="solid"
        class="rounded-full"
        to="/section/top-left-center-bottom"
      />

      <UButton
        icon="i-lucide-chevron-left"
        size="md"
        color="secondary"
        variant="solid"
        class="rounded-full"
        to="/section/top-left-center-right-bottom"
      />

      <UButton
        icon="i-lucide-chevron-left"
        size="md"
        color="secondary"
        variant="solid"
        class="rounded-full"
        to="/section/top-left-subcenter-subbottom"
      />

      <UButton
        icon="i-lucide-chevron-left"
        size="md"
        color="secondary"
        variant="solid"
        class="rounded-full"
        to="/section/top-left-subcenter-subright-subbottom"
      />

      <UButton
        icon="i-lucide-chevron-left"
        size="md"
        color="secondary"
        variant="solid"
        class="rounded-full"
        to="/section/top-left-center-bottom"
      />
    </div> -->
    <FragmentHead />
    <SplitterGroup
      id="custom-group"
      auto-save-id="gof-splitter2"
      direction="horizontal"
      class="min-h-[calc(100dvh-80px)]"
    >
      <SplitterPanel
        id="custom-group-left"
        ref="leftPanelRef"
        collapsible
        :default-size="25"
        :collapsed-size="0"
        :min-size="0"
        class="bg-muted flex flex-col px-10 pb-10"
      >
        <div class="flex justify-center">Left Section of Layout</div>
        <slot name="left" />
      </SplitterPanel>
      <SplitterResizeHandle class="w-1 bg-secondary hover:w-2" />

      <SplitterPanel
        id="custom-group-main"
        :default-size="mainSize"
        class="bg-muted flex flex-col px-10 pb-10"
      >
        <div class="flex justify-center bg-muted">Main Section of Layout</div>
        <slot name="main" />
      </SplitterPanel>
    </SplitterGroup>
  </div>
</template>

<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui";

const slots = useSlots();

const mainSize = computed(() => {
  if (slots.left) {
    return 100 - 25 - 15;
  } else if (slots.right) {
    return 100 - 15;
  } else {
    return 100;
  }
  // return 60;
});

const leftPanelRef =
  useTemplateRef<InstanceType<typeof SplitterPanel>>("leftPanelRef");
// const rightPanelRef =
//   useTemplateRef<InstanceType<typeof SplitterPanel>>("rightPanelRef");
</script>
