/**
 * KRISHI VIKAS — Geodetic & Coordinate Transformation Utilities
 * 
 * Coordinate Transformation Pipeline:
 * Real GPS (WGS-84: Latitude, Longitude in degrees)
 *   ↓  (Equirectangular projection centered at field datum centroid)
 * Local Metric Cartesian Coordinates (X: Easting in meters, Z: Northing in meters)
 *   ↓  (Mapped to 3D simulation coordinate frame)
 * Three.js World Coordinates (X: East, Y: Altitude up, Z: South)
 */

export const EARTH_RADIUS_METERS = 6378137.0; // WGS-84 equatorial radius

/**
 * Standardize point to {lat, lng} regardless of whether input uses {latitude, longitude} or {lat, lng}.
 */
export function normalizeGpsPoint(pt) {
  if (!pt) return { lat: 0, lng: 0 };
  const lat = pt.latitude !== undefined ? Number(pt.latitude) : Number(pt.lat);
  const lng = pt.longitude !== undefined ? Number(pt.longitude) : Number(pt.lng);
  return { lat, lng };
}

/**
 * Calculate Haversine great-circle distance between two GPS points in meters.
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

/**
 * Calculate centroid (datum center of mass) of a GPS polygon.
 */
export function getPolygonCentroid(polygon) {
  if (!polygon || polygon.length === 0) {
    return { lat: 30.7333, lng: 76.7794 };
  }
  let sumLat = 0;
  let sumLng = 0;
  for (const pt of polygon) {
    const { lat, lng } = normalizeGpsPoint(pt);
    sumLat += lat;
    sumLng += lng;
  }
  return {
    lat: sumLat / polygon.length,
    lng: sumLng / polygon.length
  };
}

/**
 * Converts GPS (lat, lng) to Local Cartesian metric coordinates (x, z) in meters relative to datum.
 * +X = East (meters)
 * +Z = South (meters) [Inverted northing for Three.js coordinates]
 */
export function gpsToLocal(lat, lng, originLat, originLng) {
  const latRad = (originLat * Math.PI) / 180;
  const dLat = ((lat - originLat) * Math.PI) / 180;
  const dLon = ((lng - originLng) * Math.PI) / 180;

  const x = dLon * EARTH_RADIUS_METERS * Math.cos(latRad);
  const z = -dLat * EARTH_RADIUS_METERS;
  return { x, z };
}

/**
 * Converts Local Cartesian metric coordinates (x, z) back to GPS (lat, lng).
 */
export function localToGps(x, z, originLat, originLng) {
  const latRad = (originLat * Math.PI) / 180;
  const dLat = -z / EARTH_RADIUS_METERS;
  const dLon = x / (EARTH_RADIUS_METERS * Math.cos(latRad));

  const lat = originLat + (dLat * 180) / Math.PI;
  const lng = originLng + (dLon * 180) / Math.PI;
  return { lat, lng };
}

/**
 * Converts GPS polygon vertices to Local Cartesian metric polygon.
 */
export function polygonGpsToLocal(gpsPolygon, origin) {
  const datum = origin || getPolygonCentroid(gpsPolygon);
  return gpsPolygon.map(pt => {
    const { lat, lng } = normalizeGpsPoint(pt);
    const local = gpsToLocal(lat, lng, datum.lat, datum.lng);
    return {
      x: local.x,
      z: local.z,
      lat,
      lng,
      latitude: lat,
      longitude: lng
    };
  });
}

/**
 * Calculate the geodesic surface area of a GPS polygon in square meters, acres, and hectares.
 */
export function calculatePolygonArea(polygon) {
  if (!polygon || polygon.length < 3) return { sqMeters: 0, acres: 0, hectares: 0 };

  const centroid = getPolygonCentroid(polygon);
  const localPts = polygonGpsToLocal(polygon, centroid);

  let area = 0;
  const n = localPts.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += localPts[i].x * localPts[j].z;
    area -= localPts[j].x * localPts[i].z;
  }
  const sqMeters = Math.abs(area) / 2;
  const acres = sqMeters / 4046.8564224;
  const hectares = sqMeters / 10000;

  return {
    sqMeters: Math.round(sqMeters),
    acres: Number(acres.toFixed(2)),
    hectares: Number(hectares.toFixed(2))
  };
}

/**
 * Ray-casting algorithm to test if local point (x, z) is inside local polygon.
 */
export function isPointInLocalPolygon(pt, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, zi = polygon[i].z;
    const xj = polygon[j].x, zj = polygon[j].z;

    const intersect =
      zi > pt.z !== zj > pt.z &&
      pt.x < ((xj - xi) * (pt.z - zi)) / (zj - zi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Calculate polygon bounding box in local metric coordinates.
 */
export function getLocalBoundingBox(localPolygon) {
  let minX = Infinity, maxX = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  for (const pt of localPolygon) {
    if (pt.x < minX) minX = pt.x;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.z < minZ) minZ = pt.z;
    if (pt.z > maxZ) maxZ = pt.z;
  }

  return { minX, maxX, minZ, maxZ, width: maxX - minX, height: maxZ - minZ };
}
