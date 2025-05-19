import { defineComponent as C, inject as g, shallowRef as p, watch as k, onUnmounted as v } from "vue";
import * as n from "cesium";
import { cesiumViewerInjectKey as B, holesDefaultBorderOptions as D } from "../share/component.js";
import { merge as h } from "lodash-es";
const S = /* @__PURE__ */ C({
  __name: "LayerMask",
  props: {
    holes: { default: () => [] },
    maskColor: { default: "rgba(0, 0, 0, 0.5)" },
    options: { default: () => ({}) },
    name: { default: "layerMask" },
    maskRange: { default: () => [] },
    holeLineColor: { default: "#6dcdeb" },
    showHoleBorder: { type: Boolean, default: !0 },
    holesBorderOptions: { default: () => ({}) }
  },
  setup(o, { expose: y }) {
    const s = g(B);
    if (!(s != null && s.value))
      throw TypeError("viewer inject error!");
    const t = s.value;
    let l = p();
    const a = new n.CustomDataSource("holeLines");
    t.dataSources.add(a);
    function u(r) {
      return r.map((e) => ({
        positions: n.Cartesian3.fromDegreesArray(e.positions.flat()),
        holes: u((e == null ? void 0 : e.holes) ?? [])
      }));
    }
    function d(r) {
      r.forEach((e) => {
        a.entities.add(h(
          {
            polyline: {
              positions: e.positions,
              material: n.Color.fromCssColorString(o.holeLineColor)
            }
          },
          D,
          o.holesBorderOptions
        )), d(e.holes ?? []);
      });
    }
    function f() {
      a.entities.removeAll();
    }
    function i() {
      const r = n.Cartesian3.fromDegreesArray(
        o.maskRange.flat()
      ), e = u(o.holes);
      o.showHoleBorder && d(e), l.value = t.entities.add(
        h(
          {
            name: o.name,
            polygon: {
              hierarchy: {
                // 定义多边形或孔外边界的线性环。
                positions: r,
                // 一组多边形层次结构，定义多边形中的孔。
                holes: e
              },
              // 填充多边形的材质
              material: n.Color.fromCssColorString(o.maskColor),
              height: 0,
              extrudedHeight: 0,
              outline: !1
            }
          },
          o.options
        )
      );
    }
    i();
    function c() {
      !t || t != null && t.isDestroyed() || (m(), t.dataSources.remove(a));
    }
    function m() {
      l.value && t.entities.remove(l.value);
    }
    return k(
      () => o.holes,
      () => {
        m(), f(), i();
      },
      {
        deep: !0
      }
    ), v(() => {
      c();
    }), y({
      layerMaskEntiy: l,
      holeLineDataSource: a,
      clearHoleBorder: f,
      destoryEntity: c,
      updateLayerMask: i
    }), (r, e) => null;
  }
});
export {
  S as default
};
