<template>
  <div>
    <p>Two Layout Left</p>
    <div v-if="$slots.left">
      <slot name="left" />
    </div>

    <p>Two Layout Main</p>
    <div v-if="$slots.default">
      <slot />
    </div>
  </div>
</template>
