<template>
  <div class="visualizer-viewport">
    <div class="visualizer-content">
      <div v-for="(controller, index) in controllers" :key="index" class="controller-node" data-selector="controller-node">
        <div class="controller-box">
          <div v-for="(output, oIndex) in controller.outputs" :key="oIndex" class="output-node">
            <div
              v-for="(bar, bIndex) in output.bars"
              :key="bIndex"
              class="bar-node"
              :class="{ 'bar-2m': bar.type === '2M', 'bar-1m': bar.type === '1M' }"
            ></div>
          </div>
        </div>
        <div class="controller-label">U: {{ controller.universe }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Controller } from '@/home/domain/Controller';

defineProps<{
  controllers: readonly Controller[];
}>();
</script>

<style scoped>
.visualizer-viewport {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
}

.visualizer-content {
  display: flex;
  padding: 50px;
  gap: 20px;
  min-width: 100%;
}

.controller-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.controller-box {
  width: auto;
  min-width: 200px;
  min-height: 100px;
  background-color: #e0e0e0;
  border: 2px solid black;
  border-radius: 8px;
  display: flex;
  flex-direction: row; /* Outputs side-by-side */
  padding: 10px;
  gap: 5px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.controller-label {
  margin-top: 10px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
}

.output-node {
  display: flex;
  flex-direction: column; /* Bars stacked vertically */
  gap: 2px;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 2px;
  border-radius: 4px;
}

.bar-node {
  width: 10px; /* Fixed width for vertical bars */
  background-color: #4caf50;
  border-radius: 2px;
}

.bar-2m {
  height: 20px;
}

.bar-1m {
  height: 10px;
}
</style>
