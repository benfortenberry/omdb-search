<template>
  <v-container>
    <v-row>
      <v-col>
        <MovieSearch class="border" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import MovieSearch from "@/components/MovieSearch.vue";

//
</script>

<style scoped>
.border {
  border: solid 1px #000 !important;
  border-radius: 10px;
}
</style>
