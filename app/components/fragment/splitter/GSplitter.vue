<template>
  <div class="w-full flex flex-row overflow-hidden">
    <SplitterGroup
      id="lmr-group"
      auto-save-id="gof-splitter2"
      direction="horizontal"
      class="h-full min-h-[calc(100vh-100px)]"
    >
      <template v-if="$slots.left">
        <SplitterPanel
          id="lmr-group-left"
          ref="leftPanelRef"
          collapsible
          :default-size="leftSize"
          :collapsed-size="0"
          :min-size="0"
          class="sticky top-[60px] h-[calc(100vh-88px)]"
        >
          <slot name="left" />
        </SplitterPanel>
        <SplitterResizeHandle class="w-0.5 bg-elevated hover:w-2" />
      </template>
      <SplitterPanel id="lmr-group-main" :default-size="mainSize" class="px-20">
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

        <UPopover>
          <UButton icon="i-lucide-plus" size="md" class="rounded-full" />

          <template #content>
            <FragmentHeaderCenter orientaion="vertical" />
          </template>
        </UPopover>

        <UButton
          v-if="rightPanelRef?.isCollapsed"
          icon="i-lucide-chevron-right"
          size="md"
          color="primary"
          variant="solid"
          class="rounded-full"
          @click="rightPanelRef?.expand()"
        />

        <UButton
          v-else
          icon="i-lucide-chevron-left"
          size="md"
          color="primary"
          variant="solid"
          class="rounded-full"
          @click="rightPanelRef?.collapse()"
        />
        <slot name="main" />
      </SplitterPanel>
      <template v-if="$slots.right">
        <SplitterResizeHandle class="w-0.5 bg-elevated hover:w-2" />

        <SplitterPanel
          id="lmr-group-right"
          ref="rightPanelRef"
          collapsible
          :collapsed-size="0"
          :min-size="0"
          :default-size="rightSize"
          class="sticky top-[60px] h-[calc(100vh-88px)]"
        >
          <slot name="right" />
        </SplitterPanel>
      </template>
    </SplitterGroup>
  </div>
</template>

<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui";

definePageMeta({});
const { leftSize = 25, rightSize = 15 } = defineProps<{
  leftSize?: number;
  rightSize?: number;
}>();

// const mainSize = ref(60);

// const mainSize = computed(() => {
//   if (slots.left) {
//     return 100 - (props.rightSize || 0);
//   } else if (slots.right) {
//     return 100 - (props.leftSize || 0);
//   } else {
//     return 100 - (props.leftSize || 0) - (props.rightSize || 0);
//   }
// });

const mainSize = computed(() => {
  return 100 - leftSize - rightSize;
});

// const mainSize = computed(() => {
//   if (!slots.left && slots.right) {
//     return 100;
//   } else if (!slots.right) {
//     return 100 - (props.leftSize || 0);
//   } else {
//     return 100 - (props.leftSize || 0) - (props.rightSize || 0);
//   }
// });

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
