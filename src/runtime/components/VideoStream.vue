<script lang="ts" setup>
import { useAttrs, ref, watchEffect, computed } from "vue";
import HLS from "hls.js";

const props = defineProps<{
  src: string;
}>();

const attrs = useAttrs();

// Make sure we don't accidently set src via attrs
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { src, ...attrsWithoutSrc } = attrs;

const video = ref<HTMLVideoElement|null>(null);

const source = computed(() => {
  const filename = props.src.split('/').at(-1)?.replace('.mp4', '.m3u8');
  return '/videos/' + filename;
});

watchEffect(() => {
  if (video.value) {
    if (HLS.isSupported()) {
      const hls = new HLS();
      hls.loadSource(source.value);
      hls.attachMedia(video.value);
    } else if (video.value.canPlayType('application/vnd.apple.mpegurl')) {
      video.value.src = source.value;
    } else {
      /**
       * This will only load the video, if the `fallbackIfUnsupported`
       * flag option is true. But we don't mind if it exists or not,
       * the build process is in charge of making sure the video does
       * not exist in public.
       */
      video.value.src = `/videos/${ props.src.split('/').at(-1) }`
    }
  }
});
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <video
    ref="video"
    v-bind="attrsWithoutSrc"
  />
</template>
