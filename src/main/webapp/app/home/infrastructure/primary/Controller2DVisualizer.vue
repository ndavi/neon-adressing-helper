<template>
  <div class="visualizer-viewport">
    <div class="visualizer-content">
      <div
        v-for="(controller, index) in controllers"
        :key="index"
        class="controller-node"
        :style="{ left: controller.startX + 'px', top: '50px' }"
      >
        <div class="controller-box"></div>
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
  height: 600px;
  overflow: auto; /* Enable native scrolling */
  position: relative;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
}

.visualizer-content {
  /* Ensure content has enough space based on controllers, 
     or just let absolute positioning expand the scroll area */
  position: relative;
  min-width: 100%;
  height: 100%;
}

.controller-node {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.controller-box {
  width: 200px;
  height: 100px;
  background-color: #e0e0e0;
  border: 2px solid black;
  border-radius: 8px; /* Optional: make it look a bit nicer */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.controller-label {
  margin-top: 10px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
}
</style>
