<template>
	<!-- 这个组件主要是逻辑组件，不需要模板 -->
</template>

<script lang="ts" setup>
import { inject, onUnmounted, ref, watch } from "vue";
import * as Cesium from "cesium";
import { type EntityOptions, type OdLineProps, type TailOptions } from "../types";
import {
	createCurvedLine,
	useCreateOdFlyLineOptions,
	useCreateOdLineOptions,
} from "../share/od";
import { merge } from "lodash-es";
import { tailDefaultOptions, cesiumViewerInjectKey } from "../share/component";

const props = withDefaults(defineProps<OdLineProps>(), {
	show: true,
	color: "#00FAA4",
	width: 5,
	interpolation: 100,
	sagitta: 0.5,
	midT: 0.5,
	odName: "odLine",
	focus: true,
	animate: true,
	startEllipseSize: 18000,
	startEllipseScaleStep: 0.02,
	pointAlpha: 0.5,
	tail: () => ({
		...tailDefaultOptions,
	}),
	odLineOptions: () => ({}),
	odFlyLineOptions: () => ({}),
	startPointOptions: () => ({}),
	endPointOptions: () => ({}),
});

const viewerRef = inject(cesiumViewerInjectKey);
if (!viewerRef?.value) {
	throw TypeError("viewer inject error!");
}
const viewer: Cesium.Viewer = viewerRef.value;
const tailOption = merge({}, tailDefaultOptions, props.tail);
const startPointPos = Cesium.Cartesian3.fromDegrees(
	props.origin.longitude,
	props.origin.latitude
);
const endPointPos = Cesium.Cartesian3.fromDegrees(
	props.destination.longitude,
	props.destination.latitude
);
const linePositions = createCurvedLine(
	props.origin,
	props.destination,
	props.interpolation,
	props.sagitta,
	props.midT
);

let odLineEntity: Cesium.Entity;
let flyOdLineEntity: Cesium.Entity;
let progress = ref(0);
let scale = ref(0);
const themeColor = new Cesium.ColorMaterialProperty(
	Cesium.Color.fromCssColorString(props.color).withAlpha(props.pointAlpha),
);
// 创建OD线
odLineEntity = viewer.entities.add(
	useCreateOdLineOptions(
		{
			name: props.odName,
			positions: linePositions,
			width: props.width,
			color: props.color,
		},
		props.odLineOptions
	)
);

// 2. 创建移动的光点
flyOdLineEntity = viewer.entities.add(
	useCreateOdFlyLineOptions(
		{
			name: props.odName + "_flyline",
			positions: props.animate
				? new Cesium.CallbackProperty(() => {
					return linePositions.slice(
						Math.max(0, progress.value - tailOption.width!),
						Math.max(
							0,
							progress.value - tailOption.width! + tailOption.width!
						)
					);
				}, false)
				: Cesium.Cartesian3.fromDegreesArray([]),
			width: tailOption.width!,
			color: tailOption.color!,
			glowPower: tailOption.glowPower!,
			taperPower: tailOption.taperPower!,
			position: linePositions[0],
		},
		props.odFlyLineOptions
	)
);

function useSemiAxis() {
	return props.animate
		? new Cesium.CallbackProperty(() => {
			return props.startEllipseSize * scale.value;
		}, false)
		: props.startEllipseSize;
}
const _startEntityOpts = merge<EntityOptions, EntityOptions>(
	{
		position: startPointPos,
		ellipse: {
			semiMajorAxis: useSemiAxis(),
			semiMinorAxis: useSemiAxis(),
			height: 0,
			fill: true,
			extrudedHeight: 0,
			material: themeColor,
			outline: true,
			outlineColor: Cesium.Color.WHITE,
			outlineWidth: 1,
		},
		label: {
			text: "Origin",
			font: "14pt sans-serif",
			style: Cesium.LabelStyle.FILL_AND_OUTLINE,
			outlineWidth: 2,
			verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
			pixelOffset: new Cesium.Cartesian2(0, -10),
		},
	},
	props.startPointOptions
);
// 添加起点标记
const startPointEntity = viewer.entities.add(_startEntityOpts);
const endPointEntityOpts = merge<EntityOptions, EntityOptions>(
	{
		position: endPointPos,
		ellipse: {
			semiMajorAxis: 10,
			semiMinorAxis: 10,
			height: 0,
			fill: true,
			extrudedHeight: 0,
			material: themeColor,
			outline: true,
			outlineColor: Cesium.Color.WHITE,
			outlineWidth: 1,
		},
		label: {
			text: "Destination",
			font: "14pt sans-serif",
			style: Cesium.LabelStyle.FILL_AND_OUTLINE,
			outlineWidth: 2,
			verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
			pixelOffset: new Cesium.Cartesian2(0, -10),
		},
	},
	props.endPointOptions
);
// 添加终点标记
const endPointEntity = viewer.entities.add(endPointEntityOpts);

function onTick() {
	progress.value++;
	if (progress.value >= linePositions.length) {
		progress.value = 0;
	}
	scale.value += props.startEllipseScaleStep;
	if (scale.value >= 1.0) {
		scale.value = 0;
	}
	updateFlyLinePos(linePositions[progress.value]);
}

function updateFlyLinePos(pos) {
	try {
		// 更新光点位置
		// @ts-ignore
		flyOdLineEntity.position = pos;
	} catch (err) {
		window.console.error(err);
	}
}

function bindTickAnimate() {
	viewer.clock.onTick.addEventListener(onTick);
}
function unBindTickAnimate() {
	viewer.clock.onTick.addEventListener(onTick);
}

function focusEntities() {
	// 缩放到显示所有实体
	viewer.flyTo([startPointEntity, endPointEntity]);
}

if (props.focus) {
	focusEntities();
}
if (props.animate) {
	bindTickAnimate();
}
function destoryEntity() {
	if (!viewer || viewer?.isDestroyed()) return;
	unBindTickAnimate();
	viewer.entities.remove(odLineEntity);
	viewer.entities.remove(flyOdLineEntity);
	viewer.entities.remove(startPointEntity);
	viewer.entities.remove(endPointEntity);
}
watch(
	() => props.show,
	(val) => {
		odLineEntity.show = val;
		flyOdLineEntity.show = val;
		startPointEntity.show = val;
		endPointEntity.show = val;
	}
);
onUnmounted(() => {
	destoryEntity();
});

defineExpose({
	progress,
	scale,
	odLineEntity,
	flyOdLineEntity,
	startPointEntity,
	endPointEntity,
	updateFlyLinePos,
	focusEntities,
	destoryEntity,
	bindTickAnimate,
	unBindTickAnimate,
});
</script>
