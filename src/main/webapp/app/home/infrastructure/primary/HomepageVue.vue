<template>
  <v-container class="text-center fill-height justify-center">
    <v-row justify="center" align="center">
      <v-col cols="12">
        <v-img alt="Vue logo" :src="VueLogo" class="mx-auto mb-5" height="200" width="200" />
        <h1 class="text-h3 font-weight-bold mb-5">Neon Addressing Tool</h1>

        <div class="mx-auto" style="max-width: 400px">
          <v-text-field
            id="controllers-count"
            v-model.number="controllersCount"
            label="Nombre de contrôleurs"
            type="number"
            variant="outlined"
            class="mb-4"
          ></v-text-field>

          <v-btn color="primary" size="large" class="button" prepend-icon="mdi-download" @click="downloadExampleCsv">
            Télécharger un exemple CSV
          </v-btn>
        </div>

        <v-row class="mt-5">
          <v-col v-for="(controller, index) in controllers" :key="index" cols="12" md="6" lg="4">
            <v-card class="controller-card" variant="outlined">
              <v-card-title>Contrôleur {{ index + 1 }}</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model.number="controller.universe"
                  label="Univers de départ"
                  type="number"
                  variant="outlined"
                  hide-details="auto"
                  class="mb-3"
                ></v-text-field>
                <v-text-field
                  v-model.number="controller.outputs"
                  label="Nombre de sorties"
                  type="number"
                  variant="outlined"
                  hide-details="auto"
                ></v-text-field>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import type { ControllerConfig } from '@/home/domain/ControllerConfig';
import { Controllers } from '@/home/domain/Controllers';
import VueLogo from '../../../../content/images/VueLogo.png';
import { downloadFile } from './FileDownloader';

export default {
  name: 'HomepageVue',
  data() {
    return {
      controllersCount: 0,
      controllers: [] as readonly ControllerConfig[],
      VueLogo,
    };
  },
  watch: {
    controllersCount(newCount: number) {
      this.controllers = new Controllers(this.controllers).resize(newCount).values;
    },
  },
  methods: {
    downloadExampleCsv() {
      downloadFile(this.getExampleCsvContent(), 'example.csv', 'text/csv;charset=utf-8;');
    },

    getExampleCsvContent() {
      return `Fixture Definition Name;Start Universe;Start Channel;StartX;StartY;EndX;EndY;Width;Fixture Name
BARRE NEON - 2M;0;1;10;0;10;200;15;CONTROLLEUR-0/C0-OUT-1/LED-0
BARRE NEON - 2M;0;358;10;200;10;400;15;CONTROLLEUR-0/C0-OUT-1/LED-1
BARRE NEON - 2M;1;203;50;0;50;200;15;CONTROLLEUR-0/C0-OUT-2/LED-2
BARRE NEON - 2M;2;48;50;200;50;400;15;CONTROLLEUR-0/C0-OUT-2/LED-3
BARRE NEON - 2M;2;405;90;0;90;200;15;CONTROLLEUR-0/C0-OUT-3/LED-4
BARRE NEON - 2M;3;250;130;0;130;200;15;CONTROLLEUR-0/C0-OUT-4/LED-5
BARRE NEON - 2M;4;95;170;0;170;200;15;CONTROLLEUR-0/C0-OUT-5/LED-6
BARRE NEON - 2M;4;452;210;0;210;200;15;CONTROLLEUR-0/C0-OUT-6/LED-7
BARRE NEON - 2M;5;297;250;0;250;200;15;CONTROLLEUR-0/C0-OUT-7/LED-8
BARRE NEON - 2M;6;142;290;0;290;200;15;CONTROLLEUR-0/C0-OUT-8/LED-9
BARRE NEON - 2M;20;1;450;0;450;200;15;CONTROLLEUR-1/C1-OUT-1/LED-10
BARRE NEON - 2M;20;358;450;200;450;400;15;CONTROLLEUR-1/C1-OUT-1/LED-11
BARRE NEON - 2M;21;203;490;0;490;200;15;CONTROLLEUR-1/C1-OUT-2/LED-12
BARRE NEON - 2M;22;48;490;200;490;400;15;CONTROLLEUR-1/C1-OUT-2/LED-13
BARRE NEON - 2M;22;405;530;0;530;200;15;CONTROLLEUR-1/C1-OUT-3/LED-14
BARRE NEON - 2M;23;250;570;0;570;200;15;CONTROLLEUR-1/C1-OUT-4/LED-15
BARRE NEON - 2M;24;95;610;0;610;200;15;CONTROLLEUR-1/C1-OUT-5/LED-16
BARRE NEON - 2M;24;452;650;0;650;200;15;CONTROLLEUR-1/C1-OUT-6/LED-17
BARRE NEON - 2M;25;297;690;0;690;200;15;CONTROLLEUR-1/C1-OUT-7/LED-18
BARRE NEON - 2M;26;142;730;0;730;200;15;CONTROLLEUR-1/C1-OUT-8/LED-19
BARRE NEON - 2M;40;1;890;0;890;200;15;CONTROLLEUR-2/C2-OUT-1/LED-20
BARRE NEON - 2M;40;358;890;200;890;400;15;CONTROLLEUR-2/C2-OUT-1/LED-21
BARRE NEON - 2M;41;203;930;0;930;200;15;CONTROLLEUR-2/C2-OUT-2/LED-22
BARRE NEON - 2M;42;48;930;200;930;400;15;CONTROLLEUR-2/C2-OUT-2/LED-23
BARRE NEON - 2M;42;405;970;0;970;200;15;CONTROLLEUR-2/C2-OUT-3/LED-24
BARRE NEON - 2M;43;250;1010;0;1010;200;15;CONTROLLEUR-2/C2-OUT-4/LED-25
BARRE NEON - 2M;44;95;1050;0;1050;200;15;CONTROLLEUR-2/C2-OUT-5/LED-26
BARRE NEON - 2M;44;452;1090;0;1090;200;15;CONTROLLEUR-2/C2-OUT-6/LED-27
BARRE NEON - 2M;45;297;1130;0;1130;200;15;CONTROLLEUR-2/C2-OUT-7/LED-28
BARRE NEON - 2M;46;142;1170;0;1170;200;15;CONTROLLEUR-2/C2-OUT-8/LED-29
BARRE NEON - 2M;60;1;1330;0;1330;200;15;CONTROLLEUR-3/C3-OUT-1/LED-30
BARRE NEON - 2M;60;358;1330;200;1330;400;15;CONTROLLEUR-3/C3-OUT-1/LED-31
BARRE NEON - 2M;61;203;1370;0;1370;200;15;CONTROLLEUR-3/C3-OUT-2/LED-32
BARRE NEON - 2M;62;48;1370;200;1370;400;15;CONTROLLEUR-3/C3-OUT-2/LED-33
BARRE NEON - 2M;62;405;1410;0;1410;200;15;CONTROLLEUR-3/C3-OUT-3/LED-34
BARRE NEON - 2M;63;250;1450;0;1450;200;15;CONTROLLEUR-3/C3-OUT-4/LED-35
BARRE NEON - 2M;64;95;1490;0;1490;200;15;CONTROLLEUR-3/C3-OUT-5/LED-36
BARRE NEON - 2M;64;452;1530;0;1530;200;15;CONTROLLEUR-3/C3-OUT-6/LED-37
BARRE NEON - 2M;65;297;1570;0;1570;200;15;CONTROLLEUR-3/C3-OUT-7/LED-38
BARRE NEON - 2M;66;142;1610;0;1610;200;15;CONTROLLEUR-3/C3-OUT-8/LED-39
BARRE NEON - 2M;80;1;1770;0;1770;200;15;CONTROLLEUR-4/C4-OUT-1/LED-40
BARRE NEON - 2M;80;358;1770;200;1770;400;15;CONTROLLEUR-4/C4-OUT-1/LED-41
BARRE NEON - 2M;81;203;1810;0;1810;200;15;CONTROLLEUR-4/C4-OUT-2/LED-42
BARRE NEON - 2M;82;48;1810;200;1810;400;15;CONTROLLEUR-4/C4-OUT-2/LED-43
BARRE NEON - 2M;82;405;1850;0;1850;200;15;CONTROLLEUR-4/C4-OUT-3/LED-44
BARRE NEON - 2M;83;250;1850;200;1850;400;15;CONTROLLEUR-4/C4-OUT-3/LED-45
BARRE NEON - 2M;84;95;1890;0;1890;200;15;CONTROLLEUR-4/C4-OUT-4/LED-46
BARRE NEON - 2M;84;452;1890;200;1890;400;15;CONTROLLEUR-4/C4-OUT-4/LED-47`;
    },
  },
};
</script>
