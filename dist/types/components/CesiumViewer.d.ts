import { ScreenSpaceEventType, ViewerHandlerEmitType } from '../types';
import * as Cesium from "cesium";
type __VLS_Props = {
    options?: Cesium.Viewer.ConstructorOptions;
    screenEvents?: ScreenSpaceEventType[];
};
declare function isDestroyMap(): boolean | undefined;
declare function removeAll(): void;
declare function destroy(): void;
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
    };
    refs: {
        cesiumContainer: HTMLDivElement;
    };
    rootEl: HTMLDivElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<__VLS_Props, {
    viewer: import('vue').ShallowRef<Cesium.Viewer | undefined, Cesium.Viewer | undefined>;
    isDestroyMap: typeof isDestroyMap;
    removeAll: typeof removeAll;
    destroy: typeof destroy;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    ready: (view: Cesium.Viewer) => any;
    handler: (d: ViewerHandlerEmitType) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onReady?: ((view: Cesium.Viewer) => any) | undefined;
    onHandler?: ((d: ViewerHandlerEmitType) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    cesiumContainer: HTMLDivElement;
}, HTMLDivElement>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
