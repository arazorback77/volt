<template>
  <div class="min-h-screen flex flex-col">
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
      <SplitterResizeHandle
        id="custom-group-lefthandle"
        class="w-1 bg-secondary hover:w-2"
      />

      <SplitterPanel id="custom-group-main" :min-size="20" :default-size="60">
        <SplitterGroup
          id="custom-sub-subgroup"
          auto-save-id="gof-splitter4"
          direction="vertical"
        >
          <SplitterPanel
            id="custom-sub-subgroup-main"
            :default-size="85"
            class="bg-muted flex flex-col px-10 pb-10"
          >
            <div class="flex justify-center bg-muted">
              Main Section of Layout
            </div>
            <slot name="main" />
          </SplitterPanel>

          <SplitterResizeHandle
            id="custom-sub-subgroup-handle"
            class="h-1 bg-secondary hover:h-2"
          />

          <SplitterPanel
            id="custom-sub-subgroup-footer"
            ref="bottomPanelRef"
            collapsible
            :collapsed-size="0"
            :min-size="0"
            :default-size="15"
            class="bg-muted flex flex-col px-10 pb-10"
          >
            <div class="flex justify-center bg-muted">
              Footer Section of Layout
            </div>
            <slot name="footer" />
          </SplitterPanel>
        </SplitterGroup>
      </SplitterPanel>
      <SplitterResizeHandle
        id="custom-subgroup-handle"
        class="w-1 bg-secondary hover:w-2"
      />
      <SplitterPanel
        id="custom-sub-subgroup-right"
        ref="rightPanelRef"
        collapsible
        :default-size="25"
        class="bg-muted flex flex-col px-10 pb-10"
      >
        <div class="flex justify-center bg-muted">Right Section of Layout</div>
        <slot name="right" />
      </SplitterPanel>
    </SplitterGroup>
  </div>
</template>

<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui";

// const slots = useSlots();

const leftPanelRef =
  useTemplateRef<InstanceType<typeof SplitterPanel>>("leftPanelRef");
const rightPanelRef =
  useTemplateRef<InstanceType<typeof SplitterPanel>>("rightPanelRef");
const bottomPanelRef =
  useTemplateRef<InstanceType<typeof SplitterPanel>>("bottomPanelRef");
</script>
