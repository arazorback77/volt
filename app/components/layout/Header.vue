<template>
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
</template>

<!-- Header for DashboardSidebar -->
<script setup lang="ts">
definePageMeta({});
const collapsed = ref(false);
const { isNotificationsSlideoverOpen } = useDashboard();
</script>
