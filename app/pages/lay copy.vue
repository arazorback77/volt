<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
// import Splitter from "@/components/volt/Splitter.vue";
import SplitterPanel from "primevue/splitterpanel";

definePageMeta({
  layout: "default",
});

const collapsed = ref(false);

const { isNotificationsSlideoverOpen } = useDashboard();

const { data } = await useAsyncData("navigation", () => {
  return queryCollectionNavigation("blog").order("title", "DESC");
});

const { data: files } = useLazyAsyncData(
  "search",
  () => queryCollectionSearchSections("blog"),
  {
    server: false,
  }
);
const links = [
  {
    label: "Docs",
    icon: "i-lucide-book",
    to: "/docs/getting-started",
  },
  {
    label: "Components",
    icon: "i-lucide-box",
    to: "/docs/components",
  },
  {
    label: "Showcase",
    icon: "i-lucide-presentation",
    to: "/showcase",
  },
];
const searchTerm = ref("");
const items = [
  [
    {
      label: "New mail",
      icon: "i-lucide-send",
      to: "/inbox",
    },
    {
      label: "New customer",
      icon: "i-lucide-user-plus",
      to: "/customers",
    },
  ],
] satisfies DropdownMenuItem[][];
</script>

<template>
  <UDashboardGroup class="flex flex-col" unit="rem">
    <UDashboardNavbar
      :toggle="{
        color: 'primary',
        variant: 'subtle',
        class: 'rounded-full',
      }"
      toggle-side="left"
      :ui="{ root: 'sm:pl-4 sm:pr-4', left: 'gap-1.5', right: 'gap-3' }"
      class="bg-(--g-head-bg)"
    >
      <!-- <template #left>left</template> -->
      <!-- <template #toggle>toggle</template> -->

      <template #leading>
        <LayoutTopLogo />
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
        <!-- <p class="text-lg font-semibold text-white">Volt</p> -->
        <LayoutTopCenter2 />
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

        <!-- <UDropdownMenu :items="items">
          <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
        </UDropdownMenu> -->
        <!-- <UColorModeSwitch /> -->
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
                // leadingIcon: 'text-(--gofhead)',
                // leadingIcon: 'text-(--ui-text)',
              }"
            />
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </template>
    </UDashboardNavbar>

    <div class="flex">
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
          root: 'min-w-0 bg-elevated/25',
          body: 'overflow-hidden px-0 py-2',
          header: 'bg-green-500',
          footer: 'lg:border-t lg:border-default',
        }"
      >
        <div class="flex flex-col gap-4 flex-1 overflow-y-auto px-4 py-2">
          <UContentSearchButton :collapsed="false" />
          <UContentNavigation
            :navigation="data"
            highlight
            color="primary"
            variant="pill"
            highlight-color="error"
          />

          <ClientOnly>
            <LazyUContentSearch
              v-model:search-term="searchTerm"
              :files="files"
              shortcut="meta_k"
              :navigation="data"
              :links="links"
              :fuse="{ resultLimit: 42 }"
            />
          </ClientOnly>
        </div>
        <!-- <template #footer>
          <p>sidebar Footer</p>
        </template> -->
      </UDashboardSidebar>

      <div class="w-full">
        <VoltSplitter
          style="height: 100%"
          class="mb-8"
          pt:root:class="dark:bg-(--ui-bg-elevated)/50"
        >
          <SplitterPanel class="flex items-center justify-start" :size="75">
            Pan1
            <VoltButton>Button</VoltButton>
            <VoltSecondaryButton>Secondary Button</VoltSecondaryButton>
            <VoltDangerButton>Danger Button</VoltDangerButton>
            <UButton>Button</UButton>
            <UButton color="primary">Primary Button</UButton>
            <UButton color="secondary">Secondary Button</UButton>
            <UButton color="gofbrand">gof amber Button</UButton>

            <UButton color="gofinvbrand">gofinv Button</UButton>
            <UButton color="gofhead">gofhead Button</UButton>

            <UButton color="success">Success Button</UButton>
            <UButton color="warning">Warning Button</UButton>
            <UButton color="info">Info Button</UButton>
            <UButton color="neutral">Neutral Button</UButton>
          </SplitterPanel>
          <SplitterPanel
            class="flex items-center justify-center"
            :size="25"
            :min-size="10"
          >
            Pan2
          </SplitterPanel>
        </VoltSplitter>
      </div>
    </div>
  </UDashboardGroup>
</template>
