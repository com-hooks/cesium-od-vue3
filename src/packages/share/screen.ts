import * as Cesium from 'cesium';
import { type Viewer } from '../types';

export class CoordinateUtils {
    /**
     * 屏幕坐标转经纬度
     * @param {Cesium.Viewer} viewer 
     * @param {Cesium.Cartesian2} screenPosition 
     * @returns {Promise<{longitude: number, latitude: number, height: number}>}
     */
    public static async screenToLonLat(viewer: Viewer, screenPosition: Cesium.Cartesian2) {
        const scene = viewer.scene;
        const ray = viewer.camera.getPickRay(screenPosition);
        if (!ray) return null;

        try {
            let position = scene.globe.pick(ray, scene);
            if (!position) {
                // 如果没有击中地球表面，使用椭球面
                position = scene.camera.pickEllipsoid(screenPosition, scene.globe.ellipsoid);
                if (!position) return null;
            }

            if (!viewer?.terrainProvider?.availability) {
                // 返回原始高度（不考虑地形）
                const cartographic = Cesium.Cartographic.fromCartesian(position);
                // 弧度转度数
                const longitude = Cesium.Math.toDegrees(cartographic.longitude); // 经度
                const latitude = Cesium.Math.toDegrees(cartographic.latitude);   // 纬度
                const height = cartographic.height;                             // 高度（米）
                return {
                    longitude,
                    latitude,
                    height,
                };
            }

            // 考虑地形高度
            const cartographic = await Cesium.sampleTerrainMostDetailed(
                viewer.terrainProvider,
                [Cesium.Cartographic.fromCartesian(position)]
            );

            return {
                longitude: Cesium.Math.toDegrees(cartographic[0].longitude),
                latitude: Cesium.Math.toDegrees(cartographic[0].latitude),
                height: cartographic[0].height
            };
        } catch (err) {
            window.console.error(err);
        }
        return null;
    }

    public static pickRay(viewer: Viewer, screenPosition: Cesium.Cartesian2) {
        const pickedObject = viewer.scene.pick(screenPosition);
        if (Cesium.defined(pickedObject)) {
            return pickedObject;
        }
        return null;
    }
}