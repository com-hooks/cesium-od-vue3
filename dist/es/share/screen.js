import * as e from "cesium";
class h {
  /**
   * 屏幕坐标转经纬度
   * @param {Cesium.Viewer} viewer 
   * @param {Cesium.Cartesian2} screenPosition 
   * @returns {Promise<{longitude: number, latitude: number, height: number}>}
   */
  static async screenToLonLat(t, i) {
    var l;
    const r = t.scene, c = t.camera.getPickRay(i);
    if (!c) return null;
    try {
      let a = r.globe.pick(c, r);
      if (!a && (a = r.camera.pickEllipsoid(i, r.globe.ellipsoid), !a))
        return null;
      if (!((l = t == null ? void 0 : t.terrainProvider) != null && l.availability)) {
        const n = e.Cartographic.fromCartesian(a), s = e.Math.toDegrees(n.longitude), u = e.Math.toDegrees(n.latitude), g = n.height;
        return {
          longitude: s,
          latitude: u,
          height: g
        };
      }
      const o = await e.sampleTerrainMostDetailed(
        t.terrainProvider,
        [e.Cartographic.fromCartesian(a)]
      );
      return {
        longitude: e.Math.toDegrees(o[0].longitude),
        latitude: e.Math.toDegrees(o[0].latitude),
        height: o[0].height
      };
    } catch (a) {
      window.console.error(a);
    }
    return null;
  }
  static pickRay(t, i) {
    const r = t.scene.pick(i);
    return e.defined(r) ? r : null;
  }
}
export {
  h as CoordinateUtils
};
