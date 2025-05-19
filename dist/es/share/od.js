import * as e from "cesium";
import { merge as c } from "lodash-es";
const h = (o, t, l, w, d) => {
  const i = e.Cartesian3.fromDegrees(o.longitude, o.latitude), n = e.Cartesian3.fromDegrees(t.longitude, t.latitude), u = e.Cartesian3.lerp(i, n, d, new e.Cartesian3()), r = e.Cartographic.fromCartesian(u);
  r.height = e.Cartesian3.distance(i, n) * w;
  const p = e.Cartesian3.fromRadians(
    r.longitude,
    r.latitude,
    r.height
  ), C = [];
  for (let s = 0; s <= l; s++) {
    const a = s / l, g = e.Cartesian3.lerp(i, p, a, new e.Cartesian3()), m = e.Cartesian3.lerp(p, n, a, new e.Cartesian3());
    C.push(e.Cartesian3.lerp(g, m, a, new e.Cartesian3()));
  }
  return C;
};
function y(o, t) {
  return c({
    name: o.name,
    polyline: {
      positions: o.positions,
      width: o.width,
      material: new e.PolylineGlowMaterialProperty({
        glowPower: 0.2,
        color: e.Color.fromCssColorString(o.color),
        taperPower: 0.9
      }),
      arcType: e.ArcType.NONE
    }
  }, t);
}
function P(o, t) {
  return c({
    position: o.position,
    polyline: {
      positions: o.positions,
      width: o.width,
      material: new e.PolylineGlowMaterialProperty({
        glowPower: o.glowPower,
        color: e.Color.fromCssColorString(o.color),
        taperPower: o.taperPower
      }),
      arcType: e.ArcType.NONE
    }
  }, t);
}
export {
  h as createCurvedLine,
  P as useCreateOdFlyLineOptions,
  y as useCreateOdLineOptions
};
