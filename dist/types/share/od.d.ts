import { LogLatObj, EntityOptions } from '../types';
import * as Cesium from 'cesium';
/**
 *
 * @param origin 开始经纬度
 * @param destination 目标经纬度
 * @param interpolation 插值
 * @param sagitta 控制弧高
 * @param midT 中心
 * @returns [坐标]
 */
export declare const createCurvedLine: (origin: LogLatObj, destination: LogLatObj, interpolation: number, sagitta: number, midT: number) => Cesium.Cartesian3[];
/**
 *
 * @param params
 * @param opts
 * @returns
 */
export declare function useCreateOdLineOptions(params: {
    name: string;
    positions: Cesium.Property | Cesium.Cartesian3[];
    width: number;
    color: string;
}, opts?: EntityOptions): EntityOptions;
/**
 *
 * @param params
 * @param opts
 * @returns
 */
export declare function useCreateOdFlyLineOptions(params: {
    name: string;
    position: Cesium.Property | Cesium.Cartesian3;
    width: number;
    color: string;
    glowPower: number;
    taperPower: number;
    positions: Cesium.CallbackProperty | Cesium.Cartesian3[];
}, opts?: EntityOptions): {
    position: Cesium.Property | Cesium.Cartesian3;
    polyline: {
        positions: Cesium.Cartesian3[] | Cesium.CallbackProperty;
        width: number;
        material: Cesium.PolylineGlowMaterialProperty;
        arcType: Cesium.ArcType;
    };
} & (EntityOptions | undefined);
