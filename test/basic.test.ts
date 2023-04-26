import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { setup, $fetch } from "@nuxt/test-utils";
import { existsSync } from "node:fs";
import { join } from "node:path";

const rootDir = fileURLToPath(new URL("./fixtures/basic", import.meta.url));
describe("ssr", async () => {
  await setup({
    rootDir,
  });

  it("converts valid mp4 files", () => {
    const validMp4Path = join(rootDir, "./public/videos/demo.m3u8");
    expect(existsSync(validMp4Path)).toBe(true);
  });

  it("does not convert non mp4", () => {
    const validMp4Path = join(rootDir, "./public/videos/test/notMp4.mov");
    expect(existsSync(validMp4Path)).toBe(false);
  });

  it("converts nested items", () => {
    const validNestMp4Path = join(
      rootDir,
      "./public/videos/test/nested/demo.m3u8"
    );
    expect(existsSync(validNestMp4Path)).toBe(true);
  });

  it("renders the video element with attrs passed through", async () => {
    const response = await $fetch("/");
    expect(response).toMatch(`<video width="960" controls>`);
  });

  it("does not save failed items", () => {
    const fakeMp4Path = join(rootDir, "./public/videos/test/fake.m3u8");
    expect(existsSync(fakeMp4Path)).toBe(false);
  });
});
