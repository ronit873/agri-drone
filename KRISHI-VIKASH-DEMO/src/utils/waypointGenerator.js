/**
 * KRISHI VIKAS — Dedicated GPS Waypoint & Mission Generator Module
 * 
 * Generates systematic Boustrophedon (lawnmower) flight paths constrained
 * within real GPS field boundaries according to crop-specific agronomic parameters.
 */

import {
  getPolygonCentroid,
  polygonGpsToLocal,
  localToGps,
  getLocalBoundingBox,
  isPointInLocalPolygon,
  calculatePolygonArea,
  haversineDistance
} from './geoUtils.js';
import { getCropConfig } from '../data/cropConfig.js';
import { validateField } from './fieldValidator.js';

export const MISSION_TYPES = {
  SEEDING: 'SEEDING',
  SURVEY: 'SURVEY',
  SPRAYING: 'SPRAYING'
};

/**
 * Generate a deterministic sequence of GPS waypoints for agricultural operations.
 * 
 * @param {Object} options
 * @param {Array<{latitude: number, longitude: number}>} options.boundary - Ordered polygon GPS vertices
 * @param {Object|string} options.cropConfig - Crop configuration or crop ID
 * @param {string} [options.missionType='SEEDING'] - 'SEEDING', 'SURVEY', or 'SPRAYING'
 * @param {number} [options.flightAltitude] - Override flight altitude in meters
 * @param {number} [options.rowSpacing] - Override row spacing in meters
 * @param {number} [options.plantSpacing] - Override plant spacing in meters
 * @param {number} [options.flightSpeed] - Override flight speed in m/s
 * @param {number} [options.swathWidth] - Override swath width in meters
 * @returns {Object} Generated mission object with waypoints and analytics
 */
export function generateWaypoints({
  boundary,
  cropConfig,
  missionType = MISSION_TYPES.SEEDING,
  flightAltitude,
  rowSpacing,
  plantSpacing,
  flightSpeed,
  swathWidth
}) {
  const validation = validateField({ name: 'ValidationCheck', boundary });
  if (!validation.isValid) {
    throw new Error(`Cannot generate waypoints: ${validation.errors.join(' ')}`);
  }

  // Resolve crop config
  const cfg = typeof cropConfig === 'string' ? getCropConfig(cropConfig) : (cropConfig || getCropConfig('wheat'));

  // Agronomic and flight parameters
  const alt = flightAltitude !== undefined ? Number(flightAltitude) : cfg.recommendedFlightAltitude;
  const rowSp = rowSpacing !== undefined ? Number(rowSpacing) : cfg.rowSpacing;
  const plantSp = plantSpacing !== undefined ? Number(plantSpacing) : cfg.plantSpacing;
  const spd = flightSpeed !== undefined ? Number(flightSpeed) : cfg.flightSpeed;
  const swath = swathWidth !== undefined ? Number(swathWidth) : cfg.swathWidth;

  const datum = getPolygonCentroid(boundary);
  const localPoly = polygonGpsToLocal(boundary, datum);
  const bbox = getLocalBoundingBox(localPoly);
  const areaInfo = calculatePolygonArea(boundary);

  const waypoints = [];
  const seedDropPositions = [];
  let sequence = 1;

  // Margin buffer inside boundary to ensure drone stays strictly within parcel
  const margin = Math.max(0.5, Math.min(2.0, swath / 4));
  const minX = bbox.minX + margin;
  const maxX = bbox.maxX - margin;
  const minZ = bbox.minZ + margin;
  const maxZ = bbox.maxZ - margin;

  // Home / Takeoff coordinate (near first polygon vertex)
  const homeLocal = { x: minX, z: minZ, y: 0 };
  const homeGps = localToGps(homeLocal.x, homeLocal.z, datum.lat, datum.lng);

  // 1. TAKEOFF WAYPOINT
  waypoints.push({
    sequence: sequence++,
    type: 'TAKEOFF',
    command: 'TAKEOFF',
    latitude: Number(homeGps.lat.toFixed(7)),
    longitude: Number(homeGps.lng.toFixed(7)),
    altitude: alt,
    action: 'TAKEOFF',
    actionDescription: `Ascend to operational survey altitude (${alt}m)`,
    speed: spd,
    localX: Number(homeLocal.x.toFixed(2)),
    localY: alt,
    localZ: Number(homeLocal.z.toFixed(2))
  });

  // Track step between parallel swaths
  const trackStep = Math.max(1.0, swath);
  let directionZ = 1; // 1 = North to South (+Z), -1 = South to North (-Z)

  // 2. BOUSTROPHEDON (Lawnmower) SWEEP PASSES
  for (let x = minX; x <= maxX; x += trackStep) {
    const startZ = directionZ === 1 ? minZ : maxZ;
    const endZ = directionZ === 1 ? maxZ : minZ;

    // Ray-sample along current X line to identify polygon entry & exit bounds
    const numSamples = Math.max(20, Math.ceil((maxZ - minZ) / 0.25));
    let entryZ = null;
    let exitZ = null;

    for (let i = 0; i <= numSamples; i++) {
      const currentZ = startZ + (directionZ * (maxZ - minZ) * i) / numSamples;
      const inside = isPointInLocalPolygon({ x, z: currentZ }, localPoly);

      if (inside) {
        if (entryZ === null) entryZ = currentZ;
        exitZ = currentZ;
      }
    }

    // Only create swaths where line intersects field polygon
    if (entryZ !== null && exitZ !== null && Math.abs(exitZ - entryZ) >= 1.0) {
      // Swath Entry Waypoint
      const entryGps = localToGps(x, entryZ, datum.lat, datum.lng);
      waypoints.push({
        sequence: sequence++,
        type: 'SWATH_ENTRY',
        command: 'WAYPOINT',
        latitude: Number(entryGps.lat.toFixed(7)),
        longitude: Number(entryGps.lng.toFixed(7)),
        altitude: alt,
        action: missionType === MISSION_TYPES.SEEDING ? 'START_SEEDING' : missionType === MISSION_TYPES.SPRAYING ? 'START_SPRAY' : 'SURVEY_PASS',
        actionDescription: `Enter swath line at X=${x.toFixed(1)}m`,
        speed: spd,
        localX: Number(x.toFixed(2)),
        localY: alt,
        localZ: Number(entryZ.toFixed(2))
      });

      // Seeding / Micro-spray trigger points along this swath pass
      const swathLength = Math.abs(exitZ - entryZ);
      const stepZ = directionZ * Math.max(0.4, plantSp * 3.5); // Simulation spacing step
      const numDrops = Math.floor(swathLength / Math.abs(stepZ));

      for (let s = 1; s <= numDrops; s++) {
        const dropZ = entryZ + s * stepZ;
        const dropGps = localToGps(x, dropZ, datum.lat, datum.lng);
        seedDropPositions.push({
          localX: Number(x.toFixed(2)),
          localY: 0,
          localZ: Number(dropZ.toFixed(2)),
          latitude: Number(dropGps.lat.toFixed(7)),
          longitude: Number(dropGps.lng.toFixed(7)),
          cropId: cfg.id,
          action: 'SEED'
        });
      }

      // Swath Exit Waypoint
      const exitGps = localToGps(x, exitZ, datum.lat, datum.lng);
      waypoints.push({
        sequence: sequence++,
        type: 'SWATH_EXIT',
        command: 'WAYPOINT',
        latitude: Number(exitGps.lat.toFixed(7)),
        longitude: Number(exitGps.lng.toFixed(7)),
        altitude: alt,
        action: missionType === MISSION_TYPES.SEEDING ? 'STOP_SEEDING' : missionType === MISSION_TYPES.SPRAYING ? 'STOP_SPRAY' : 'TURN',
        actionDescription: `Exit swath line and execute turn`,
        speed: spd,
        localX: Number(x.toFixed(2)),
        localY: alt,
        localZ: Number(exitZ.toFixed(2))
      });

      // Invert direction for alternating lawnmower pass
      directionZ = -directionZ;
    }
  }

  // 3. RETURN TO LAUNCH (RTL / RTH) WAYPOINT
  waypoints.push({
    sequence: sequence++,
    type: 'RTH',
    command: 'RTL',
    latitude: Number(homeGps.lat.toFixed(7)),
    longitude: Number(homeGps.lng.toFixed(7)),
    altitude: alt,
    action: 'RTL',
    actionDescription: 'Return to Launch (RTH) and auto-land',
    speed: spd,
    localX: Number(homeLocal.x.toFixed(2)),
    localY: alt,
    localZ: Number(homeLocal.z.toFixed(2))
  });

  // Calculate total route distance
  let totalDistanceMeters = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const p1 = waypoints[i];
    const p2 = waypoints[i + 1];
    totalDistanceMeters += haversineDistance(p1.latitude, p1.longitude, p2.latitude, p2.longitude);
  }

  const flightTimeSeconds = totalDistanceMeters / spd + (waypoints.length * 1.5);
  const estimatedTimeMinutes = Number((flightTimeSeconds / 60).toFixed(1));
  const totalSeeds = Math.round(areaInfo.acres * cfg.seedRate * 1000);
  const totalWater = Number((areaInfo.acres * cfg.waterRate).toFixed(1));
  const totalPesticide = Number((areaInfo.acres * cfg.pesticideRate).toFixed(2));
  const batteryUsage = Math.min(98, Math.round((flightTimeSeconds / (25 * 60)) * 100));

  return {
    id: `mission-${Date.now()}`,
    type: missionType,
    crop: cfg,
    boundary,
    datum,
    localPolygon: localPoly,
    boundingBox: bbox,
    areaInfo,
    parameters: {
      rowSpacing: rowSp,
      plantSpacing: plantSp,
      flightAltitude: alt,
      flightSpeed: spd,
      swathWidth: swath
    },
    waypoints,
    seedDropPositions,
    metrics: {
      totalWaypoints: waypoints.length,
      totalDistanceMeters: Math.round(totalDistanceMeters),
      totalDistanceKm: Number((totalDistanceMeters / 1000).toFixed(2)),
      estimatedTimeMinutes,
      totalSeedsEstimated: totalSeeds,
      totalWaterLitres: totalWater,
      totalPesticideLitres: totalPesticide,
      estimatedBatteryUsage: batteryUsage
    },
    createdAt: new Date().toISOString(),
    status: 'READY_FOR_SIMULATION'
  };
}
