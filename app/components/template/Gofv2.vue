<template>
  <div class="flex flex-col">
    <UDashboardGroup unit="rem" class="fixed top-0 flex flex-col">
      <UDashboardNavbar
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
              <LayoutHeaderCenter orientaion="vertical" />
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

        <GSplitter :right-size="45">
          <!-- <template #left> left </template> -->
          <template #main>KkKK </template>

          <template #right>QQQQ </template>
        </GSplitter>
      </div>
      <div class="h-(--g-foot-height) hidden lg:block">Footer</div>
    </UDashboardGroup>
  </div>
</template>

<script setup lang="ts">
import GSplitter from "../layout/GSplitter.vue";

definePageMeta({});

const collapsed = ref(false);
// const rightCollapsed = ref(false);

const { isNotificationsSlideoverOpen } = useDashboard();
</script>
