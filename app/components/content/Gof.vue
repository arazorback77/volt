<template>
  <div class="custom-box">
    <h2>{{ title }}</h2>
    <p><slot /></p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.custom-box {
  border: 1px solid #333;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
}
</style>