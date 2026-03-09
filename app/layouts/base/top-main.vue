<template>
  <div id="top-main-layout-wrapper" class="flex flex-col min-h-screen">
    <FragmentHeader id="fragment-header" />

    <div
      class="w-full flex-auto min-h-[calc(200dvh-var(--ui-header-height)-var(--g-foot-height))] overflow-y-auto overscroll-none bg-amber-800"
    >
      <slot name="main" />
    </div>

    <div class="h-(--g-foot-height) hidden lg:block">Footer</div>

    <!-- <div
      class="h-20 bg-muted flex items-center justify-center border-2 border-secondary px-10"
    >
      <div
        class="flex-1 flex justify-center bg-accented w-full h-12 items-center"
      >
        Footer Section of Layout
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts"></script>
