<template>
  <div class="min-h-screen flex flex-col">
    <FragmentHead />
    <SplitterGroup
      id="doc-group"
      auto-save-id="doc-splitter-outer"
      direction="horizontal"
      class="min-h-[calc(100dvh-80px)]"
    >
      <!-- Outer Left: Navigation (collapsible) -->
      <SplitterPanel
        id="doc-group-left"
        ref="leftPanelRef"
        collapsible
        :default-size="20"
        :collapsed-size="0"
        :min-size="0"
        class="flex flex-col"
      >
        <slot name="left" />
      </SplitterPanel>
      <SplitterResizeHandle
        id="doc-group-lefthandle"
        class="relative w-[9px] flex items-center justify-center cursor-col-resize group"
      >
        <div class="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-muted group-hover:bg-primary/40 transition-colors" />
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[7px] h-6 rounded-full border border-muted bg-background group-hover:border-primary/60 transition-colors" />
      </SplitterResizeHandle>

      <!-- Main area: vertical split (content + footer) -->
      <SplitterPanel id="doc-group-main" :min-size="20" :default-size="80">
        <SplitterGroup
          id="doc-subgroup-v"
          auto-save-id="doc-splitter-vertical"
          direction="vertical"
        >
          <!-- Top: horizontal split (TOC | Main | Right) -->
          <SplitterPanel
            id="doc-subgroup-top"
            :min-size="20"
            :default-size="85"
          >
            <SplitterGroup
              id="doc-subgroup-h"
              auto-save-id="doc-splitter-inner"
              direction="horizontal"
              class="h-full"
            >
              <!-- TOC panel -->
              <SplitterPanel
                id="doc-subgroup-toc"
                ref="tocPanelRef"
                collapsible
                :default-size="20"
                :collapsed-size="0"
                :min-size="0"
                class="flex flex-col overflow-y-auto"
              >
                <slot name="toc" />
              </SplitterPanel>

              <SplitterResizeHandle
                id="doc-subgroup-tochandle"
                class="relative w-[9px] flex items-center justify-center cursor-col-resize group"
              >
                <div class="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-muted/50 group-hover:bg-primary/30 transition-colors" />
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[7px] h-6 rounded-full border border-muted/60 bg-background group-hover:border-primary/60 transition-colors" />
              </SplitterResizeHandle>

              <!-- Main content -->
              <SplitterPanel
                id="doc-subgroup-main"
                :default-size="65"
                :min-size="20"
                class="flex flex-col overflow-y-auto"
              >
                <slot name="main" />
              </SplitterPanel>

              <SplitterResizeHandle
                id="doc-subgroup-righthandle"
                class="relative w-[9px] flex items-center justify-center cursor-col-resize group"
              >
                <div class="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-muted/50 group-hover:bg-primary/30 transition-colors" />
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[7px] h-6 rounded-full border border-muted/60 bg-background group-hover:border-primary/60 transition-colors" />
              </SplitterResizeHandle>

              <!-- Right: Comments (collapsible) -->
              <SplitterPanel
                id="doc-subgroup-right"
                ref="rightPanelRef"
                collapsible
                :default-size="15"
                :collapsed-size="0"
                :min-size="0"
                class="flex flex-col overflow-y-auto"
              >
                <slot name="right" />
              </SplitterPanel>
            </SplitterGroup>
          </SplitterPanel>

          <SplitterResizeHandle
            id="doc-subgroup-footerhandle"
            class="relative h-[9px] flex items-center justify-center cursor-row-resize group"
          >
            <div class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-muted group-hover:bg-primary/40 transition-colors" />
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[7px] w-6 rounded-full border border-muted bg-background group-hover:border-primary/60 transition-colors" />
          </SplitterResizeHandle>

          <!-- Footer (collapsible) -->
          <SplitterPanel
            id="doc-subgroup-footer"
            ref="bottomPanelRef"
            collapsible
            :collapsed-size="0"
            :min-size="0"
            :default-size="15"
            class="flex flex-col"
          >
            <slot name="footer" />
          </SplitterPanel>
        </SplitterGroup>
      </SplitterPanel>
    </SplitterGroup>
  </div>
</template>

<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui";

const leftPanelRef =
  useTemplateRef<InstanceType<typeof SplitterPanel>>("leftPanelRef");
const tocPanelRef =
  useTemplateRef<InstanceType<typeof SplitterPanel>>("tocPanelRef");
const rightPanelRef =
  useTemplateRef<InstanceType<typeof SplitterPanel>>("rightPanelRef");
const bottomPanelRef =
  useTemplateRef<InstanceType<typeof SplitterPanel>>("bottomPanelRef");

defineExpose({ leftPanelRef, tocPanelRef, rightPanelRef, bottomPanelRef });
</script>
