<template>
  <!-- 这个组件主要是逻辑组件，不需要模板 -->
</template>

<script lang="ts" setup>
import { inject, onUnmounted, shallowRef, watch } from "vue";
import * as Cesium from "cesium";
import { cesiumViewerInjectKey, holesDefaultBorderOptions } from "../share/component";
import { merge } from "lodash-es";
import { type LayerMaskHoleRecord, type EntityOptions } from "../types";


const {
  holes = [],
  maskColor = "rgba(0, 0, 0, 0.5)",
  options = {},
  name = "layerMask",
  maskRange = [],
  holeLineColor = "#6dcdeb",
  showHoleBorder = true,
  holesBorderOptions = {},
} = defineProps<{
  holes: LayerMaskHoleRecord[];
  maskColor?: string;
  options?: EntityOptions;
  name?: string;
  maskRange?: number[][];
  holeLineColor?: string;
  showHoleBorder?: boolean;
  holesBorderOptions?: EntityOptions;
}>();
const viewerRef = inject(cesiumViewerInjectKey);
if (!viewerRef?.value) {
  throw TypeError("viewer inject error!");
}
const viewer: Cesium.Viewer = viewerRef.value;
let layerMaskEntiy = shallowRef<Cesium.Entity>();
const holeLineDataSource = new Cesium.CustomDataSource("holeLines");
viewer.dataSources.add(holeLineDataSource);
function toCesiumHoles(holesData: LayerMaskHoleRecord[]): Cesium.PolygonHierarchy[] {
  return holesData.map((item) => {
    return {
      positions: Cesium.Cartesian3.fromDegreesArray(item.positions.flat()),
      holes: toCesiumHoles(item?.holes ?? []),
    };
  });
}
function addHoleLines(holesData: Cesium.PolygonHierarchy[]) {
  holesData.forEach(item => {
    holeLineDataSource.entities.add(merge(
      {
        polyline: {
          positions: item.positions,
          material: Cesium.Color.fromCssColorString(holeLineColor),
        },
      },
      holesDefaultBorderOptions,
      holesBorderOptions,
    ));
    addHoleLines(item.holes ?? []);
  });
}
function clearHoleBorder() {
  holeLineDataSource.entities.removeAll();
}
function updateLayerMask() {
  const positions = Cesium.Cartesian3.fromDegreesArray(
    maskRange.flat(),
  );
  const holesData = toCesiumHoles(holes);
  if (showHoleBorder) {
    addHoleLines(holesData);
  }
  layerMaskEntiy.value = viewer.entities.add(
    merge<EntityOptions, EntityOptions>(
      {
        name,
        polygon: {
          hierarchy: {
            // 定义多边形或孔外边界的线性环。
            positions,
            // 一组多边形层次结构，定义多边形中的孔。
            holes: holesData,
          },
          // 填充多边形的材质
          material: Cesium.Color.fromCssColorString(maskColor),
          height: 0,
          extrudedHeight: 0,
          outline: false,
        },
      },
      options
    )
  );
}
updateLayerMask();
function destoryEntity() {
  if (!viewer || viewer?.isDestroyed()) return;
  clearMask();
  viewer.dataSources.remove(holeLineDataSource)
}
function clearMask() {
  if (!layerMaskEntiy.value) return;
  viewer.entities.remove(layerMaskEntiy.value);
}
watch(
  () => holes,
  () => {
    clearMask();
    clearHoleBorder();
    updateLayerMask();
  },
  {
    deep: true,
  }
);
onUnmounted(() => {
  destoryEntity();
});
defineExpose({
  layerMaskEntiy,
  holeLineDataSource,
  clearHoleBorder,
  destoryEntity,
  updateLayerMask,
});
</script>
