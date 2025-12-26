<template>
  <div class="flex flex-col">
    <UDashboardGroup unit="rem" class="fixed top-0 flex flex-col">
      <LayoutHeader />
      <div
        class="flex min-h-[calc(100vh-var(--ui-header-height)-80px)] overflow-hidden"
      >
        <UDashboardSidebar
          id="default"
          v-model:collapsed="collapsed"
          collapsible
          resizable
          :toggle="{
            color: 'primary',
            variant: 'solid',
            class: 'rounded-full',
          }"
          toggle-side="right"
          :min-size="0"
          :collapsed-size="0"
          :default-size="25"
          :max-size="40"
          :ui="{
            root: 'min-w-0 bg-elevated mx-0 overflow-hidden lg:min-h-[calc(100vh-var(--g-sum-height))]  gap-4',
            body: 'mx-0 px-0 py-0 ',
            header:
              'mx-4  sticky top-0 border-b border-primary bg-elevated px-0 overflow-hidden',
            footer: 'h-15 mx-4 flex py-2 justify-center  px-0 overflow-hidden',
          }"
        >
          <template #header>
            <div class="flex flex-1">
              <UContentSearchButton
                :collapsed="false"
                :ui="{ base: 'flex-1' }"
              />
            </div>
          </template>
          <template #default>
            <slot name="left" />
          </template>
          <template #footer>
            <UButton class="w-full justify-center">Footer</UButton>
          </template>
        </UDashboardSidebar>

        <GSplitter ref="splitter-ref" :left-size="25" :right-size="45">
          <template #left> left </template>
          <template #main>KkKK </template>

          <template #right>QQQQ </template>
        </GSplitter>
      </div>
      <div class="h-(--g-foot-height) hidden lg:block">
        Footer
        <UButton
          v-if="splitterRef?.rightPanelRef?.isCollapsed"
          icon="i-lucide-chevron-right"
          size="md"
          color="primary"
          variant="solid"
          class="rounded-full"
          @click="splitterRef?.rightPanelRef?.expand()"
        />

        <UButton
          v-else
          icon="i-lucide-chevron-left"
          size="md"
          color="primary"
          variant="solid"
          class="rounded-full"
          @click="splitterRef?.rightPanelRef?.collapse()"
        />
      </div>
    </UDashboardGroup>
  </div>
</template>

<script setup lang="ts">
import GSplitter from "../layout/GSplitter.vue";

definePageMeta({});

const collapsed = ref(false);
// const rightCollapsed = ref(false);
// const { isNotificationsSlideoverOpen } = useDashboard();
// const splitterRef = useTemplateRef<InstanceType<typeof SplitterPanel>>("splitter-ref");
const splitterRef = useTemplateRef("splitter-ref");
console.log("splitterRef " + splitterRef.value?.rightPanelRef);
// const ggg = ref<InstanceType<typeof SplitterPanel>>("ggg");
</script>
