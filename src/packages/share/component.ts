import * as Cesium from 'cesium';
import { InjectionKey, Ref } from "vue";
import { type EntityOptions, type TailOptions } from '../types';

export const tailDefaultOptions: TailOptions = {
    width: 15,
    color: '#00FAA4',
    glowPower: 0.2,
    taperPower: 0.5,
}
/**
 * @deprecated v0.2.0 replace tailDefaultOptions
 */
export const _tailOptions: TailOptions = tailDefaultOptions;

export const holesDefaultBorderOptions: EntityOptions = {
    polyline: {
        width: 2, //边界线宽
        clampToGround: true, // 贴地
    },
}

export const cesiumViewerInjectKey: InjectionKey<Ref<Cesium.Viewer>> = Symbol("CesiumViewer");