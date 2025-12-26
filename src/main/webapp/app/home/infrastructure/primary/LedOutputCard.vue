<template>
  <v-card variant="flat" border class="mb-2">
    <v-card-text class="d-flex align-center py-2">
      <span class="text-subtitle-2">Sortie {{ index + 1 }}</span>
      <v-spacer></v-spacer>
      <span class="text-caption mr-2">{{ output.bars.length }} barres</span>
      <v-btn icon="mdi-plus" size="x-small" variant="text" @click="emit('add-bar')"></v-btn>
    </v-card-text>
    <div v-if="output.bars.length > 0" class="d-flex px-4 pb-2 flex-wrap">
      <div
        v-for="(bar, i) in output.bars"
        :key="i"
        class="bg-cyan-lighten-3 mr-1 mb-1 rounded"
        style="width: 20px; height: 10px"
        :title="`Barre ${i + 1}`"
      ></div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { LedOutput } from '@/home/domain/LedOutput';

defineProps<{
  output: LedOutput;
  index: number;
}>();

const emit = defineEmits<{
  'add-bar': [];
}>();
</script>
