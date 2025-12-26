<template>
  <UDashboardNavbar
    :toggle="{
      color: 'primary',
      variant: 'subtle',
      class: 'rounded-full',
    }"
    toggle-side="left"
    class="mx-0"
    :ui="{
      root: 'bg-(--g-head-bg) sm:pl-4 sm:pr-4 lg:mx-10',
      left: 'gap-1.5',
      right: 'gap-1.5 lg:gap-3',
    }"
  >
    <template #leading>
      <FragmentHeaderLogo />

      <slot name="toggleButton" />
    </template>
    <template #default>
      <FragmentHeaderCenter />
    </template>
    <template #right>
      <UPopover class="lg:hidden">
        <UButton icon="i-lucide-plus" size="md" class="rounded-full" />

        <template #content>
          <FragmentHeaderCenter orientaion="vertical" />
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
<script setup lang="ts"></script>
