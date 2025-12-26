<template>
  <div class="app-container">
    <template v-if="mdAndUp">
      <ResizableSplitPane
        storage-key="neon-split-pane-width"
        :default-left-width="800"
        :min-left-width="400"
        :min-right-width="300"
        class="main-content"
      >
        <template #left>
          <ControllersGrid :controllers="controllers" @update:controllers="controllers = $event" />
        </template>
        <template #right>
          <Controller2DVisualizer :controllers="controllers.values" class="fill-height bg-grey-lighten-4" />
        </template>
      </ResizableSplitPane>
    </template>

    <template v-else>
      <ControllersGrid :controllers="controllers" class="main-content" @update:controllers="controllers = $event" />
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
import { shallowRef } from 'vue';
import { useDisplay } from 'vuetify';
import Controller2DVisualizer from './Controller2DVisualizer.vue';
import ControllersGrid from './ControllersGrid.vue';
import { downloadFile } from './FileDownloader';

const { mdAndUp } = useDisplay();

const controllers = shallowRef<Controllers>(Controllers.init());

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
