<template>
  <div id="app">
    <img alt="Vue logo" src="../../../../content/images/VueLogo.png" />
    <h1 class="page-title">Neon Addressing Tool</h1>

    <div class="actions">
      <button class="button" @click="downloadExampleCsv">Télécharger un exemple CSV</button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'HomepageVue',
  methods: {
    downloadExampleCsv() {
      const csvContent = `Fixture Definition Name;Start Universe;Start Channel;StartX;StartY;EndX;EndY;Width;Fixture Name
BARRE NEON - 2M;0;1;10;0;10;200;15;CONTROLLEUR-0/C0-OUT-1/LED-0
BARRE NEON - 2M;0;358;10;200;10;400;15;CONTROLLEUR-0/C0-OUT-1/LED-1
BARRE NEON - 2M;1;203;50;0;50;200;15;CONTROLLEUR-0/C0-OUT-2/LED-2
BARRE NEON - 2M;2;48;50;200;50;400;15;CONTROLLEUR-0/C0-OUT-2/LED-3
BARRE NEON - 2M;2;405;90;0;90;200;15;CONTROLLEUR-0/C0-OUT-3/LED-4
BARRE NEON - 2M;3;250;130;0;130;200;15;CONTROLLEUR-0/C0-OUT-4/LED-5
BARRE NEON - 2M;4;95;170;0;170;200;15;CONTROLLEUR-0/C0-OUT-5/LED-6
BARRE NEON - 2M;4;452;210;0;210;200;15;CONTROLLEUR-0/C0-OUT-6/LED-7
BARRE NEON - 2M;5;297;250;0;250;200;15;CONTROLLEUR-0/C0-OUT-7/LED-8
BARRE NEON - 2M;6;142;290;0;290;200;15;CONTROLLEUR-0/C0-OUT-8/LED-9`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'example.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-text);
  margin-top: 60px;
}

.actions {
  margin-top: 2rem;
}
</style>
