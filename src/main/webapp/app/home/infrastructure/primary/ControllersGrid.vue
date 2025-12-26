<template>
  <div class="pa-4 full-height d-flex flex-column bg-surface">
    <v-text-field
      id="controllers-count"
      v-model.number="controllersCount"
      label="Nombre de contrôleurs"
      type="number"
      min="0"
      variant="outlined"
      class="mb-4 flex-grow-0"
    ></v-text-field>

    <div class="overflow-y-auto flex-grow-1 pr-2 controllers-grid">
      <div v-for="(controller, index) in controllers.values" :key="index" class="controller-card-wrapper">
        <ControllerCard
          :controller="controller"
          :index="index"
          @update:universe="updateUniverse(index, $event)"
          @update:outputs-count="updateOutputsCount(index, $event)"
          @add-bar="addBar(index, $event)"
          @remove-bar="removeBar(index, $event)"
          @toggle-bar="(outputIndex, barIndex) => toggleBar(index, outputIndex, barIndex)"
          @duplicate="duplicateController(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Controllers } from '@/home/domain/Controllers';
import { computed } from 'vue';
import ControllerCard from './ControllerCard.vue';

const props = defineProps<{
  controllers: Controllers;
}>();

const emit = defineEmits<{
  'update:controllers': [controllers: Controllers];
}>();

const controllersCount = computed({
  get: () => props.controllers.values.length,
  set: (newCount: number) => {
    emit('update:controllers', props.controllers.resize(newCount));
  },
});

const updateUniverse = (index: number, newUniverse: number) => {
  const current = props.controllers.values[index];
  if (current && newUniverse >= 0) {
    emit('update:controllers', props.controllers.replace(index, current.withUniverse(newUniverse)));
  }
};

const updateOutputsCount = (index: number, newCount: number) => {
  const current = props.controllers.values[index];
  if (current && newCount >= 0 && newCount <= 8) {
    emit('update:controllers', props.controllers.replace(index, current.resizeOutputs(newCount)));
  }
};

const addBar = (controllerIndex: number, outputIndex: number) => {
  const controller = props.controllers.values[controllerIndex];
  if (controller) {
    const output = controller.outputs[outputIndex];
    if (output) {
      emit('update:controllers', props.controllers.replace(controllerIndex, controller.replaceOutput(outputIndex, output.addBar())));
    }
  }
};

const removeBar = (controllerIndex: number, outputIndex: number) => {
  const controller = props.controllers.values[controllerIndex];
  if (controller) {
    const output = controller.outputs[outputIndex];
    if (output) {
      emit('update:controllers', props.controllers.replace(controllerIndex, controller.replaceOutput(outputIndex, output.removeBar())));
    }
  }
};

const toggleBar = (controllerIndex: number, outputIndex: number, barIndex: number) => {
  const controller = props.controllers.values[controllerIndex];
  if (controller) {
    const output = controller.outputs[outputIndex];
    if (output) {
      emit(
        'update:controllers',
        props.controllers.replace(controllerIndex, controller.replaceOutput(outputIndex, output.toggleBar(barIndex))),
      );
    }
  }
};

const duplicateController = (index: number) => {
  emit('update:controllers', props.controllers.duplicate(index));
};
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
