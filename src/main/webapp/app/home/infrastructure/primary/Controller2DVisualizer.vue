<template>
  <div
    class="visualizer-viewport"
    @wheel.prevent="handleWheel"
    @mousedown="startDrag"
    @mousemove="onDrag"
    @mouseup="stopDrag"
    @mouseleave="stopDrag"
  >
    <div class="visualizer-content" :style="contentStyle">
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
import { computed, ref } from 'vue';

defineProps<{
  controllers: readonly Controller[];
}>();

// Viewport state
const panX = ref(0);
const panY = ref(0);
const zoomScale = ref(1.0);

// Drag state
const isDragging = ref(false);
const dragStartX = ref(0);
const dragStartY = ref(0);

const contentStyle = computed(() => ({
  transform: `translate(${panX.value}px, ${panY.value}px) scale(${zoomScale.value})`,
  transformOrigin: '0 0',
}));

const handleWheel = (event: WheelEvent) => {
  const zoomFactor = 0.1;
  const newScale = zoomScale.value + (event.deltaY < 0 ? zoomFactor : -zoomFactor);
  // Limit zoom
  zoomScale.value = Math.max(0.1, Math.min(newScale, 5.0));
};

const startDrag = (event: MouseEvent) => {
  isDragging.value = true;
  dragStartX.value = event.clientX;
  dragStartY.value = event.clientY;
};

const onDrag = (event: MouseEvent) => {
  if (!isDragging.value) return;

  const dx = event.clientX - dragStartX.value;
  const dy = event.clientY - dragStartY.value;

  panX.value += dx;
  panY.value += dy;

  dragStartX.value = event.clientX;
  dragStartY.value = event.clientY;
};

const stopDrag = () => {
  isDragging.value = false;
};
</script>

<style scoped>
.visualizer-viewport {
  width: 100%;
  height: 600px;
  overflow: hidden;
  position: relative;
  background-color: #f5f5f5;
  cursor: grab;
  border: 1px solid #ccc;
}

.visualizer-viewport:active {
  cursor: grabbing;
}

.visualizer-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Let events pass through to viewport for drag if clicked on empty space, but needs handling for nodes */
}

/* Re-enable pointer events for nodes if interaction is needed later */
.controller-node {
  position: absolute;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.controller-box {
  width: 200px;
  height: 100px;
  background-color: #e0e0e0;
  border: 2px solid black;
}

.controller-label {
  margin-top: 10px;
  font-family: Arial, sans-serif;
  font-size: 14px;
}
</style>
