<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items: NavigationMenuItem[] = [
  {
    label: "Home",
    icon: "i-lucide-house",
    active: true,
  },
  {
    label: "Inbox",
    icon: "i-lucide-inbox",
  },
  {
    label: "Contacts",
    icon: "i-lucide-users",
  },
];
</script>

<template>
  <div class="flex flex-row h-50 gap-10">
    <div class="flex flex-col w-1/2">
      aasdfas

      <UDashboardGroup class="flex flex-row relative">
        <UDashboardSidebar
          collapsible
          resizable
          toggle-side="left"
          open
          :toggle="{
            color: 'primary',
            variant: 'subtle',
            class: 'rounded-full',
          }"
        >
          <template #header>
            <UIcon
              name="i-simple-icons-nuxtdotjs"
              class="size-5 text-primary mx-auto"
            />
          </template>

          <UNavigationMenu :items="items" orientation="vertical" />
        </UDashboardSidebar>
        <UDashboardPanel>
          <template #header>
            <UDashboardNavbar
              title="Dashboard"
              :toggle="{
                color: 'primary',
                variant: 'subtle',
                class: 'rounded-full',
              }"
            />
          </template>
        </UDashboardPanel>
      </UDashboardGroup>
    </div>

    <div class="flex flex-col w-1/2">
      <div>adfasdfasdfasdfasdf</div>

      <UDashboardSidebar
        id="right"
        collapsible
        resizable
        toggle-side="right"
        open
        :toggle="{
          color: 'primary',
          variant: 'subtle',
          class: 'rounded-full',
        }"
      >
        <template #header>
          <UIcon
            name="i-simple-icons-nuxtdotjs"
            class="size-5 text-primary mx-auto"
          />
        </template>

        <UNavigationMenu :items="items" orientation="vertical" />
      </UDashboardSidebar>
      <UDashboardPanel>
        <template #header>
          <UDashboardNavbar
            title="Dashboard"
            :toggle="{
              color: 'primary',
              variant: 'subtle',
              class: 'rounded-full',
            }"
          />
        </template>
      </UDashboardPanel>
    </div>
  </div>
</template>
