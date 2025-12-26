<template>
  <div ref="container" class="visualizer-container">
    <svg
      :viewBox="viewBox"
      style="width: 100%; height: 100%; border: 1px solid #ccc; cursor: grab"
      :style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
      @wheel.prevent="handleWheel"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
    >
      <g v-for="(controller, index) in controllers" :key="index">
        <rect :x="controller.startX" y="50" width="200" height="100" fill="#e0e0e0" stroke="black" stroke-width="2" />
        <text :x="controller.startX + 10" y="80" font-family="Arial" font-size="14">U: {{ controller.universe }}</text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { Controller } from '@/home/domain/Controller';
import { computed, ref, watchEffect } from 'vue';

const props = defineProps<{
  controllers: readonly Controller[];
}>();

const container = ref<HTMLElement | null>(null);

// Viewport state
const panX = ref(0);
const panY = ref(0);
const zoomScale = ref(1.0);
const baseWidth = ref(800);
const baseHeight = 600;

// Drag state
const isDragging = ref(false);
const dragStartX = ref(0);
const dragStartY = ref(0);

// Initialize base width based on content
watchEffect(() => {
  if (props.controllers.length > 0) {
    const maxX = Math.max(...props.controllers.map(c => c.startX));
    baseWidth.value = Math.max(800, maxX + 400);
  } else {
    baseWidth.value = 800;
  }
});

const viewBox = computed(() => {
  const w = baseWidth.value * zoomScale.value;
  const h = baseHeight * zoomScale.value;
  return `${panX.value} ${panY.value} ${w} ${h}`;
});

const handleWheel = (event: WheelEvent) => {
  const zoomFactor = 1.1;
  if (event.deltaY < 0) {
    // Zoom in
    zoomScale.value /= zoomFactor;
  } else {
    // Zoom out
    zoomScale.value *= zoomFactor;
  }
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

  // Update pan based on zoom scale to keep movement natural
  panX.value -= dx * zoomScale.value;
  panY.value -= dy * zoomScale.value;

  dragStartX.value = event.clientX;
  dragStartY.value = event.clientY;
};

const stopDrag = () => {
  isDragging.value = false;
};
</script>

<style scoped>
.visualizer-container {
  width: 100%;
  height: 600px;
  overflow: hidden;
}
</style>
