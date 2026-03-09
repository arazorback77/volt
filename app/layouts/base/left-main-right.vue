<template>
  <div class="flex flex-col">
    <FragmentHeader>
      <template v-if="$slots.left" #toggleButton>
        <div class="hidden lg:flex lg:h-12 lg:justify-center lg:items-center">
          <UButton
            v-if="splitterRef?.leftPanelRef?.isCollapsed"
            icon="i-lucide-chevron-right"
            size="md"
            color="primary"
            variant="solid"
            class="rounded-full"
            @click.prevent="splitterRef?.leftPanelRef?.expand()"
          />

          <UButton
            v-else
            icon="i-lucide-chevron-left"
            size="md"
            color="primary"
            variant="solid"
            class="rounded-full"
            @click.prevent="splitterRef?.leftPanelRef?.collapse()"
          />
        </div>
      </template>
    </FragmentHeader>

    <div class="w-full overflow-hidden">
      <FragmentSplitterGFlat ref="splitterRef" :left-size="25" :right-size="15">
        <template v-if="$slots.left" #left>
          <slot name="left" />
        </template>
        <template #main>
          <slot name="main" />
        </template>
        <template v-if="$slots.right" #right>
          <slot name="right" />
        </template>
      </FragmentSplitterGFlat>
    </div>

    <div class="h-(--g-foot-height) hidden lg:block">Footer</div>

    <!-- <div
      class="h-20 bg-muted flex items-center justify-center border-2 border-secondary px-10"
    >
      <div
        class="flex-1 flex justify-center bg-accented w-full h-12 items-center"
      >
        Footer Section of Layout
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import FragmentSplitterGFlat from "~/components/fragment/splitter/GFlat.vue";

const splitterRef =
  useTemplateRef<InstanceType<typeof FragmentSplitterGFlat>>("splitterRef");
</script>
