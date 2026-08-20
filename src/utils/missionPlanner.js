/**
 * KRISHI VIKAS — Mission Planner Service
 * Adapts and exposes waypoint generation and export utilities.
 */

import { generateWaypoints, MISSION_TYPES } from './waypointGenerator.js';

export { MISSION_TYPES };

export function generateMissionPlan({ polygon, boundary, crop, customParams = {}, missionType = MISSION_TYPES.SEEDING }) {
  const fieldBoundary = boundary || polygon;
  return generateWaypoints({
    boundary: fieldBoundary,
    cropConfig: crop,
    missionType,
    flightAltitude: customParams.altitude || customParams.flightAltitude,
    rowSpacing: customParams.rowSpacing,
    plantSpacing: customParams.plantSpacing,
    flightSpeed: customParams.speed || customParams.flightSpeed,
    swathWidth: customParams.swathWidth
  });
}

/**
 * Export waypoints to QGroundControl / Mission Planner CSV format.
 */
export function exportWaypointsToCsv(missionPlan) {
  if (!missionPlan || !missionPlan.waypoints) return '';
  
  const headers = ['SEQUENCE', 'COMMAND', 'LATITUDE', 'LONGITUDE', 'ALTITUDE_M', 'SPEED_M_S', 'ACTION'];
  const rows = missionPlan.waypoints.map(wp => [
    wp.sequence || wp.index,
    wp.command,
    wp.latitude.toFixed(7),
    wp.longitude.toFixed(7),
    wp.altitude.toFixed(1),
    wp.speed.toFixed(1),
    `"${wp.action || wp.actionDescription}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

/**
 * Export complete mission plan to JSON format.
 */
export function exportWaypointsToJson(missionPlan) {
  if (!missionPlan) return '{}';
  return JSON.stringify({
    project: 'KRISHI VIKAS AI DRONE',
    phase: 'Phase I: GPS Mission Planner',
    version: '1.0.0',
    generatedAt: missionPlan.createdAt || new Date().toISOString(),
    missionId: missionPlan.id,
    missionType: missionPlan.type,
    crop: missionPlan.crop.name,
    areaAcres: missionPlan.areaInfo.acres,
    metrics: missionPlan.metrics,
    datum: missionPlan.datum,
    parameters: missionPlan.parameters,
    boundary: missionPlan.boundary,
    waypoints: missionPlan.waypoints
  }, null, 2);
}
