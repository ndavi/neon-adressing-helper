<template>
  <div class="pa-4">
    <div class="d-flex align-center mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" :to="{ name: 'Home' }" class="mr-4"></v-btn>
      <h1 class="text-h4">Barres custom</h1>
    </div>

    <!-- Constructeur visuel -->
    <v-card class="mb-6">
      <v-card-title>Créer une barre composée</v-card-title>
      <v-card-text>
        <div class="d-flex align-center mb-4 gap-2">
          <v-btn color="cyan" data-selector="add-2m-segment" @click="addSegment('2M')">+ 2M</v-btn>
          <v-btn color="purple" data-selector="add-1m-segment" @click="addSegment('1M')">+ 1M</v-btn>
          <v-btn
            color="error"
            variant="outlined"
            data-selector="remove-last-segment"
            :disabled="builderSegments.length === 0"
            @click="removeLastSegment"
          >
            Retirer le dernier
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" data-selector="save-composite-bar" :disabled="builderSegments.length < 2" @click="saveCompositeBar">
            Sauvegarder
          </v-btn>
        </div>

        <div class="pa-4 bg-grey-lighten-4 rounded" data-selector="bar-preview">
          <div v-if="builderSegments.length > 0" class="d-flex justify-center align-center bar-container rounded">
            <div
              v-for="(segment, index) in builderSegments"
              :key="index"
              class="bar-segment"
              :class="segment.type === '2M' ? 'bg-cyan' : 'bg-purple'"
              :style="{
                width: segment.type === '2M' ? '120px' : '60px',
                height: '24px',
                borderRight: index < builderSegments.length - 1 ? '1px solid rgba(0,0,0,0.2)' : 'none',
              }"
            ></div>
          </div>
          <div v-else class="text-center text-grey">Ajoutez des segments pour construire votre barre</div>
        </div>

        <div v-if="builderSegments.length > 0" class="mt-4 text-center">
          <div class="text-h6" data-selector="builder-name">{{ compositeBarPreview?.name }}</div>
          <div class="text-body-2 text-grey-darken-1">
            {{ compositeBarPreview?.pixelCount }} pixels | {{ compositeBarPreview?.channelCount }} channels |
            {{ compositeBarPreview?.length }} cm
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Liste des barres -->
    <v-card>
      <v-card-title>Catalogue des barres</v-card-title>
      <v-card-text>
        <div v-if="catalog.bars.length === 0" class="text-center py-8 text-grey" data-selector="empty-catalog-message">
          Aucune barre custom dans le catalogue.
        </div>

        <v-list v-else>
          <v-list-item v-for="(bar, index) in catalog.bars" :key="index" class="mb-2 border rounded" data-selector="catalog-bar-item">
            <div class="d-flex align-center w-100 py-2">
              <div class="bar-container rounded mr-4" style="border: 1px solid rgba(0, 0, 0, 0.1)">
                <div class="d-flex">
                  <div
                    v-for="(segment, si) in bar.segments"
                    :key="si"
                    class="bar-segment"
                    :class="segment.type === '2M' ? 'bg-cyan' : 'bg-purple'"
                    :style="{
                      width: segment.type === '2M' ? '60px' : '30px',
                      height: '16px',
                      borderRight: si < bar.segments.length - 1 ? '1px solid rgba(0,0,0,0.2)' : 'none',
                    }"
                  ></div>
                </div>
              </div>

              <div>
                <div class="font-weight-bold">{{ bar.name }}</div>
                <div class="text-caption text-grey-darken-1">
                  {{ bar.pixelCount }} pixels | {{ bar.channelCount }} channels | {{ bar.length }} cm
                </div>
              </div>

              <v-spacer></v-spacer>

              <v-btn
                icon="mdi-delete"
                color="error"
                variant="text"
                data-selector="delete-catalog-bar"
                @click="deleteCatalogBar(index)"
              ></v-btn>
            </div>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { CompositeBar } from '@/bar-catalog/domain/CompositeBar';
import { LocalStorageBarCatalogRepository } from '@/bar-catalog/infrastructure/secondary/LocalStorageBarCatalogRepository';
import { Bar, type BarType } from '@/common/domain/Bar';
import { computed, shallowRef } from 'vue';

const repository = new LocalStorageBarCatalogRepository();
const catalog = shallowRef(repository.load());

const builderSegments = shallowRef<Bar[]>([]);

const compositeBarPreview = computed(() => {
  if (builderSegments.value.length < 2) return null;
  try {
    return CompositeBar.of({ segments: builderSegments.value });
  } catch {
    return null;
  }
});

const addSegment = (type: BarType) => {
  builderSegments.value = [...builderSegments.value, Bar.new(type)];
};

const removeLastSegment = () => {
  builderSegments.value = builderSegments.value.slice(0, -1);
};

const saveCompositeBar = () => {
  if (builderSegments.value.length < 2) return;

  try {
    const bar = CompositeBar.of({ segments: [...builderSegments.value] });
    catalog.value = catalog.value.add(bar);
    repository.save(catalog.value);
    builderSegments.value = [];
  } catch (e) {
    alert(e instanceof Error ? e.message : 'Error saving bar');
  }
};

const deleteCatalogBar = (index: number) => {
  catalog.value = catalog.value.remove(index);
  repository.save(catalog.value);
};
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
.bar-container {
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
