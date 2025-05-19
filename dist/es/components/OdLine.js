import { defineComponent as D, inject as M, ref as P, watch as b, onUnmounted as F } from "vue";
import * as i from "cesium";
import { createCurvedLine as I, useCreateOdLineOptions as N, useCreateOdFlyLineOptions as B } from "../share/od.js";
import { merge as p } from "lodash-es";
import { tailDefaultOptions as v, cesiumViewerInjectKey as W } from "../share/component.js";
const V = /* @__PURE__ */ D({
  __name: "OdLine",
  props: {
    show: { type: Boolean, default: !0 },
    origin: {},
    destination: {},
    color: { default: "#00FAA4" },
    width: { default: 5 },
    interpolation: { default: 100 },
    sagitta: { default: 0.5 },
    midT: { default: 0.5 },
    odName: { default: "odLine" },
    tail: { default: () => ({
      ...v
    }) },
    odLineOptions: { default: () => ({}) },
    odFlyLineOptions: { default: () => ({}) },
    startPointOptions: { default: () => ({}) },
    endPointOptions: { default: () => ({}) },
    focus: { type: Boolean, default: !0 },
    animate: { type: Boolean, default: !0 },
    startEllipseSize: { default: 18e3 },
    startEllipseScaleStep: { default: 0.02 }
  },
  setup(T, { expose: x }) {
    const t = T, d = M(W);
    if (!(d != null && d.value))
      throw TypeError("viewer inject error!");
    const e = d.value, o = p({}, v, t.tail), A = i.Cartesian3.fromDegrees(
      t.origin.longitude,
      t.origin.latitude
    ), _ = i.Cartesian3.fromDegrees(
      t.destination.longitude,
      t.destination.latitude
    ), s = I(
      t.origin,
      t.destination,
      t.interpolation,
      t.sagitta,
      t.midT
    );
    let u, a, n = P(0), l = P(0);
    const m = i.Color.fromCssColorString(t.color).withAlpha(0.5);
    u = e.entities.add(
      N(
        {
          name: t.odName,
          positions: s,
          width: t.width,
          color: t.color
        },
        t.odLineOptions
      )
    ), a = e.entities.add(
      B(
        {
          name: t.odName + "_flyline",
          positions: t.animate ? new i.CallbackProperty(() => s.slice(
            Math.max(0, n.value - o.width),
            Math.max(
              0,
              n.value - o.width + o.width
            )
          ), !1) : i.Cartesian3.fromDegreesArray([]),
          width: o.width,
          color: o.color,
          glowPower: o.glowPower,
          taperPower: o.taperPower,
          position: s[0]
        },
        t.odFlyLineOptions
      )
    );
    function h() {
      return t.animate ? new i.CallbackProperty(() => t.startEllipseSize * l.value, !1) : t.startEllipseSize;
    }
    const S = p(
      {
        position: A,
        ellipse: {
          semiMajorAxis: h(),
          semiMinorAxis: h(),
          height: 0,
          fill: !0,
          extrudedHeight: 0,
          material: m,
          outline: !0,
          outlineColor: i.Color.WHITE,
          outlineWidth: 1
        },
        label: {
          text: "Origin",
          font: "14pt sans-serif",
          style: i.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: i.VerticalOrigin.BOTTOM,
          pixelOffset: new i.Cartesian2(0, -10)
        }
      },
      t.startPointOptions
    ), c = e.entities.add(S), k = p(
      {
        position: _,
        ellipse: {
          semiMajorAxis: 10,
          semiMinorAxis: 10,
          height: 0,
          fill: !0,
          extrudedHeight: 0,
          material: m,
          outline: !0,
          outlineColor: i.Color.WHITE,
          outlineWidth: 1
        },
        label: {
          text: "Destination",
          font: "14pt sans-serif",
          style: i.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: i.VerticalOrigin.BOTTOM,
          pixelOffset: new i.Cartesian2(0, -10)
        }
      },
      t.endPointOptions
    ), f = e.entities.add(k);
    function O() {
      n.value++, n.value >= s.length && (n.value = 0), l.value += t.startEllipseScaleStep, l.value >= 1 && (l.value = 0), w(s[n.value]);
    }
    function w(r) {
      try {
        a.position = r;
      } catch (E) {
        window.console.error(E);
      }
    }
    function y() {
      e.clock.onTick.addEventListener(O);
    }
    function g() {
      e.clock.onTick.addEventListener(O);
    }
    function L() {
      e.flyTo([c, f]);
    }
    t.focus && L(), t.animate && y();
    function C() {
      !e || e != null && e.isDestroyed() || (g(), e.entities.remove(u), e.entities.remove(a), e.entities.remove(c), e.entities.remove(f));
    }
    return b(
      () => t.show,
      (r) => {
        u.show = r, a.show = r, c.show = r, f.show = r;
      }
    ), F(() => {
      C();
    }), x({
      progress: n,
      scale: l,
      odLineEntity: u,
      flyOdLineEntity: a,
      startPointEntity: c,
      endPointEntity: f,
      updateFlyLinePos: w,
      focusEntities: L,
      destoryEntity: C,
      bindTickAnimate: y,
      unBindTickAnimate: g
    }), (r, E) => null;
  }
});
export {
  V as default
};
