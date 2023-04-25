export default defineNuxtConfig({
  modules: ["../src/module"],
  hls: {
    fallbackIfUnsupported: false,
    skip: [],
  },
});
