<template>
  <UHeader
    :toggle="{
      color: 'primary',
      variant: 'subtle',
      class: 'rounded-full',
    }"
    toggle-side="left"
    mode="modal"
    :ui="{
      root: 'bg-default',
      container: 'px-4 max-w-full',
      left: 'lg:flex-1',
      right: 'px-4 ',
      title: 'lg:ps-4 gap-10',
    }"
  >
    <template #title>
      <FragmentHeaderUgaLogo />
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
  </UHeader>
</template>

<!-- Header for Template -->
<script setup lang="ts"></script>
