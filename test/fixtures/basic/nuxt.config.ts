import NuxtHLS from "../../../src/module";

export default defineNuxtConfig({
  modules: [
    // @ts-expect-error
    NuxtHLS,
  ],
});
