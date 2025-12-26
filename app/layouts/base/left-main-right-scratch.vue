<template>
  <div class="flex flex-col">
    <FragmentHeader>
      <template #toggleButton>
        <div class="hidden lg:flex lg:h-12 lg:justify-center lg:items-center">
          <UButton
            v-if="leftPanelRef?.isCollapsed"
            icon="i-lucide-chevron-right"
            size="md"
            color="primary"
            variant="solid"
            class="rounded-full"
            @click.prevent="leftPanelRef?.expand()"
          />

          <UButton
            v-else
            icon="i-lucide-chevron-left"
            size="md"
            color="primary"
            variant="solid"
            class="rounded-full"
            @click.prevent="leftPanelRef?.collapse()"
          />
        </div>
      </template>
    </FragmentHeader>

    <div class="w-full overflow-hidden">
      <SplitterGroup
        id="custom-group"
        auto-save-id="gof-splitter2"
        direction="horizontal"
        class="h-full min-h-[calc(200vh-100px)]"
      >
        <template v-if="$slots.left">
          <SplitterPanel
            id="custom-group-left"
            ref="leftPanelRef"
            collapsible
            :default-size="25"
            :collapsed-size="0"
            :min-size="0"
            class="sticky top-[60px] h-[calc(100vh-88px)]"
          >
            <slot name="left" />
          </SplitterPanel>
          <SplitterResizeHandle class="w-0.5 bg-elevated hover:w-2" />
        </template>
        <SplitterPanel
          id="custom-group-main"
          :default-size="mainSize"
          class="px-20"
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
          <UPopover>
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />

            <template #content>
              <LayoutHeaderCenter orientaion="vertical" />
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
          <SplitterResizeHandle
            id="custom-group-right"
            class="w-0.5 bg-elevated hover:w-2"
          />

          <SplitterPanel
            ref="rightPanelRef"
            collapsible
            :collapsed-size="0"
            :min-size="0"
            :default-size="15"
            class="sticky top-[60px] h-[calc(100vh-88px)]"
          >
            <slot name="right" />
          </SplitterPanel>
        </template>
      </SplitterGroup>
    </div>

    <div class="h-(--g-foot-height) hidden lg:block">Footer</div>
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
