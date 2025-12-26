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

        <div class="w-full flex flex-row overflow-hidden">
          <SplitterGroup
            auto-save-id="gof-splitter"
            direction="horizontal"
            class="h-full min-h-[calc(200vh-100px)] !overflow-visible"
          >
            <SplitterPanel
              ref="panelRef"
              collapsible
              :default-size="20"
              :collapsed-size="0"
              :min-size="0"
              class="sticky top-[60px] h-[calc(100vh-88px)]"
            >
              aaaaa
            </SplitterPanel>
            <SplitterResizeHandle class="w-0.5 bg-elevated hover:w-2" />
            <SplitterPanel :default-size="65" class="px-20">
              asdfasdfasdfas

              <UButton
                v-if="panelRef?.isCollapsed"
                icon="i-lucide-chevron-right"
                size="md"
                color="primary"
                variant="solid"
                class="rounded-full"
                @click="panelRef?.expand()"
              />

              <UButton
                v-else
                icon="i-lucide-chevron-left"
                size="md"
                color="primary"
                variant="solid"
                class="rounded-full"
                @click="panelRef?.collapse()"
              />

              <UPopover>
                <UButton icon="i-lucide-plus" size="md" class="rounded-full" />

                <template #content>
                  <LayoutHeaderCenter orientaion="vertical" />
                </template>
              </UPopover>

              <UButton
                v-if="panelRefRight?.isCollapsed"
                icon="i-lucide-chevron-right"
                size="md"
                color="primary"
                variant="solid"
                class="rounded-full"
                @click="panelRefRight?.expand()"
              />

              <UButton
                v-else
                icon="i-lucide-chevron-left"
                size="md"
                color="primary"
                variant="solid"
                class="rounded-full"
                @click="panelRefRight?.collapse()"
              />
            </SplitterPanel>
            <SplitterResizeHandle class="w-0.5 bg-elevated hover:w-2" />

            <SplitterPanel
              ref="panelRefRight"
              collapsible
              :collapsed-size="0"
              :min-size="0"
              :default-size="15"
              class="sticky top-[60px] h-[calc(100vh-88px)]"
            >
              Right
            </SplitterPanel>
          </SplitterGroup>
        </div>
      </div>
      <div class="h-(--g-foot-height) hidden lg:block">Footer</div>
    </UDashboardGroup>
  </div>
</template>

<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui";

definePageMeta({});

const panelRef = ref<InstanceType<typeof SplitterPanel>>();
const panelRefRight = ref<InstanceType<typeof SplitterPanel>>();
const collapsed = ref(false);
// const rightCollapsed = ref(false);

const { isNotificationsSlideoverOpen } = useDashboard();
</script>
