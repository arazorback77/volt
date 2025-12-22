<template>
  <UDashboardGroup unit="rem" class="fixed top-0 flex flex-col overflow-hidden">
    <UDashboardNavbar
      :toggle="{
        color: 'primary',
        variant: 'subtle',
        class: 'rounded-full',
      }"
      toggle-side="left"
      :ui="{
        root: 'bg-(--g-head-bg) sm:pl-4 sm:pr-4 sticky top-0 z-50',
        left: 'gap-1.5',
        right: 'gap-3',
      }"
    >
      <template #leading>
        <LayoutHeaderLogo />
        <UDashboardSidebarCollapse
          v-if="collapsed"
          icon="i-lucide-chevron-right"
          color="primary"
          variant="solid"
          size="md"
          class="rounded-full"
        />
        <UDashboardSidebarCollapse
          v-else
          icon="i-lucide-chevron-left"
          color="primary"
          variant="solid"
          size="md"
          class="rounded-full"
        />
      </template>
      <template #default>
        <LayoutHeaderCenter />
      </template>
      <template #right>
        <UTooltip text="Notifications" :shortcuts="['N']">
          <UButton
            color="neutral"
            variant="ghost"
            square
            @click="isNotificationsSlideoverOpen = true"
          >
            <UChip color="error" inset>
              <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
            </UChip>
          </UButton>
        </UTooltip>
        <UPopover class="lg:hidden">
          <UButton icon="i-lucide-plus" size="md" class="rounded-full" />

          <template #content>
            <LayoutTopCenter2 orientaion="vertical" />
          </template>
        </UPopover>

        <UColorModeButton
          color="primary"
          variant="solid"
          size="md"
          class="rounded-full"
        />
        <SignedOut>
          <SignInButton>
            <UButton
              icon="i-lucide-user"
              variant="solid"
              color="primary"
              size="md"
              class="rounded-full"
              :ui="{
                leadingIcon: 'text-(--ui-text)',
              }"
            />
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </template>
    </UDashboardNavbar>

    <div class="flex overflow-auto">
      <UDashboardSidebar
        id="default"
        v-model:collapsed="collapsed"
        collapsible
        resizable
        :min-size="0"
        :collapsed-size="0"
        :default-size="25"
        :max-size="40"
        :ui="{
          root: 'min-w-0 bg ',
          body: 'overflow-hidden px-0 py-2',
          header:
            'mb-2 sticky top-0 z-200 border-b border-primary bg overflow-hidden',
          footer: 'lg:border-t lg:border-default',
        }"
      >
        <template #header>
          <div>
            <UContentSearchButton :collapsed="false" />
          </div>
        </template>
        <slot name="left" />
      </UDashboardSidebar>

      <div class="w-full">
        <VoltSplitter pt:root:class="dark:bg-elevated/50 overflow-auto mb-0 ">
          <SplitterPanel :size="75">
            <slot name="main" />
          </SplitterPanel>
          <SplitterPanel :size="25" :min-size="10">
            <slot name="right" />
          </SplitterPanel>
        </VoltSplitter>
      </div>
    </div>
  </UDashboardGroup>
</template>

<script setup lang="ts">
import SplitterPanel from "primevue/splitterpanel";

definePageMeta({});

const collapsed = ref(false);

const { isNotificationsSlideoverOpen } = useDashboard();
</script>
