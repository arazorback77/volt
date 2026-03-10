<template>
  <div class="flex flex-col gap-2 p-3 border border-primary/30 rounded-lg bg-elevated/50">
    <div class="text-xs text-muted italic line-clamp-2 px-1">
      "{{ selectedText }}"
    </div>
    <UTextarea
      v-model="body"
      :rows="3"
      autofocus
      placeholder="코멘트를 입력하세요..."
      class="text-sm"
    />
    <div class="flex justify-end gap-2">
      <UButton size="xs" color="neutral" variant="ghost" @click="emit('cancel')">
        취소
      </UButton>
      <UButton
        size="xs"
        color="primary"
        :disabled="!body.trim()"
        :loading="saving"
        @click="handleSave"
      >
        저장
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  selectedText: string;
  saving?: boolean;
}>();

const emit = defineEmits<{
  save: [body: string];
  cancel: [];
}>();

const body = ref("");

function handleSave() {
  if (!body.value.trim()) return;
  emit("save", body.value.trim());
  body.value = "";
}
</script>
