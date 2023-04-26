# Nuxt HLS

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Convert all your mp4 video assets from `~/assets/videos` to HLS in `~/public/videos` on build. Use the custom video component, to point to your original src in assets and it will automatically check if HLS supported.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
- [🏀 Online playground](https://stackblitz.com/github/Eckhardt-D/nuxt-hls?file=playground%2Fapp.vue)
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->

- ⛰ &nbsp;Automatically converts MP4 to HLS from your `~/assets/videos` folder
- 🚠 &nbsp;Only does the conversion on initial build
- 🌲 &nbsp;Optionally copies the .mp4 files to public with a fallback option

## Quick Setup

1. Add `@eckidevs/nuxt-hls` dependency to your project

```bash
# Using pnpm
pnpm add -D @eckidevs/nuxt-hls

# Using yarn
yarn add --dev @eckidevs/nuxt-hls

# Using npm
npm install --save-dev @eckidevs/nuxt-hls
```

2. Add `@eckidevs/nuxt-hls` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: ["@eckidevs/nuxt-hls"],
  hls: {
    // If true (default=false), make hard copy of file into `./public/videos/...`
    // then the player will fall back to .mp4 if HLS unsupported
    fallbackIfUnsupported: false,

    // Skip video conversion by file name
    skip: ["video.mp4", "private.mp4"],
  },
});
```

That's it! You can now use Nuxt HLS in your Nuxt app ✨

## Documentation

### Options

`fallbackIfUnsupported` - boolean - default = false.
`skip` - string[] - optional

### Usage

To use the module, create the `~/assets/videos` directory and put all your video assets in there, only put the .mp4 videos in here that you want Nuxt HLS to control.
Now you can simply use the `<VideoStream/>` component with your original asset path and it will automagically use the `.m3u8` file created on build.

### How it works

When you run build / dev. The module will look at `~/assets/videos` to discover all the mp4 videos and convert them to the HLS formats `.m3u8` and `.ts` and place them in your public folder, the `<VideoStream />` component src can point to either `/videos/my-video.m3u8` or it can point to `~/assets/videos/my-video.mp4`, the component will handle using the HLS version.

### Steps

1. Add some mp4 assets to `~/assets/videos` e.g. `~/assets/videos/my-video.mp4`

2. Use the `<VideoStream />` component and point the `src` prop to your asset:

```vue
<template>
  <VideoStream src="~/assets/my-video.mp4" width="960" controls />
</template>
```

### A note on support

The module uses Media Source Extension, which is [Pretty widely supported](https://caniuse.com/mediasource) at 96% of browsers. So most likely the fallback isn't necessary for modern browsers. Having HLS makes your videos a little less secure too by making it harder to save and convert the chunks of your video. HLS also has the benefit of being able to stream large video files in smaller chunks which is great for slower, lower bandwidth devices.

If the browser does not support HLS, the player will attempt a fallback to using the .mp4 path , but only if configured at build time with the `fallbackIfUnsupported` option.
If this option is `true`, Nuxt HLS will do a copy of your original .mp4 video into `/public/videos/my-video.mp4` and point to that if HLS is unsupported.

If `fallbackIfUnsupported` is `false` or undefined, it will not copy it and your video will not play in unsupported environments.

### A note on caching

Nuxt HLS only does the conversions and copying on the first build everytime. If e.g. `my-video.m3u8` already exists in `/public/videos` then Nuxt will skip it. (Or if the filename is defined in the `skip` option). If you want to force a regeneration, you can delete the video files or the entire `videos` directory inside `public` (this is why it's recommended to only put Nuxt HLS videos in ~/assets/videos).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@eckidevs/nuxt-hls/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@eckidevs/nuxt-hls
[npm-downloads-src]: https://img.shields.io/npm/dm/@eckidevs/nuxt-hls.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@eckidevs/nuxt-hls
[license-src]: https://img.shields.io/npm/l/@eckidevs/nuxt-hls.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@eckidevs/nuxt-hls
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
