import * as Cesium from 'cesium';
import { merge } from 'lodash-es';
import { type LogLatObj, type EntityOptions } from '../types';


/**
 * 
 * @param origin 开始经纬度
 * @param destination 目标经纬度
 * @param interpolation 插值
 * @param sagitta 控制弧高
 * @param midT 中心
 * @returns [坐标]
 */
export const createCurvedLine = (
    origin: LogLatObj,
    destination: LogLatObj,
    interpolation: number,
    sagitta: number,
    midT: number,
) => {
    const start = Cesium.Cartesian3.fromDegrees(origin.longitude, origin.latitude);
    const end = Cesium.Cartesian3.fromDegrees(destination.longitude, destination.latitude);

    // 计算中点并抬高
    const midpoint = Cesium.Cartesian3.lerp(start, end, midT, new Cesium.Cartesian3());
    const midpointCartographic = Cesium.Cartographic.fromCartesian(midpoint);
    midpointCartographic.height = Cesium.Cartesian3.distance(start, end) * sagitta;
    const raisedMidpoint = Cesium.Cartesian3.fromRadians(
        midpointCartographic.longitude,
        midpointCartographic.latitude,
        midpointCartographic.height
    );
    // 创建曲线点
    const positions: Cesium.Cartesian3[] = [];
    for (let i = 0; i <= interpolation; i++) {
        const t = i / interpolation;
        const temp1 = Cesium.Cartesian3.lerp(start, raisedMidpoint, t, new Cesium.Cartesian3());
        const temp2 = Cesium.Cartesian3.lerp(raisedMidpoint, end, t, new Cesium.Cartesian3());
        positions.push(Cesium.Cartesian3.lerp(temp1, temp2, t, new Cesium.Cartesian3()));
    }
    return positions;
};


/**
 * 
 * @param params 
 * @param opts 
 * @returns 
 */
export function useCreateOdLineOptions(params: {
    name: string;
    positions: Cesium.Property | Cesium.Cartesian3[];
    width: number;
    color: string;
}, opts?: EntityOptions): EntityOptions {
    return merge({
        name: params.name,
        polyline: {
            positions: params.positions,
            width: params.width,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.2,
                color: Cesium.Color.fromCssColorString(params.color),
                taperPower: 0.9,
            }),
            arcType: Cesium.ArcType.NONE
        }
    }, opts);
}

/**
 * 
 * @param params 
 * @param opts 
 * @returns 
 */
export function useCreateOdFlyLineOptions(params: {
    name: string;
    position: Cesium.Property | Cesium.Cartesian3;
    width: number;
    color: string;
    glowPower: number;
    taperPower: number;
    positions: Cesium.CallbackProperty | Cesium.Cartesian3[];
}, opts?: EntityOptions) {
    return merge({
        position: params.position,
        polyline: {
            positions: params.positions,
            width: params.width,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: params.glowPower,
                color: Cesium.Color.fromCssColorString(params.color),
                taperPower: params.taperPower,
            }),
            arcType: Cesium.ArcType.NONE
        }
    }, opts)
}