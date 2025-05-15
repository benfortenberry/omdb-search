<template>
  <v-card class="pa-5" outlined>
    <v-row>
      <v-col cols="12" md="5">
        <h2 class="pb-5">
          <v-icon icon="mdi-movie-search-outline"></v-icon>
          Ben's Movie Finder
        </h2>
        <v-form @submit.prevent="searchMovies">
          <v-text-field
            v-model="query"
            label="Search for a title"
            clearable
            prepend-inner-icon="mdi-magnify"
            @keyup.enter="searchMovies"
            @click:clear="
              movies = [];
              error = '';
              searched = false;
            "
          />
          <v-select
            v-model="selectedType"
            :items="typeOptions"
            label="Type"
            class="mt-2"
            clearable
            item-title="label"
            item-value="value"
          />
          <v-text-field
            v-model="year"
            label="Year released"
            type="number"
            class="mt-2"
            :min="1878"
            :max="2100"
            :rules="[
              (v) =>
                !v ||
                (v.length === 4 && v >= 1878 && v <= 2100) ||
                'Enter a valid 4-digit year',
            ]"
            clearable
            @keyup.enter="searchMovies"
          />
          <v-btn
            color="primary"
            class="mt-2"
            :loading="loading"
            :disabled="!query"
            type="submit"
          >
            Search
          </v-btn>
        </v-form>
      </v-col>
      <v-col cols="12" md="7">
        <v-alert v-if="error" type="error" dense>{{ error }}</v-alert>
        <MovieList
          v-if="movies.length"
          :movies="movies"
          :movie-plots="moviePlots"
          :loading-more="loadingMore"
          @expand="fetchPlot"
          @scroll-bottom="fetchMoreMovies"
          ref="movieList"
        /> </v-col
    ></v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import MovieList from "./MovieList.vue";

const query = ref("");
const year = ref("");
const selectedType = ref<string | null>(null);
const typeOptions = [
  { label: "Any", value: null },
  { label: "Movie", value: "movie" },
  { label: "Series", value: "series" },
  { label: "Episode", value: "episode" },
];
const movies = ref<any[]>([]);
const loading = ref(false);
const loadingMore = ref(false);
const error = ref("");
const searched = ref(false);
const moviePlots = ref<Record<string, string>>({});
const page = ref(1);
const totalResults = ref(0);

const OMDB_API_KEY = import.meta.env.VITE_API_KEY;
const OMDB_API_URL = "https://www.omdbapi.com/";
const OMDB_API_URL_SEARCH = `${OMDB_API_URL}?apikey=${OMDB_API_KEY}&s=`;
const OMDB_API_URL_PLOT = `${OMDB_API_URL}?apikey=${OMDB_API_KEY}&i=`;

function buildSearchUrl(pageNum = 1) {
  let url = `${OMDB_API_URL_SEARCH}${encodeURIComponent(
    query.value
  )}&page=${pageNum}`;
  if (selectedType.value) {
    url += `&type=${selectedType.value}`;
  }
  if (year.value) {
    url += `&y=${year.value}`;
  }
  return url;
}

async function searchMovies() {
  if (!query.value) return;
  loading.value = true;
  error.value = "";
  searched.value = false;
  movies.value = [];
  moviePlots.value = {};
  page.value = 1;
  totalResults.value = 0;
  try {
    const res = await fetch(buildSearchUrl(page.value));

    const data = await res.json();
    if (data.Response === "True") {
      movies.value = data.Search;
      totalResults.value = parseInt(data.totalResults) || 0;
    } else {
      error.value = data.Error || "No results found.";
    }
  } catch (e) {
    error.value = "Failed to fetch movies.";
  } finally {
    loading.value = false;
    searched.value = true;
    await nextTick();
    // Optionally scroll to top
  }
}

async function fetchMoreMovies() {
  if (loadingMore.value) return;
  if (movies.value.length >= totalResults.value) return;
  loadingMore.value = true;
  page.value += 1;
  try {
    const res = await fetch(
      `${OMDB_API_URL_SEARCH}${encodeURIComponent(query.value)}&page=${
        page.value
      }`
    );
    const data = await res.json();
    if (data.Response === "True") {
      movies.value = [...movies.value, ...data.Search];
    }
  } catch (e) {
    // Optionally handle error
  } finally {
    loadingMore.value = false;
  }
}

async function fetchPlot(imdbID: string) {
  if (moviePlots.value[imdbID]) return;
  moviePlots.value[imdbID] = "Loading...";
  try {
    const res = await fetch(
      OMDB_API_URL_PLOT + `${encodeURIComponent(imdbID)}&plot=short`
    );
    const data = await res.json();
    moviePlots.value[imdbID] = data.Plot || "No plot available.";
  } catch {
    moviePlots.value[imdbID] = "Failed to load plot.";
  }
}
</script>
