import { LayerMaskHoleRecord, EntityOptions } from '../types';
import * as Cesium from "cesium";
type __VLS_Props = {
    holes: LayerMaskHoleRecord[];
    maskColor?: string;
    options?: EntityOptions;
    name?: string;
    maskRange?: number[][];
    holeLineColor?: string;
    showHoleBorder?: boolean;
    holesBorderOptions?: EntityOptions;
};
declare function clearHoleBorder(): void;
declare function updateLayerMask(): void;
declare function destoryEntity(): void;
declare const _default: import('vue').DefineComponent<__VLS_Props, {
    layerMaskEntiy: import('vue').ShallowRef<Cesium.Entity | undefined, Cesium.Entity | undefined>;
    holeLineDataSource: Cesium.CustomDataSource;
    clearHoleBorder: typeof clearHoleBorder;
    destoryEntity: typeof destoryEntity;
    updateLayerMask: typeof updateLayerMask;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
