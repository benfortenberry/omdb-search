import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MovieList from "./MovieList.vue";
import MovieListItem from "./MovieListItem.vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({ components, directives });

global.ResizeObserver = require("resize-observer-polyfill");

const movies = [
  {
    imdbID: "tt1234567",
    Title: "Test Movie",
    Year: "2020",
    Type: "movie",
    Poster: "https://via.placeholder.com/80x120?text=Test+Poster",
  },
  {
    imdbID: "tt7654321",
    Title: "Another Movie",
    Year: "2021",
    Type: "series",
    Poster: "https://via.placeholder.com/80x120?text=Another+Poster",
  },
];

describe("MovieList.vue", () => {
  it("renders a MovieListItem for each movie", () => {
    const wrapper = mount(MovieList, {
      props: {
        movies,
        moviePlots: { tt1234567: "Plot 1", tt7654321: "Plot 2" },
        loadingMore: false,
      },
      global: { plugins: [vuetify] },
    });
    const items = wrapper.findAllComponents(MovieListItem);
    expect(items.length).toBe(2);
    expect(items[0].props("movie").Title).toBe("Test Movie");
    expect(items[1].props("movie").Title).toBe("Another Movie");
  });

  it("shows loading spinner when loadingMore is true", () => {
    const wrapper = mount(MovieList, {
      props: {
        movies,
        moviePlots: {},
        loadingMore: true,
      },
      global: { plugins: [vuetify] },
    });
    expect(wrapper.findComponent({ name: "VProgressCircular" }).exists()).toBe(
      true
    );
  });

  it("emits expand when MovieListItem emits expand", async () => {
    const wrapper = mount(MovieList, {
      props: {
        movies,
        moviePlots: {},
        loadingMore: false,
      },
      global: { plugins: [vuetify] },
    });
    const item = wrapper.findComponent(MovieListItem);
    await item.vm.$emit("expand", "tt1234567");
    expect(wrapper.emitted("expand")).toBeTruthy();
    expect(wrapper.emitted("expand")![0]).toEqual(["tt1234567"]);
  });

  it("emits scroll-bottom when scrolled to bottom", async () => {
    const wrapper = mount(MovieList, {
      props: {
        movies,
        moviePlots: {},
        loadingMore: false,
      },
      attachTo: document.body,
      global: { plugins: [vuetify] },
    });
    // Mock scrollContainer
    const el = wrapper.vm.$refs.scrollContainer as HTMLElement;
    Object.defineProperty(el, "scrollTop", { value: 100, writable: true });
    Object.defineProperty(el, "clientHeight", { value: 100, writable: true });
    Object.defineProperty(el, "scrollHeight", { value: 150, writable: true });
    await wrapper.vm.onScroll();
    expect(wrapper.emitted("scroll-bottom")).toBeTruthy();
  });
});
