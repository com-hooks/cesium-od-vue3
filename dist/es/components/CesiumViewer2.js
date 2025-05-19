import { defineComponent as S, ref as k, shallowRef as A, useTemplateRef as V, onMounted as H, provide as R, onBeforeUnmount as B, createElementBlock as D, openBlock as I, createElementVNode as L, renderSlot as b, createCommentVNode as j } from "vue";
import * as x from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { merge as M } from "lodash-es";
import { cesiumViewerInjectKey as N } from "../share/component.js";
import { CoordinateUtils as p } from "../share/screen.js";
const T = { class: "cesium-container" }, U = {
  ref: "cesiumContainer",
  class: "cesium-container__core"
}, q = /* @__PURE__ */ S({
  __name: "CesiumViewer",
  props: {
    options: { default: () => ({}) },
    screenEvents: { default: () => [2] }
  },
  emits: ["ready", "handler"],
  setup(s, { expose: v, emit: y }) {
    const a = k(!1), e = A(), E = V("cesiumContainer"), h = {
      timeline: !1,
      animation: !1,
      baseLayerPicker: !1
    }, c = y;
    H(() => {
      e.value = new x.Viewer(
        E.value,
        M({}, h, s.options)
      ), R(N, e), a.value = !0, C(), c("ready", e.value);
    });
    function C() {
      s.screenEvents.forEach((n) => {
        var t;
        (t = e.value) == null || t.screenSpaceEventHandler.setInputAction(async function(o) {
          const r = await p.screenToLonLat(e.value, o.position);
          c("handler", {
            type: n,
            event: o,
            position: r,
            pickedObject: p.pickRay(e.value, o.position)
          });
        }, n);
      });
    }
    function i() {
      var n;
      return (n = e == null ? void 0 : e.value) == null ? void 0 : n.isDestroyed();
    }
    function l() {
      var n, t, o, r, m;
      i() || ((t = (n = e.value) == null ? void 0 : n.entities) == null || t.removeAll(), ((r = (o = e.value) == null ? void 0 : o.screenSpaceEventHandler) == null ? void 0 : r.isDestroyed()) === !1 && (s.screenEvents.forEach((_) => {
        var d, f;
        try {
          (f = (d = e.value) == null ? void 0 : d.screenSpaceEventHandler) == null || f.removeInputAction(_);
        } catch (w) {
          window.console.error(w);
        }
      }), (m = e.value) == null || m.screenSpaceEventHandler.destroy()));
    }
    function u() {
      var n;
      i() || (n = e.value) == null || n.destroy();
    }
    return B(() => {
      l(), u();
    }), v({
      viewer: e,
      isDestroyMap: i,
      removeAll: l,
      destroy: u
    }), (n, t) => (I(), D("div", T, [
      L("div", U, null, 512),
      a.value ? b(n.$slots, "default", { key: 0 }, void 0, !0) : j("", !0)
    ]));
  }
});
export {
  q as default
};
