import { InjectionKey, Ref } from 'vue';
import { EntityOptions, TailOptions } from '../types';
import * as Cesium from 'cesium';
export declare const tailDefaultOptions: TailOptions;
/**
 * @deprecated v0.2.0 replace tailDefaultOptions
 */
export declare const _tailOptions: TailOptions;
export declare const holesDefaultBorderOptions: EntityOptions;
export declare const cesiumViewerInjectKey: InjectionKey<Ref<Cesium.Viewer>>;
