<template>
  <div ref="containerRef" class="resizable-split-pane">
    <div class="split-pane-left" :style="{ width: leftWidth + 'px' }">
      <slot name="left"></slot>
    </div>
    <div class="split-pane-divider" @mousedown="startDrag" @touchstart.prevent="startDrag"></div>
    <div class="split-pane-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface ResizableSplitPaneProps {
  storageKey?: string;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  minRightWidth?: number;
}

const props = withDefaults(defineProps<ResizableSplitPaneProps>(), {
  storageKey: 'split-pane-width',
  defaultLeftWidth: 600,
  minLeftWidth: 300,
  minRightWidth: 300,
});

const containerRef = ref<HTMLElement | null>(null);
const leftWidth = ref(props.defaultLeftWidth);
const isDragging = ref(false);

onMounted(() => {
  loadSavedWidth();
});

function loadSavedWidth() {
  const saved = localStorage.getItem(props.storageKey);
  if (saved !== null) {
    const parsed = parseInt(saved, 10);
    if (!isNaN(parsed)) {
      leftWidth.value = parsed;
    }
  }
}

function saveWidth() {
  localStorage.setItem(props.storageKey, leftWidth.value.toString());
}

function startDrag() {
  isDragging.value = true;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchmove', onDrag);
  document.addEventListener('touchend', stopDrag);
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
}

function onDrag(event: MouseEvent | TouchEvent) {
  if (!isDragging.value || !containerRef.value) return;

  let clientX: number;
  if ('touches' in event) {
    const touch = event.touches[0];
    if (!touch) return;
    clientX = touch.clientX;
  } else {
    clientX = event.clientX;
  }

  const containerRect = containerRef.value.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const dividerWidth = 8;

  let newLeftWidth = clientX - containerRect.left;

  const maxLeftWidth = containerWidth - props.minRightWidth - dividerWidth;
  newLeftWidth = Math.max(props.minLeftWidth, Math.min(newLeftWidth, maxLeftWidth));

  leftWidth.value = newLeftWidth;
}

function stopDrag() {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('touchend', stopDrag);
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
  saveWidth();
}

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('touchend', stopDrag);
});
</script>

<style scoped>
.resizable-split-pane {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.split-pane-left {
  flex-shrink: 0;
  overflow: auto;
}

.split-pane-divider {
  width: 8px;
  background: linear-gradient(to right, #e0e0e0, #bdbdbd, #e0e0e0);
  cursor: col-resize;
  flex-shrink: 0;
  transition: background 0.2s ease;
}

.split-pane-divider:hover {
  background: linear-gradient(to right, #bdbdbd, #9e9e9e, #bdbdbd);
}

.split-pane-right {
  flex: 1;
  overflow: auto;
}
</style>
