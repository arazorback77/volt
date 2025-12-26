<template>
  <div class="min-h-screen flex flex-col">
    <SplitterGroup
      id="custom-group"
      auto-save-id="gof-splitter2"
      direction="horizontal"
      class="h-96"
    >
      <template v-if="$slots.left">
        <SplitterPanel
          id="custom-group-left"
          ref="leftPanelRef"
          collapsible
          :default-size="25"
          :collapsed-size="0"
          :min-size="0"
          class="sticky top-[60px] bg-muted flex flex-col"
        >
          <div class="flex flex-1 justify-center">Left Section</div>
          <slot name="left" />
        </SplitterPanel>
        <SplitterResizeHandle class="w-0.5 bg-secondary hover:w-2" />
      </template>
      <SplitterPanel
        id="custom-group-main"
        :default-size="mainSize"
        class="px-20 bg-accented"
      >
        <UButton
          v-if="leftPanelRef?.isCollapsed"
          icon="i-lucide-chevron-right"
          size="md"
          color="primary"
          variant="solid"
          class="rounded-full"
          @click="leftPanelRef?.expand()"
        />

        <UButton
          v-else
          icon="i-lucide-chevron-left"
          size="md"
          color="primary"
          variant="solid"
          class="rounded-full"
          @click="leftPanelRef?.collapse()"
        />

        <UButton
          v-if="rightPanelRef?.isCollapsed"
          icon="i-lucide-chevron-left"
          size="md"
          color="primary"
          variant="solid"
          class="rounded-full"
          @click="rightPanelRef?.expand()"
        />

        <UButton
          v-else
          icon="i-lucide-chevron-right"
          size="md"
          color="primary"
          variant="solid"
          class="rounded-full"
          @click="rightPanelRef?.collapse()"
        />
        <slot name="main" />
      </SplitterPanel>
      <template v-if="$slots.right">
        <SplitterResizeHandle
          id="custom-group-right"
          class="w-0.5 bg-secondary hover:w-2"
        />

        <SplitterPanel
          ref="rightPanelRef"
          collapsible
          :collapsed-size="0"
          :min-size="0"
          :default-size="15"
          class="sticky top-[60px] bg-muted"
        >
          <slot name="right" />
        </SplitterPanel>
      </template>
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
const rightPanelRef =
  useTemplateRef<InstanceType<typeof SplitterPanel>>("rightPanelRef");
</script>
