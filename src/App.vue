<template>
  <v-app class="app">
    <v-main class="app">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>

<style>

.app{



  --s: 150px; /* control the size*/
  --c1: #111;
  --c2: #000;

  --_g:
     var(--c1) 0%  5% ,var(--c2) 6%  15%,var(--c1) 16% 25%,var(--c2) 26% 35%,var(--c1) 36% 45%,
     var(--c2) 46% 55%,var(--c1) 56% 65%,var(--c2) 66% 75%,var(--c1) 76% 85%,var(--c2) 86% 95%,
     #0000 96%;
  background:
    radial-gradient(50% 50% at 100% 0,var(--_g)),
    radial-gradient(50% 50% at 0 100%,var(--_g)),
    radial-gradient(50% 50%,var(--_g)),
    radial-gradient(50% 50%,var(--_g)) calc(var(--s)/2) calc(var(--s)/2)
    var(--c1);
  background-size: var(--s) var(--s);
}



</style>
