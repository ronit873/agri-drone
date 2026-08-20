/**
 * KRISHI VIKAS — Centralized Crop Configuration & Agronomic Parameters
 * 
 * IMPORTANT: These values are initial configurable engineering parameters,
 * not scientifically certified agricultural prescriptions. They are centralized
 * so they can later be tuned or replaced with agronomically validated values.
 */

export const cropConfigs = {
  wheat: {
    id: 'wheat',
    name: 'Wheat (Gehun)',
    hindiName: 'गेहूं (Gehun)',
    category: 'Cereal / Rabi',
    rowSpacing: 0.22, // meters between rows
    plantSpacing: 0.10, // meters between plants within row
    seedRate: 40, // kg/acre
    recommendedFlightAltitude: 3.5, // optimal drone survey altitude (meters)
    flightSpeed: 4.0, // m/s
    swathWidth: 4.0, // drone spray / survey swath width (meters)
    waterRate: 250, // L/acre
    pesticideRate: 1.5, // L/acre
    color: '#f59e0b',
    stemColor: '#84cc16',
    leafColor: '#a3e635',
    description: 'Rabi staple grain. Requires narrow uniform row spacing for maximum tiller production.'
  },
  rice: {
    id: 'rice',
    name: 'Rice / Paddy (Dhan)',
    hindiName: 'धान / चावल (Dhan)',
    category: 'Cereal / Kharif',
    rowSpacing: 0.20,
    plantSpacing: 0.15,
    seedRate: 15,
    recommendedFlightAltitude: 3.0,
    flightSpeed: 3.5,
    swathWidth: 3.5,
    waterRate: 400,
    pesticideRate: 2.0,
    color: '#10b981',
    stemColor: '#16a34a',
    leafColor: '#4ade80',
    description: 'High moisture requirement. Precision direct seeded rice (DSR) saves up to 35% water.'
  },
  corn: {
    id: 'corn',
    name: 'Corn / Maize (Makka)',
    hindiName: 'मक्का (Makka)',
    category: 'Cereal / Kharif & Rabi',
    rowSpacing: 0.60,
    plantSpacing: 0.20,
    seedRate: 8,
    recommendedFlightAltitude: 4.5,
    flightSpeed: 4.5,
    swathWidth: 4.5,
    waterRate: 200,
    pesticideRate: 1.2,
    color: '#eab308',
    stemColor: '#15803d',
    leafColor: '#22c55e',
    description: 'Wide row crop requiring substantial sunlight penetration and distinct ridge spacing.'
  },
  cotton: {
    id: 'cotton',
    name: 'Cotton (Kapas)',
    hindiName: 'कपास (Kapas)',
    category: 'Cash Crop / Kharif',
    rowSpacing: 0.90,
    plantSpacing: 0.45,
    seedRate: 2.5,
    recommendedFlightAltitude: 4.0,
    flightSpeed: 3.8,
    swathWidth: 4.5,
    waterRate: 180,
    pesticideRate: 2.5,
    color: '#f8fafc',
    stemColor: '#65a30d',
    leafColor: '#84cc16',
    description: 'Deep-rooted bushy crop requiring strict pest management and wide canopy clearances.'
  },
  sugarcane: {
    id: 'sugarcane',
    name: 'Sugarcane (Ganna)',
    hindiName: 'गन्ना (Ganna)',
    category: 'Cash Crop / Annual',
    rowSpacing: 1.20,
    plantSpacing: 0.30,
    seedRate: 300,
    recommendedFlightAltitude: 5.0,
    flightSpeed: 4.0,
    swathWidth: 5.0,
    waterRate: 500,
    pesticideRate: 3.0,
    color: '#059669',
    stemColor: '#047857',
    leafColor: '#34d399',
    description: 'Tall perennial crop. Drone canopy penetration requires controlled downwash pressure.'
  },
  mustard: {
    id: 'mustard',
    name: 'Mustard (Sarson)',
    hindiName: 'सरसों (Sarson)',
    category: 'Oilseed / Rabi',
    rowSpacing: 0.30,
    plantSpacing: 0.10,
    seedRate: 2.0,
    recommendedFlightAltitude: 3.5,
    flightSpeed: 4.2,
    swathWidth: 4.0,
    waterRate: 120,
    pesticideRate: 1.0,
    color: '#facc15',
    stemColor: '#4d7c0f',
    leafColor: '#a3e635',
    description: 'Dense yellow flowering oilseed requiring gentle droplet spray to prevent flower drop.'
  },
  potato: {
    id: 'potato',
    name: 'Potato (Aloo)',
    hindiName: 'आलू (Aloo)',
    category: 'Tuber / Rabi',
    rowSpacing: 0.60,
    plantSpacing: 0.20,
    seedRate: 1200,
    recommendedFlightAltitude: 3.0,
    flightSpeed: 3.5,
    swathWidth: 3.6,
    waterRate: 220,
    pesticideRate: 2.0,
    color: '#d97706',
    stemColor: '#166534',
    leafColor: '#22c55e',
    description: 'Ridge-planted tuber. Regular prophylactic fungicide spraying via drone avoids soil compaction.'
  },
  tomato: {
    id: 'tomato',
    name: 'Tomato (Tamatar)',
    hindiName: 'टमाटर (Tamatar)',
    category: 'Horticulture / Multi-Season',
    rowSpacing: 0.75,
    plantSpacing: 0.45,
    seedRate: 0.15,
    recommendedFlightAltitude: 3.2,
    flightSpeed: 3.2,
    swathWidth: 3.8,
    waterRate: 280,
    pesticideRate: 1.8,
    color: '#ef4444',
    stemColor: '#15803d',
    leafColor: '#4ade80',
    description: 'High-value vegetable crop requiring uniform micro-misting and blight protection.'
  }
};

export const CROPS = cropConfigs;
export const DEFAULT_CROP_ID = 'wheat';

export function getCropConfig(cropIdOrName) {
  if (!cropIdOrName) return cropConfigs[DEFAULT_CROP_ID];
  const normalized = String(cropIdOrName).toLowerCase();
  
  if (cropConfigs[normalized]) {
    return cropConfigs[normalized];
  }
  
  for (const key of Object.keys(cropConfigs)) {
    const crop = cropConfigs[key];
    if (
      crop.id === normalized ||
      crop.name.toLowerCase().includes(normalized) ||
      normalized.includes(crop.id) ||
      crop.hindiName.toLowerCase().includes(normalized)
    ) {
      return crop;
    }
  }
  return cropConfigs[DEFAULT_CROP_ID];
}
