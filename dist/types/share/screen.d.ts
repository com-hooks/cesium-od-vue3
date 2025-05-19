import { Viewer } from '../types';
import * as Cesium from 'cesium';
export declare class CoordinateUtils {
    /**
     * 屏幕坐标转经纬度
     * @param {Cesium.Viewer} viewer
     * @param {Cesium.Cartesian2} screenPosition
     * @returns {Promise<{longitude: number, latitude: number, height: number}>}
     */
    static screenToLonLat(viewer: Viewer, screenPosition: Cesium.Cartesian2): Promise<{
        longitude: number;
        latitude: number;
        height: number;
    } | null>;
    static pickRay(viewer: Viewer, screenPosition: Cesium.Cartesian2): any;
}
