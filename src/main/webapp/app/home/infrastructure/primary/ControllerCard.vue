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
      <v-btn
        icon="mdi-delete"
        variant="text"
        density="comfortable"
        color="error"
        data-selector="delete-controller"
        @click="emit('delete')"
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
        @update:model-value="updateUniverse(+$event)"
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
        @update:model-value="updateOutputsCount(+$event)"
      ></v-text-field>

      <div class="outputs-list mt-4 text-left">
        <LedOutputCard
          v-for="(output, outputIndex) in controller.outputs"
          :key="outputIndex"
          :output="output"
          :index="outputIndex"
          :is-deletable="controller.outputs.length > 1"
          @add-bar="addBar(outputIndex)"
          @remove-bar="removeBar(outputIndex)"
          @toggle-bar="toggleBar(outputIndex, $event)"
          @duplicate="duplicateOutput(outputIndex)"
          @delete="deleteOutput(outputIndex)"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Controller } from '@/home/domain/Controller';
import LedOutputCard from './LedOutputCard.vue';

const props = defineProps<{
  controller: Controller;
  index: number;
}>();

const emit = defineEmits<{
  'update:controller': [controller: Controller];
  duplicate: [];
  delete: [];
}>();

const updateUniverse = (newUniverse: number) => {
  if (newUniverse >= 0) {
    emit('update:controller', props.controller.withUniverse(newUniverse));
  }
};

const updateOutputsCount = (newCount: number) => {
  if (newCount >= 0 && newCount <= 8) {
    emit('update:controller', props.controller.resizeOutputs(newCount));
  }
};

const addBar = (outputIndex: number) => {
  const output = props.controller.outputs[outputIndex];
  if (output) {
    emit('update:controller', props.controller.replaceOutput(outputIndex, output.addBar()));
  }
};

const removeBar = (outputIndex: number) => {
  const output = props.controller.outputs[outputIndex];
  if (output) {
    emit('update:controller', props.controller.replaceOutput(outputIndex, output.removeBar()));
  }
};

const toggleBar = (outputIndex: number, barIndex: number) => {
  const output = props.controller.outputs[outputIndex];
  if (output) {
    emit('update:controller', props.controller.replaceOutput(outputIndex, output.toggleBar(barIndex)));
  }
};

const duplicateOutput = (outputIndex: number) => {
  emit('update:controller', props.controller.duplicateOutput(outputIndex));
};

const deleteOutput = (outputIndex: number) => {
  emit('update:controller', props.controller.removeOutput(outputIndex));
};
</script>
