
import * as Cesium from 'cesium';

export type ScreenSpaceEventType = Cesium.ScreenSpaceEventType;
export type PositionedEvent = Cesium.ScreenSpaceEventHandler.PositionedEvent
export type LogLatObj = {
    longitude: number;
    latitude: number;
}

export type Viewer = Cesium.Viewer;
export type TailOptions = {
    width?: number;
    color?: string;
    glowPower?: number;
    taperPower?: number;
}
export type EntityOptions = Partial<Cesium.Entity | Cesium.Entity.ConstructorOptions>;
/**
 * @deprecated v0.2.0 replace EntityOptions
 */
export type OdLineOptions = EntityOptions;

export type LayerMaskHoleRecord = {
    positions: number[][];
    holes?: LayerMaskHoleRecord[];
};
export type OdLineProps = {
    show?: boolean;
    origin: LogLatObj;
    destination: LogLatObj;
    /**
     * @default '#00FAA4'
     */
    color?: string;
    /**
     * @default 5
     */
    width?: number;
    /**
    * @default 0.5
    */
    pointAlpha?: number;
    /**
     * 插值
     * @default 100
     */
    interpolation?: number;
    /**
     * 控制弧高
     * @default 0.5
     */
    sagitta?: number,
    /**
     * 抬高位置
     * @default 0.5
     */
    midT?: number;
    /**
     * @default 'odLine'
     */
    odName?: string;
    tail?: TailOptions;
    odLineOptions?: EntityOptions;
    odFlyLineOptions?: EntityOptions;
    startPointOptions?: EntityOptions;
    endPointOptions?: EntityOptions;
    focus?: boolean;
    animate?: boolean;
    startEllipseSize?: number;
    startEllipseScaleStep?: number;
}

export type ViewerHandlerEmitType = {
    type: Cesium.ScreenSpaceEventType;
    event: PositionedEvent;
    position: { longitude: number, latitude: number, height: number } | null;
    pickedObject: any;
}
