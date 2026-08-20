/**
 * KRISHI VIKAS — Field & Polygon Boundary Validation Module
 * Enforces geospatial and topological validity before mission generation.
 */

/**
 * Validates a field and its GPS boundary polygon.
 * 
 * @param {Object} field
 * @param {Array<{latitude: number, longitude: number}>} [field.boundary]
 * @returns {{isValid: boolean, errors: string[], warnings: string[]}}
 */
export function validateField(field) {
  const errors = [];
  const warnings = [];

  if (!field) {
    return { isValid: false, errors: ['Field object is undefined or empty.'], warnings: [] };
  }

  // 1. Basic field properties validation
  if (!field.name || !field.name.trim()) {
    errors.push('Field name is required.');
  }

  // Extract boundary points (support both {latitude, longitude} and {lat, lng})
  const boundary = field.boundary || field.polygon || [];

  // 2. Minimum point count (polygon requires at least 3 distinct vertices)
  if (!Array.isArray(boundary) || boundary.length < 3) {
    errors.push(`Field boundary requires at least 3 GPS vertices (currently ${boundary.length}).`);
    return { isValid: false, errors, warnings };
  }

  // 3. Validate coordinate ranges & impossible values
  const normalizedPoints = [];
  for (let i = 0; i < boundary.length; i++) {
    const pt = boundary[i];
    const lat = pt.latitude !== undefined ? Number(pt.latitude) : Number(pt.lat);
    const lng = pt.longitude !== undefined ? Number(pt.longitude) : Number(pt.lng);

    if (isNaN(lat) || isNaN(lng)) {
      errors.push(`Vertex #${i + 1} contains non-numeric GPS coordinates: lat=${pt.latitude || pt.lat}, lng=${pt.longitude || pt.lng}`);
      continue;
    }

    if (lat < -90 || lat > 90) {
      errors.push(`Vertex #${i + 1} latitude (${lat}) is out of valid range [-90°, +90°].`);
    }

    if (lng < -180 || lng > 180) {
      errors.push(`Vertex #${i + 1} longitude (${lng}) is out of valid range [-180°, +180°].`);
    }

    normalizedPoints.push({ lat, lng, index: i });
  }

  if (errors.length > 0) {
    return { isValid: false, errors, warnings };
  }

  // 4. Duplicate consecutive points check
  for (let i = 0; i < normalizedPoints.length; i++) {
    const curr = normalizedPoints[i];
    const next = normalizedPoints[(i + 1) % normalizedPoints.length];

    // Check if points are identical (within ~0.1 meter)
    const latDiff = Math.abs(curr.lat - next.lat);
    const lngDiff = Math.abs(curr.lng - next.lng);

    if (latDiff < 0.000001 && lngDiff < 0.000001) {
      if (i === normalizedPoints.length - 1) {
        // Last point matching first point is just explicit closure, safe to ignore
        continue;
      }
      errors.push(`Duplicate consecutive vertex detected between Vertex #${curr.index + 1} and #${next.index + 1}.`);
    }
  }

  // 5. Area / Collinearity check (all points on a straight line)
  let sumArea = 0;
  for (let i = 0; i < normalizedPoints.length; i++) {
    const j = (i + 1) % normalizedPoints.length;
    sumArea += normalizedPoints[i].lng * normalizedPoints[j].lat;
    sumArea -= normalizedPoints[j].lng * normalizedPoints[i].lat;
  }

  if (Math.abs(sumArea) < 1e-12) {
    errors.push('Field boundary vertices are collinear (zero surface area). Please draw a 2D enclosed polygon.');
  }

  // 6. Warnings for unusual boundaries
  if (normalizedPoints.length > 30) {
    warnings.push(`Field has ${normalizedPoints.length} vertices. Complex polygons may result in longer mission generation times.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
