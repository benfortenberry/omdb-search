import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MovieListItem from "./MovieListItem.vue";
import { createVuetify } from "vuetify";
import { VExpansionPanel } from "vuetify/components";

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { VuetifyLayoutKey } from "vuetify/lib/composables/layout.mjs";

const vuetify = createVuetify({
  components,
  directives,
});

global.ResizeObserver = require("resize-observer-polyfill");

const movie = {
  imdbID: "tt1234567",
  Title: "Test Movie",
  Year: "2020",
  Type: "movie",
  Poster: "https://via.placeholder.com/80x120?text=Test+Poster",
};

describe("MovieListItem.vue", () => {
  it("renders movie details", () => {
    const wrapper = mount(
      {
        template: `
        <v-expansion-panels>
          <MovieListItem :movie="movie" plot="A test plot." />
        </v-expansion-panels>
      `,
        components: { MovieListItem },
        data: () => ({ movie }),
      },
      {
        global: { plugins: [vuetify] },
      }
    );
    expect(wrapper.text()).toContain("Test Movie");
    expect(wrapper.text()).toContain("2020");
    expect(wrapper.text()).toContain("MOVIE");
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe(movie.Poster);
  });

  it("emits expand event on expand", async () => {
    const wrapper = mount(
      {
        template: `
        <v-expansion-panels>
          <MovieListItem :movie="movie" />
        </v-expansion-panels>
      `,
        components: { MovieListItem },
        data: () => ({ movie }),
      },
      {
        global: { plugins: [vuetify] },
      }
    );
    // Find the MovieListItem component
    const item = wrapper.findComponent(MovieListItem);
    // Simulate expansion
    await item.vm.$emit("expand", movie.imdbID);
    expect(item.emitted("expand")).toBeTruthy();
    expect(item.emitted("expand")![0]).toEqual([movie.imdbID]);
  });
});
