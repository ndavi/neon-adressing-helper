<template>
  <v-card variant="flat" border class="mb-2" data-selector="led-output-card">
    <v-card-text class="d-flex align-center py-2">
      <span class="text-subtitle-2">Sortie {{ index + 1 }}</span>
      <v-spacer></v-spacer>
      <span class="text-label-small text-grey-darken-1 mr-2">{{ output.bars.length }} barres</span>
      <v-btn
        icon="mdi-content-copy"
        size="x-small"
        variant="text"
        :disabled="!isDuplicatable"
        data-selector="duplicate-output"
        @click="emit('duplicate')"
      ></v-btn>
      <v-btn
        icon="mdi-delete"
        size="x-small"
        variant="text"
        color="error"
        :disabled="!isDeletable"
        data-selector="delete-output"
        @click="emit('delete')"
      ></v-btn>
      <v-btn
        icon="mdi-minus"
        size="x-small"
        variant="text"
        :disabled="output.bars.length <= 1"
        data-selector="remove-bar-button"
        @click="emit('remove-bar')"
      ></v-btn>
      <v-btn icon="mdi-plus" size="x-small" variant="text" data-selector="add-bar-button" @click="emit('add-bar')"></v-btn>
    </v-card-text>

    <div class="d-flex flex-wrap gap-1 px-2 pb-2">
      <v-menu v-for="(bar, i) in output.bars" :key="i">
        <template #activator="{ props: menuProps }">
          <div v-bind="menuProps" class="bar-container mr-1 mb-1 rounded cursor-pointer" data-selector="led-bar" :title="bar.name">
            <div
              v-for="(segment, si) in bar.segments"
              :key="si"
              class="bar-segment"
              :class="getSegmentClass(segment)"
              :style="getSegmentStyle(segment)"
            ></div>
          </div>
        </template>
        <v-list density="compact" data-selector="bar-type-menu">
          <v-list-item title="1M" data-selector="bar-option-1M" @click="emit('replace-bar', i, OutputBar.atomic('1M'))"></v-list-item>
          <v-list-item title="2M" data-selector="bar-option-2M" @click="emit('replace-bar', i, OutputBar.atomic('2M'))"></v-list-item>
          <v-divider v-if="catalogBars.length > 0"></v-divider>
          <v-list-item
            v-for="(catalogBar, ci) in catalogBars"
            :key="ci"
            :title="catalogBar.name"
            :data-selector="`bar-option-${catalogBar.name}`"
            @click="emit('replace-bar', i, catalogBar)"
          ></v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { Bar, LedOutput } from '@/home/domain/LedOutput';
import { OutputBar } from '@/home/domain/OutputBar';
import type { CSSProperties } from 'vue';

defineProps<{
  output: LedOutput;
  index: number;
  isDeletable: boolean;
  isDuplicatable: boolean;
  catalogBars: readonly OutputBar[];
}>();

const emit = defineEmits<{
  'add-bar': [];
  'remove-bar': [];
  'replace-bar': [index: number, bar: OutputBar];
  duplicate: [];
  delete: [];
}>();

const getSegmentStyle = (segment: Bar): CSSProperties => {
  return {
    width: segment.type === '2M' ? '48px' : '24px',
    height: '24px',
  };
};

const getSegmentClass = (segment: Bar): string => {
  return segment.type === '2M' ? 'bg-cyan-lighten-3' : 'bg-purple-lighten-3';
};
</script>

<style scoped>
.bar-container {
  display: flex;
  border: 1px solid transparent;
}

.bar-container:hover {
  border-color: rgba(0, 0, 0, 0.3);
}

.bar-segment {
  border-radius: 2px;
}
</style>
