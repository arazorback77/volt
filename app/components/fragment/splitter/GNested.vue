<template>
  <SplitterGroup
    id="lmbr-group"
    auto-save-id="gof-splitter2"
    direction="horizontal"
    class="min-h-[calc(100dvh-var(--ui-header-height)-var(--g-foot-height))]"
  >
    <template v-if="$slots.left">
      <SplitterPanel
        id="lmbr-group-left"
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
        id="lmbr-group-lefthandle"
        class="w-0.5 hover:bg-secondary hover:w-2"
      />
    </template>
    <SplitterPanel id="lmbr-group-main" :default-size="mainSize">
      <SplitterGroup
        id="lmbr-subgroup"
        auto-save-id="gof-splitter3"
        direction="vertical"
      >
        <SplitterPanel
          id="lmbr-subgroup-main"
          :min-size="20"
          :default-size="75"
        >
          <SplitterGroup
            id="lmbr-sub-subgroup"
            auto-save-id="gof-splitter4"
            direction="horizontal"
          >
            <SplitterPanel
              id="lmbr-sub-subgroup-main"
              :default-size="85"
              class="bg-muted flex flex-col px-10 pb-10"
            >
              <slot name="main" />
            </SplitterPanel>
            <template v-if="$slots.right">
              <SplitterResizeHandle
                id="lmbr-sub-subgroup-handle"
                class="w-0.5 hover:bg-secondary hover:w-2"
              />
              <SplitterPanel
                id="lmbr-sub-subgroup-right"
                ref="rightPanelRef"
                collapsible
                :default-size="15"
                class="bg-muted flex flex-col px-0 pb-10"
              >
                <slot name="right" />
              </SplitterPanel>
            </template>
          </SplitterGroup>
        </SplitterPanel>

        <template v-if="$slots.bottom">
          <SplitterResizeHandle
            id="lmbr-subgroup-handle"
            class="h-0.5 hover:bg-secondary hover:h-2"
          />
          <SplitterPanel
            id="lmbr-sub-subgroup-bottom"
            ref="bottomPanelRef"
            collapsible
            :collapsed-size="0"
            :min-size="0"
            :default-size="15"
            class="bg-muted flex flex-col px-10 pb-10"
          >
            <slot name="bottom" />
          </SplitterPanel>
        </template>
      </SplitterGroup>
    </SplitterPanel>
  </SplitterGroup>
</template>

<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui";
definePageMeta({});

const { leftSize = 25, rightSize = 15 } = defineProps<{
  leftSize?: number;
  rightSize?: number;
}>();

const mainSize = computed(() => {
  return 100 - leftSize - rightSize;
});

const leftPanelRef =
  useTemplateRef<InstanceType<typeof SplitterPanel>>("leftPanelRef");
const rightPanelRef =
  useTemplateRef<InstanceType<typeof SplitterPanel>>("rightPanelRef");

defineExpose({
  leftPanelRef,
  rightPanelRef,
});
</script>
