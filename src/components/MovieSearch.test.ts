import { describe, it, expect, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import MovieSearch from "./MovieSearch.vue";
import MovieList from "./MovieList.vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({ components, directives });

global.ResizeObserver = require("resize-observer-polyfill");

describe("MovieSearch.vue", () => {
  it("renders search form and list", () => {
    const wrapper = mount(MovieSearch, {
      global: { plugins: [vuetify] },
    });
    expect(wrapper.find("input").exists()).toBe(true);
    expect(wrapper.findComponent(MovieList).exists()).toBe(false);
  });

  it("shows error if API fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ Response: "False", Error: "Test error" }),
    }) as any;

    const wrapper = mount(MovieSearch, { global: { plugins: [vuetify] } });
    await wrapper.find("input").setValue("batman");
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();
    expect(wrapper.text()).toContain("Test error");
  });

  it("shows MovieList on successful search", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          Response: "True",
          Search: [
            {
              imdbID: "tt1",
              Title: "Test",
              Year: "2020",
              Type: "movie",
              Poster: "N/A",
            },
          ],
          totalResults: "1",
        }),
    }) as any;

    const wrapper = mount(MovieSearch, { global: { plugins: [vuetify] } });
    await wrapper.find("input").setValue("batman");
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();
    expect(wrapper.findComponent(MovieList).exists()).toBe(true);
    expect(wrapper.text()).toContain("Test");
  });
});
