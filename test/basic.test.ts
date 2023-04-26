import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { setup, $fetch } from "@nuxt/test-utils";
import fs from "fs";

describe("ssr", async () => {
  await setup({
    rootDir: fileURLToPath(new URL("./fixtures/basic", import.meta.url)),
  });

  it("renders the video element with attrs passed through", async () => {
    const response = await $fetch("/");
    fs.writeFileSync("./test.html", response);
    expect(response).toMatch(`<video width="960" controls>`);
  });
});
