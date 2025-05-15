<template>
  <div
    class="movies-container"
    @scroll.passive="onScroll"
    ref="scrollContainer"
  >
    <v-list>
      <v-expansion-panels variant="accordion" multiple>
        <MovieListItem
          v-for="movie in movies"
          :key="movie.imdbID"
          :movie="movie"
          :plot="moviePlots[movie.imdbID]"
          @expand="onExpand"
        />
        <v-list-item v-if="loadingMore">
          <v-progress-circular indeterminate color="primary" />
        </v-list-item>
      </v-expansion-panels>
    </v-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MovieListItem from "./MovieListItem.vue";

const props = defineProps<{
  movies: any[];
  moviePlots: Record<string, string>;
  loadingMore: boolean;
}>();
const emit = defineEmits(["expand", "scroll-bottom"]);

const scrollContainer = ref<HTMLElement | null>(null);

function onExpand(imdbID: string) {
  emit("expand", imdbID);
}

function onScroll() {
  const el = scrollContainer.value;
  if (!el) return;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
    emit("scroll-bottom");
  }
}
</script>

<style scoped>
.movies-container {
  max-height: 600px;
  overflow-y: auto;
}
</style>
