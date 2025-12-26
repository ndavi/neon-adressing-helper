<template>
  <v-container fluid class="full-height align-start">
    <v-row class="full-height">
      <!-- Left Column: Controls -->
      <v-col cols="12" md="6" class="overflow-y-auto scrollable-column">
        <div class="mx-auto" style="max-width: 400px">
          <v-text-field
            id="controllers-count"
            v-model.number="controllersCount"
            label="Nombre de contrôleurs"
            type="number"
            variant="outlined"
            class="mb-4"
          ></v-text-field>
        </div>

        <v-row class="mt-5">
          <v-col v-for="(controller, index) in controllers" :key="index" cols="12">
            <v-card class="controller-card" variant="outlined">
              <v-card-title>Contrôleur {{ index + 1 }}</v-card-title>
              <v-card-text>
                <v-text-field
                  :model-value="controller.universe"
                  label="Univers de départ"
                  type="number"
                  variant="outlined"
                  hide-details="auto"
                  class="mb-3"
                  @update:model-value="updateUniverse(index, +$event)"
                ></v-text-field>
                <v-text-field
                  :model-value="controller.outputs.length"
                  label="Nombre de sorties"
                  type="number"
                  variant="outlined"
                  hide-details="auto"
                  class="mb-3"
                  @update:model-value="updateOutputsCount(index, +$event)"
                ></v-text-field>

                <div class="outputs-list mt-4 text-left">
                  <LedOutputCard
                    v-for="(output, outputIndex) in controller.outputs"
                    :key="outputIndex"
                    :output="output"
                    :index="outputIndex"
                    @add-bar="addBar(index, outputIndex)"
                    @remove-bar="removeBar(index, outputIndex)"
                    @toggle-bar="toggleBar(index, outputIndex, $event)"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- Right Column: Visualization -->
      <v-col cols="12" md="6" class="fill-height bg-grey-lighten-4 pa-0">
        <Controller2DVisualizer :controllers="controllers" />
      </v-col>
    </v-row>
  </v-container>

  <v-footer app elevation="4" class="justify-center">
    <v-btn color="primary" size="large" class="button" prepend-icon="mdi-download" @click="downloadExampleCsv">
      Télécharger un exemple CSV
    </v-btn>
  </v-footer>
</template>

<script setup lang="ts">
import type { Controller } from '@/home/domain/Controller';
import { Controllers } from '@/home/domain/Controllers';
import { CsvExporter } from '@/home/domain/CsvExporter';
import { ref, shallowRef, watch } from 'vue';
import Controller2DVisualizer from './Controller2DVisualizer.vue';
import { downloadFile } from './FileDownloader';
import LedOutputCard from './LedOutputCard.vue';

const controllersCount = ref(0);
const controllers = shallowRef<readonly Controller[]>(Controllers.empty().values);

watch(controllersCount, newCount => {
  controllers.value = Controllers.of(controllers.value).resize(newCount).values;
});

const updateUniverse = (index: number, newUniverse: number) => {
  const current = controllers.value[index];
  if (current) {
    const updated = current.withUniverse(newUniverse);
    replaceController(index, updated);
  }
};

const updateOutputsCount = (index: number, newCount: number) => {
  const current = controllers.value[index];
  if (current) {
    const updated = current.resizeOutputs(newCount);
    replaceController(index, updated);
  }
};

const addBar = (controllerIndex: number, outputIndex: number) => {
  const controller = controllers.value[controllerIndex];
  if (controller) {
    const output = controller.outputs[outputIndex];
    if (output) {
      const newOutput = output.addBar();
      const updatedController = controller.replaceOutput(outputIndex, newOutput);
      replaceController(controllerIndex, updatedController);
    }
  }
};

const removeBar = (controllerIndex: number, outputIndex: number) => {
  const controller = controllers.value[controllerIndex];
  if (controller) {
    const output = controller.outputs[outputIndex];
    if (output) {
      const newOutput = output.removeBar();
      const updatedController = controller.replaceOutput(outputIndex, newOutput);
      replaceController(controllerIndex, updatedController);
    }
  }
};

const toggleBar = (controllerIndex: number, outputIndex: number, barIndex: number) => {
  const controller = controllers.value[controllerIndex];
  if (controller) {
    const output = controller.outputs[outputIndex];
    if (output) {
      const newOutput = output.toggleBar(barIndex);
      const updatedController = controller.replaceOutput(outputIndex, newOutput);
      replaceController(controllerIndex, updatedController);
    }
  }
};

const replaceController = (index: number, newController: Controller) => {
  const newControllers = [...controllers.value];
  newControllers[index] = newController;
  controllers.value = newControllers;
};

const downloadExampleCsv = () => {
  downloadFile(CsvExporter.toCsv(controllers.value), 'neon-addressing.csv', 'text/csv;charset=utf-8;');
};
</script>

<style scoped>
@media (min-width: 960px) {
  .scrollable-column {
    max-height: 100dvh;
  }
  .full-height {
    height: 100%;
  }
}
</style>
