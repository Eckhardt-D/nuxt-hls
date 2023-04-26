export default defineNuxtConfig({
  modules: ["../src/module"],
  hls: {
    fallbackIfUnsupported: false,
    hlsTime: 2,
    skip: [],
  },
});
