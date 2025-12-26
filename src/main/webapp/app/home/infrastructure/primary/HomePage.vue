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
          <ControllersGrid
            :controllers-count="controllersCount"
            :controllers="controllers.values"
            @update:controllers-count="controllersCount = $event"
            @update:universe="updateUniverse($event.controllerIndex, $event.universe)"
            @update:outputs-count="updateOutputsCount($event.controllerIndex, $event.count)"
            @add-bar="addBar($event.controllerIndex, $event.outputIndex)"
            @remove-bar="removeBar($event.controllerIndex, $event.outputIndex)"
            @toggle-bar="toggleBar($event.controllerIndex, $event.outputIndex, $event.barIndex)"
          />
        </template>
        <template #right>
          <Controller2DVisualizer :controllers="controllers.values" class="fill-height bg-grey-lighten-4" />
        </template>
      </ResizableSplitPane>
    </template>

    <!-- Mobile: Controllers only -->
    <template v-else>
      <ControllersGrid
        :controllers-count="controllersCount"
        :controllers="controllers.values"
        class="main-content"
        @update:controllers-count="controllersCount = $event"
        @update:universe="updateUniverse($event.controllerIndex, $event.universe)"
        @update:outputs-count="updateOutputsCount($event.controllerIndex, $event.count)"
        @add-bar="addBar($event.controllerIndex, $event.outputIndex)"
        @remove-bar="removeBar($event.controllerIndex, $event.outputIndex)"
        @toggle-bar="toggleBar($event.controllerIndex, $event.outputIndex, $event.barIndex)"
      />
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
import ControllersGrid from './ControllersGrid.vue';
import { downloadFile } from './FileDownloader';

const { mdAndUp } = useDisplay();

const controllersCount = ref(1);
const controllers = shallowRef<Controllers>(Controllers.empty());

watch(
  controllersCount,
  newCount => {
    controllers.value = controllers.value.resize(newCount);
  },
  { immediate: true },
);

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
</style>
