<template>
  <div class="visualizer-container">
    <svg :viewBox="viewBox" style="width: 100%; height: 100%; border: 1px solid #ccc">
      <g v-for="(controller, index) in controllers" :key="index">
        <rect :x="controller.startX" y="50" width="200" height="100" fill="#e0e0e0" stroke="black" stroke-width="2" />
        <text :x="controller.startX + 10" y="80" font-family="Arial" font-size="14">U: {{ controller.universe }}</text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { Controller } from '@/home/domain/Controller';
import { computed } from 'vue';

const props = defineProps<{
  controllers: readonly Controller[];
}>();

const viewBox = computed(() => {
  if (props.controllers.length === 0) return '0 0 800 600';

  const maxX = Math.max(...props.controllers.map(c => c.startX));
  const width = maxX + 400; // startX + extra space
  return `0 0 ${width} 600`;
});
</script>

<style scoped>
.visualizer-container {
  width: 100%;
  height: 600px;
}
</style>
