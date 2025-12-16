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
      class="bg-(--gofhead)"
    >
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
              size="md"
              class="rounded-full"
              :ui="{
                leadingIcon: 'text-(--gofhead)',
                // leadingIcon: 'text-(--ui-text)',
              }"
            />
          </SignInButton>
        </SignedOut>
        <SignedIn> <UserButton /> </SignedIn>
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
        class="bg-elevated/25"
        :ui="{
          root: 'min-w-0',
          body: 'overflow-hidden px-0 py-0',
          header: 'bg-green-500',
          footer: 'lg:border-t lg:border-default',
        }"
      >
        <div>
          <p>aaaa</p>
          <p>aaaa</p>
        </div>
      </UDashboardSidebar>

      <!-- <div class="w-full">
        <VoltSplitter style="height: 100%" class="mb-8">
          <SplitterPanel class="flex items-center justify-start" :size="75">
            Pan1
          </SplitterPanel>
          <SplitterPanel
            class="flex items-center justify-center"
            :size="25"
            :minSize="10"
          >
            Pan2
          </SplitterPanel>
        </VoltSplitter>
      </div> -->
    </div>
  </UDashboardGroup>
</template>
