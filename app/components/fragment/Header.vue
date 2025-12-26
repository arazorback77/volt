<template>
  <UHeader>
    <template #title>
      <LayoutHeaderLogo />
      <div id="togglePanel"></div>

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
    </template>
    <template #default>
      <LayoutHeaderCenter />
    </template>
    <template #right>
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
  </UHeader>
</template>

<!-- Header for Template -->
<script setup lang="ts">
import { SplitterPanel } from "reka-ui";

const { lef: leftPanelRef } = defineProps({
  lef: {
    type: SplitterPanel,
    required: false,
  },
});

// const leftPanelRef = ref(props.lef);
</script>
