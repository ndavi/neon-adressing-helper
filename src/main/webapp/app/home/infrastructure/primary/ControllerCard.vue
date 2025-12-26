<template>
  <v-card class="controller-card" variant="outlined" data-selector="controller-card">
    <v-card-title class="d-flex align-center">
      Contrôleur {{ index + 1 }}
      <v-spacer></v-spacer>
      <v-btn
        icon="mdi-content-copy"
        variant="text"
        density="comfortable"
        data-selector="duplicate-controller"
        @click="emit('duplicate')"
      ></v-btn>
    </v-card-title>
    <v-card-text>
      <v-text-field
        :model-value="controller.universe"
        label="Univers de départ"
        type="number"
        min="0"
        variant="outlined"
        hide-details="auto"
        class="mb-3"
        @update:model-value="emit('update:universe', +$event)"
      ></v-text-field>
      <v-text-field
        :model-value="controller.outputs.length"
        label="Nombre de sorties"
        type="number"
        min="0"
        max="8"
        variant="outlined"
        hide-details="auto"
        class="mb-3"
        @update:model-value="emit('update:outputs-count', +$event)"
      ></v-text-field>

      <div class="outputs-list mt-4 text-left">
        <LedOutputCard
          v-for="(output, outputIndex) in controller.outputs"
          :key="outputIndex"
          :output="output"
          :index="outputIndex"
          @add-bar="emit('add-bar', outputIndex)"
          @remove-bar="emit('remove-bar', outputIndex)"
          @toggle-bar="emit('toggle-bar', outputIndex, $event)"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Controller } from '@/home/domain/Controller';
import LedOutputCard from './LedOutputCard.vue';

defineProps<{
  controller: Controller;
  index: number;
}>();

const emit = defineEmits<{
  'update:universe': [universe: number];
  'update:outputs-count': [count: number];
  'add-bar': [outputIndex: number];
  'remove-bar': [outputIndex: number];
  'toggle-bar': [outputIndex: number, barIndex: number];
  duplicate: [];
}>();
</script>
