<template>
  <div class="app-container">
    <!-- Desktop: Resizable split pane -->
    <template v-if="mdAndUp">
      <ResizableSplitPane
        storage-key="neon-split-pane-width"
        :default-left-width="800"
        :min-left-width="400"
        :min-right-width="300"
        class="main-content"
      >
        <template #left>
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
                <v-card class="controller-card" variant="outlined" data-selector="controller-card">
                  <v-card-title>Contrôleur {{ index + 1 }}</v-card-title>
                  <v-card-text>
                    <v-text-field
                      :model-value="controller.universe"
                      label="Univers de départ"
                      type="number"
                      min="0"
                      variant="outlined"
                      hide-details="auto"
                      class="mb-3"
                      @update:model-value="updateUniverse(index, +$event)"
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
              </div>
            </div>
          </div>
        </template>
        <template #right>
          <Controller2DVisualizer :controllers="controllers.values" class="fill-height bg-grey-lighten-4" />
        </template>
      </ResizableSplitPane>
    </template>

    <!-- Mobile: Controllers only -->
    <template v-else>
      <div class="pa-4 full-height d-flex flex-column bg-surface main-content">
        <v-text-field
          id="controllers-count"
          v-model.number="controllersCount"
          label="Nombre de contrôleurs"
          type="number"
          min="0"
          variant="outlined"
          class="mb-4 flex-grow-0"
        ></v-text-field>

        <div class="overflow-y-auto flex-grow-1 pr-2">
          <v-row>
            <v-col v-for="(controller, index) in controllers.values" :key="index" cols="12" sm="6">
              <v-card class="controller-card mb-4" variant="outlined" data-selector="controller-card">
                <v-card-title>Contrôleur {{ index + 1 }}</v-card-title>
                <v-card-text>
                  <v-text-field
                    :model-value="controller.universe"
                    label="Univers de départ"
                    type="number"
                    min="0"
                    variant="outlined"
                    hide-details="auto"
                    class="mb-3"
                    @update:model-value="updateUniverse(index, +$event)"
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
        </div>
      </div>
    </template>

    <v-footer app elevation="4" class="justify-center">
      <v-btn
        color="primary"
        size="large"
        class="button"
        prepend-icon="mdi-download"
        data-selector="download-button"
        @click="downloadExampleCsv"
      >
        Télécharger CSV
      </v-btn>
    </v-footer>
  </div>
</template>

<script setup lang="ts">
import ResizableSplitPane from '@/common/infrastructure/primary/ResizableSplitPane.vue';
import { Controllers } from '@/home/domain/Controllers';
import { CsvExporter } from '@/home/domain/CsvExporter';
import { ref, shallowRef, watch } from 'vue';
import { useDisplay } from 'vuetify';
import Controller2DVisualizer from './Controller2DVisualizer.vue';
import { downloadFile } from './FileDownloader';
import LedOutputCard from './LedOutputCard.vue';

const { mdAndUp } = useDisplay();

const controllersCount = ref(0);
const controllers = shallowRef<Controllers>(Controllers.empty());

watch(controllersCount, newCount => {
  if (newCount >= 0) {
    controllers.value = controllers.value.resize(newCount);
  }
});

const updateUniverse = (index: number, newUniverse: number) => {
  const current = controllers.value.values[index];
  if (current && newUniverse >= 0) {
    controllers.value = controllers.value.replace(index, current.withUniverse(newUniverse));
  }
};

const updateOutputsCount = (index: number, newCount: number) => {
  const current = controllers.value.values[index];
  if (current && newCount >= 0 && newCount <= 8) {
    controllers.value = controllers.value.replace(index, current.resizeOutputs(newCount));
  }
};

const addBar = (controllerIndex: number, outputIndex: number) => {
  const controller = controllers.value.values[controllerIndex];
  if (controller) {
    const output = controller.outputs[outputIndex];
    if (output) {
      controllers.value = controllers.value.replace(controllerIndex, controller.replaceOutput(outputIndex, output.addBar()));
    }
  }
};

const removeBar = (controllerIndex: number, outputIndex: number) => {
  const controller = controllers.value.values[controllerIndex];
  if (controller) {
    const output = controller.outputs[outputIndex];
    if (output) {
      controllers.value = controllers.value.replace(controllerIndex, controller.replaceOutput(outputIndex, output.removeBar()));
    }
  }
};

const toggleBar = (controllerIndex: number, outputIndex: number, barIndex: number) => {
  const controller = controllers.value.values[controllerIndex];
  if (controller) {
    const output = controller.outputs[outputIndex];
    if (output) {
      controllers.value = controllers.value.replace(controllerIndex, controller.replaceOutput(outputIndex, output.toggleBar(barIndex)));
    }
  }
};

const downloadExampleCsv = () => {
  downloadFile(CsvExporter.toCsv(controllers.value.values), 'neon-addressing.csv', 'text/csv;charset=utf-8;');
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100dvh;
}

.main-content {
  flex: 1;
  overflow: hidden;
}

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
