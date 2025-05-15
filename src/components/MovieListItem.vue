<template>
  <v-expansion-panel
    @group:selected="(val) => val && emit('expand', movie.imdbID)"
    class="mb-2"
  >
    <v-expansion-panel-title>
      <v-avatar size="100" rounded="0" class="mr-4">
        <v-img
          :src="
            movie.Poster !== 'N/A'
              ? movie.Poster
              : 'https://via.placeholder.com/80x120?text=No+Image'
          "
          cover
        />
      </v-avatar>
      <div>
        <div class="font-weight-bold">{{ movie.Title }}</div>
        <div class="text-caption mb-1">Year: {{ movie.Year }}</div>
        <v-chip size="small" color="primary" variant="tonal" class="mt-1">
          {{ movie.Type?.toUpperCase() || "MOVIE" }}
        </v-chip>
      </div>
      <v-spacer />
      <v-btn
        icon="mdi-open-in-new"
        variant="text"
        :href="`https://www.imdb.com/title/${movie.imdbID}`"
        target="_blank"
        rel="noopener"
        aria-label="Open in IMDb"
      />
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <div>
        <strong>Plot:&nbsp;</strong>
        <span>
          {{ plot === undefined ? "Expand to load plot..." : plot }}
        </span>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
const props = defineProps<{
  movie: any;
  plot?: string;
}>();
const emit = defineEmits(["expand"]);
</script>

<style scoped></style>
