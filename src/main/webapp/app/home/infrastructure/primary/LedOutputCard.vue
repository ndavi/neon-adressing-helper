<template>
  <v-card variant="flat" border class="mb-2">
    <v-card-text class="d-flex align-center py-2">
      <span class="text-subtitle-2">Sortie {{ index + 1 }}</span>
      <v-spacer></v-spacer>
      <span class="text-caption mr-2">{{ output.bars.length }} barres</span>
      <v-btn icon="mdi-minus" size="x-small" variant="text" data-selector="remove-bar-button" @click="emit('remove-bar')"></v-btn>
      <v-btn icon="mdi-plus" size="x-small" variant="text" data-selector="add-bar-button" @click="emit('add-bar')"></v-btn>
    </v-card-text>

    <div class="d-flex flex-wrap gap-1 px-2 pb-2">
      <div
        v-for="(bar, i) in output.bars"
        :key="i"
        class="mr-1 mb-1 rounded cursor-pointer"
        data-selector="led-bar"
        :class="getBarClass(bar)"
        :style="getBarStyle(bar)"
        :title="`Barre ${i + 1} (${bar.type})`"
        @click="emit('toggle-bar', i)"
      ></div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { Bar, LedOutput } from '@/home/domain/LedOutput';
import type { CSSProperties } from 'vue';

defineProps<{
  output: LedOutput;
  index: number;
}>();

const emit = defineEmits<{
  'add-bar': [];
  'remove-bar': [];
  'toggle-bar': [index: number];
}>();

const getBarStyle = (bar: Bar): CSSProperties => {
  return {
    width: bar.type === '2M' ? '48px' : '24px',
    height: '24px',
  };
};

const getBarClass = (bar: Bar): string => {
  return bar.type === '2M' ? 'bg-cyan-lighten-3' : 'bg-purple-lighten-3';
};
</script>
