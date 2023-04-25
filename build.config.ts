import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  externals: ["fluent-ffmpeg", "@ffmpeg-installer/ffmpeg"],
});
