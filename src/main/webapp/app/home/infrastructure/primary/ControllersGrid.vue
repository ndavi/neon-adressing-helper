<template>
  <div class="pa-4 full-height d-flex flex-column bg-surface">
    <v-text-field
      id="controllers-count"
      :model-value="controllersCount"
      label="Nombre de contrôleurs"
      type="number"
      min="0"
      variant="outlined"
      class="mb-4 flex-grow-0"
      @update:model-value="emit('update:controllers-count', +$event)"
    ></v-text-field>

    <div class="overflow-y-auto flex-grow-1 pr-2 controllers-grid">
      <div v-for="(controller, index) in controllers" :key="index" class="controller-card-wrapper">
        <ControllerCard
          :controller="controller"
          :index="index"
          @update:universe="emit('update:universe', { controllerIndex: index, universe: $event })"
          @update:outputs-count="emit('update:outputs-count', { controllerIndex: index, count: $event })"
          @add-bar="emit('add-bar', { controllerIndex: index, outputIndex: $event })"
          @remove-bar="emit('remove-bar', { controllerIndex: index, outputIndex: $event })"
          @toggle-bar="(outputIndex, barIndex) => emit('toggle-bar', { controllerIndex: index, outputIndex, barIndex })"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Controller } from '@/home/domain/Controller';
import ControllerCard from './ControllerCard.vue';

defineProps<{
  controllersCount: number;
  controllers: readonly Controller[];
}>();

const emit = defineEmits<{
  'update:controllers-count': [count: number];
  'update:universe': [payload: { controllerIndex: number; universe: number }];
  'update:outputs-count': [payload: { controllerIndex: number; count: number }];
  'add-bar': [payload: { controllerIndex: number; outputIndex: number }];
  'remove-bar': [payload: { controllerIndex: number; outputIndex: number }];
  'toggle-bar': [payload: { controllerIndex: number; outputIndex: number; barIndex: number }];
}>();
</script>

<style scoped>
.full-height {
  height: 100%;
}

.controllers-grid {
  container-type: inline-size;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-content: flex-start;
}

.controller-card-wrapper {
  width: 100%;
}

@container (min-width: 600px) {
  .controller-card-wrapper {
    width: calc(50% - 8px);
  }
}

@container (min-width: 900px) {
  .controller-card-wrapper {
    width: calc(33.333% - 11px);
  }
}

@container (min-width: 1200px) {
  .controller-card-wrapper {
    width: calc(25% - 12px);
  }
}
</style>
