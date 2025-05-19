<template>
  <div class="cesium-container">
    <div ref="cesiumContainer" class="cesium-container__core"></div>
    <slot v-if="ready"></slot>
  </div>
</template>

<script lang="ts" setup>
import {
  onBeforeUnmount,
  onMounted,
  provide,
  Ref,
  ref,
  shallowRef,
  useTemplateRef,
} from "vue";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { merge } from "lodash-es";
import { cesiumViewerInjectKey } from "../share/component";
import { type PositionedEvent, type ScreenSpaceEventType, type Viewer, type ViewerHandlerEmitType } from "../types";
import { CoordinateUtils } from "../share";

const ready = ref(false);
const viewer = shallowRef<Cesium.Viewer>();
const cesiumContainerRef = useTemplateRef("cesiumContainer");
const {
  options = {},
  screenEvents = [2],
} = defineProps<{
  options?: Cesium.Viewer.ConstructorOptions;
  screenEvents?: ScreenSpaceEventType[];
}>();
const _options: Cesium.Viewer.ConstructorOptions = {
  timeline: false,
  animation: false,
  baseLayerPicker: false,
};
const $emits = defineEmits<{
  (e: "ready", view: Viewer): void;
  (e: "handler", d: ViewerHandlerEmitType): void;
}>();
onMounted(() => {
  // 初始化Cesium Cesium.Viewer
  viewer.value = new Cesium.Viewer(
    cesiumContainerRef.value!,
    merge({}, _options, options)
  );
  provide(cesiumViewerInjectKey, viewer as Ref<Cesium.Viewer>);
  ready.value = true;
  initScreenSpaceEventAll();
  $emits("ready", viewer.value);
});

function initScreenSpaceEventAll() {
  screenEvents.forEach((type: ScreenSpaceEventType) => {

    viewer.value?.screenSpaceEventHandler.setInputAction(async function (event: PositionedEvent) {
      const position = await CoordinateUtils.screenToLonLat(viewer.value!, event.position);
      $emits("handler", {
        type,
        event,
        position,
        pickedObject: CoordinateUtils.pickRay(viewer.value!, event.position),
      });
    }, type);
  });
}
function isDestroyMap() {
  return viewer?.value?.isDestroyed();
}

function removeAll() {
  if (isDestroyMap()) return;
  viewer.value?.entities?.removeAll();
  if (viewer.value?.screenSpaceEventHandler?.isDestroyed() === false) {
    screenEvents.forEach((type: ScreenSpaceEventType) => {
      try {
        viewer.value?.screenSpaceEventHandler?.removeInputAction(type);
      } catch (err) {
        window.console.error(err);
      }
    });
    viewer.value?.screenSpaceEventHandler.destroy();
  }
}
function destroy() {
  if (isDestroyMap()) return;
  viewer.value?.destroy();
}
onBeforeUnmount(() => {
  removeAll();
  destroy();
});
defineExpose({
  viewer,
  isDestroyMap,
  removeAll,
  destroy,
});
</script>

<style lang="scss" scoped>
.cesium-container {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;

  &__core {
    width: 100%;
    height: 100%;
  }
}
</style>
