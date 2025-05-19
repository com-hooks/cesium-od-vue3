# cesium-od-vue3

## Install
```sh
pnpm add cesium-od-vue3
```

- vite 自行配置 `vite-plugin-cesium`

- ![微信截图_20250519154332](https://github.com/user-attachments/assets/1351c76e-9a40-4791-a38d-4f5b3c11e7a2)

## Example
```vue
<template>
    <CesiumViewer @ready="cesiumViewerReady" @handler="cesiumViewerHandler">
        <button class="button" @click="show = !show">od线1：{{ show }}</button>
        <OdLine v-for="(item, key) in odLineList" :key v-bind="item" ref="odLineRef" />
        <LayerMask :holes :mask-range></LayerMask>
    </CesiumViewer>
</template>

<script lang="ts" setup>
import {
    CesiumViewer,
    OdLine,
    LayerMask,
    type OdLineProps,
    type LayerMaskHoleRecord,
    type ViewerHandlerEmitType,
} from "cesium-od-vue3";
import { computed, ref, useTemplateRef, watchPostEffect } from "vue";
const show = ref(true);
const odLineRefs = useTemplateRef("odLineRef");

const maskRange: number[][] = [
    [45, 10],
    [45, 60],
    [145, 60],
    [145, 10],
];
const holes: LayerMaskHoleRecord[] = [
    {
        positions: [
            [116.404, 39.915],
            [120.404, 40.915],
            [121.474, 31.23],
            [116.404, 39.915],
        ],
    },
];
const odLineList = computed<OdLineProps[]>(() => {
    return [
        {
            show: show.value,
            color: "yellow",
            tail: {
                color: "blue",
            },
            origin: {
                longitude: 116.404,
                latitude: 39.915,
            },
            destination: {
                longitude: 121.474,
                latitude: 31.23,
            },
            startPointOptions: {
                label: {
                    text: "开始点",
                },
            },
            endPointOptions: {},
        },
        {
            origin: {
                longitude: 120.404,
                latitude: 40.915,
            },
            destination: {
                longitude: 121.474,
                latitude: 31.23,
            },
            endPointOptions: {
                ellipse: {
                    semiMajorAxis: 12000,
                    semiMinorAxis: 12000,
                },
            },
        },
    ];
});

function cesiumViewerReady(viewer) {
    // watchPostEffect(() => {
    //   viewer.flyTo(
    //     odLineRefs.value?.map((item) => [
    //       item?.startPointEntity,
    //       item?.endPointEntity,
    //     ])?.flat() ?? []
    //   );
    // });
}

function cesiumViewerHandler(e: ViewerHandlerEmitType) {
    console.log(e.position)
}
</script>
<style scoped>
.button {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 9;
}
</style>

```
