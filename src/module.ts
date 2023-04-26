import fs, { existsSync, mkdirSync } from "fs";
import { join } from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

import {
  defineNuxtModule,
  createResolver,
  addComponent,
  useLogger,
} from "@nuxt/kit";

// Module options TypeScript interface definition
export interface ModuleOptions {
  fallbackIfUnsupported: boolean;
  skip?: string[];
}
const PKG_NAME = "nuxt-hls";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: PKG_NAME,
    configKey: "hls",
  },
  defaults: {
    fallbackIfUnsupported: false,
  },
  setup(options, nuxt) {
    const logger = useLogger(PKG_NAME);
    const resolver = createResolver(import.meta.url);

    addComponent({
      filePath: resolver.resolve("./runtime/components/VideoStream.vue"),
      name: "VideoStream",
      kebabName: "video-stream",
    });

    nuxt.hooks.hook("build:before", async () => {
      logger.log("🔎 Discovering video assets");
      const path = resolver.resolve(nuxt.options.rootDir, "./assets/videos");

      if (!fs.existsSync(path)) {
        logger.log("🫗 No video assets to convert");
        return;
      }

      const dir = recursivelyReaddir(path);

      if (dir.length < 1) {
        logger.log("🫗 No video assets to convert");
        return;
      }

      logger.log(
        "⏳ Processing video assets for HLS, this may take a while on the first build"
      );

      const promises = dir.map(async (entry) => {
        if (options.skip?.some((name) => entry.name === name)) {
          logger.log(`💡 Skipping '${entry.name}', defined in 'skip'`);
          return Promise.resolve();
        }

        const publicPath = resolver.resolve(
          nuxt.options.rootDir,
          "./public/videos"
        );

        const parts = entry.path.split("/");
        parts.pop(); // remove file
        const requiredDirectory = resolver.resolve(publicPath, parts.join("/"));

        if (!existsSync(requiredDirectory)) {
          mkdirSync(requiredDirectory, { recursive: true });
        }

        const outputPath = resolver.resolve(
          publicPath,
          entry.path.replace(".mp4", ".m3u8")
        );

        const videoPath = resolver.resolve(
          nuxt.options.rootDir,
          "./assets/videos",
          entry.path
        );

        // If fallback is specified and HLS is unsupported in the browser
        // <VideoStream/> will use the public .mp4 src, so it needs to exist
        if (options?.fallbackIfUnsupported) {
          const mp4BackupOutputPath = resolver.resolve(publicPath, entry.path);
          if (!fs.existsSync(mp4BackupOutputPath)) {
            fs.copyFileSync(videoPath, mp4BackupOutputPath);
          }
        }

        if (fs.existsSync(outputPath)) {
          logger.log(`💡 Skipping '${entry.name}', found in public`);
          return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
          ffmpeg(videoPath)
            .addOptions([
              "-profile:v baseline",
              "-level 3.0",
              "-start_number 0",
              "-hls_time 10",
              "-hls_list_size 0",
              "-f hls",
            ])
            .output(outputPath)
            .on("error", reject)
            .on("end", resolve)
            .run();
        });
      });

      await Promise.all(promises);

      logger.log("✅ Video processing complete");
    });
  },
});

function recursivelyReaddir(
  root: string,
  entries = [] as { name: string; path: string }[],
  currentBasePath = ""
): { name: string; path: string }[] {
  const dir = fs.readdirSync(root, { withFileTypes: true });

  for (let i = 0; i < dir.length; i++) {
    const entry = dir[i];

    if (!entry.isDirectory()) {
      entries.push({
        name: entry.name,
        path: join(currentBasePath, entry.name),
      });
    } else {
      return recursivelyReaddir(
        join(root, entry.name),
        entries,
        join(currentBasePath, entry.name)
      );
    }
  }

  return entries;
}
