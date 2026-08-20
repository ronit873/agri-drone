import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DroneSimulator from './components/3d/DroneSimulator';
import MissionPlanner from './components/MissionPlanner';
import FieldManagement from './components/FieldManagement';
import TelemetryHUD from './components/TelemetryHUD';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import FarmerGuide from './components/FarmerGuide';

// Initial Registered Fields with real GPS Polygon Boundaries
const INITIAL_FIELDS = [
  {
    id: 'field-1',
    name: 'Ramesh Farm — Wheat Plot A',
    location: 'Sector 4B, Ludhiana, Punjab / GPS 30.7333° N, 76.7794° E',
    area: 5.5,
    crop: 'Wheat (Gehun)',
    cropId: 'wheat',
    soil: 'Alluvial Soil',
    moisture: 68,
    pestRisk: 'Low Risk',
    growthStage: 'Seeding Ready',
    lastSurveyed: '10 mins ago',
    boundary: [
      { latitude: 30.733600, longitude: 76.779100 },
      { latitude: 30.733600, longitude: 76.780300 },
      { latitude: 30.732600, longitude: 76.780300 },
      { latitude: 30.732600, longitude: 76.779100 }
    ]
  },
  {
    id: 'field-2',
    name: 'Green Acres Paddy Field',
    location: 'Karnal, Haryana / GPS 29.6857° N, 76.9905° E',
    area: 8.0,
    crop: 'Rice / Paddy (Dhan)',
    cropId: 'rice',
    soil: 'Black Clay Loam',
    moisture: 82,
    pestRisk: 'Medium (Needs Spray)',
    growthStage: 'Vegetative Growth',
    lastSurveyed: '2 hours ago',
    boundary: [
      { latitude: 29.686400, longitude: 76.989800 },
      { latitude: 29.686500, longitude: 76.991200 },
      { latitude: 29.685800, longitude: 76.991500 },
      { latitude: 29.685100, longitude: 76.990700 },
      { latitude: 29.685300, longitude: 76.989800 }
    ]
  },
  {
    id: 'field-3',
    name: 'Suraj Kisan Cotton Plantation',
    location: 'Rajkot, Gujarat / GPS 22.3039° N, 70.8022° E',
    area: 4.2,
    crop: 'Cotton (Kapas)',
    cropId: 'cotton',
    soil: 'Sandy Loam',
    moisture: 54,
    pestRisk: 'Low Risk',
    growthStage: 'Germination Stage',
    lastSurveyed: '1 day ago',
    boundary: [
      { latitude: 22.304500, longitude: 70.801800 },
      { latitude: 22.304500, longitude: 70.802800 },
      { latitude: 22.303300, longitude: 70.802800 },
      { latitude: 22.303300, longitude: 70.801800 }
    ]
  },
  {
    id: 'field-4',
    name: 'Godavari Sugarcane Estate',
    location: 'Kolhapur, Maharashtra / GPS 16.7050° N, 74.2433° E',
    area: 6.8,
    crop: 'Sugarcane (Ganna)',
    cropId: 'sugarcane',
    soil: 'Black Soil',
    moisture: 75,
    pestRisk: 'Low Risk',
    growthStage: 'Tillering Stage',
    lastSurveyed: '3 days ago',
    boundary: [
      { latitude: 16.705600, longitude: 74.242600 },
      { latitude: 16.705700, longitude: 74.243900 },
      { latitude: 16.704800, longitude: 74.244200 },
      { latitude: 16.704200, longitude: 74.243400 },
      { latitude: 16.704400, longitude: 74.242500 }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator', 'planner', 'fields', 'telemetry', 'analytics', 'guide'

  // Load fields with LocalStorage fallback for Phase I persistence
  const [fields, setFields] = useState(() => {
    try {
      const saved = localStorage.getItem('krishi_vikas_fields');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage load error', e);
    }
    return INITIAL_FIELDS;
  });

  const [activeField, setActiveField] = useState(fields[0]);
  const [activeMission, setActiveMission] = useState(null);

  // Global Simulated Telemetry State
  const [droneState, setDroneState] = useState({
    battery: 94,
    seedsTank: 85,
    seedsCount: 12,
    waterLevel: 90,
    pesticideLevel: 88,
    distanceCovered: 120,
    status: 'In-Flight (GPS Mission Mode)'
  });

  // Keep activeField reference aligned with fields array
  useEffect(() => {
    const found = fields.find(f => f.id === activeField.id);
    if (found) {
      setActiveField(found);
    } else if (fields.length > 0) {
      setActiveField(fields[0]);
    }
  }, [fields]);

  const handleDeployToSimulator = (generatedPlan) => {
    if (generatedPlan) {
      setActiveMission(generatedPlan);
    }
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      
      {/* Top Header Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        droneState={droneState}
        activeField={activeField}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'simulator' && (
          <DroneSimulator 
            droneState={droneState}
            setDroneState={setDroneState}
            activeField={activeField}
            activeMission={activeMission}
          />
        )}

        {activeTab === 'planner' && (
          <MissionPlanner
            activeField={activeField}
            activeMission={activeMission}
            onDeployToSimulator={handleDeployToSimulator}
            onUpdateFieldPlan={(plan) => setActiveMission(plan)}
          />
        )}

        {activeTab === 'fields' && (
          <FieldManagement 
            fields={fields}
            setFields={setFields}
            activeField={activeField}
            setActiveField={setActiveField}
            onDeployDrone={() => setActiveTab('simulator')}
            onPlanMission={() => setActiveTab('planner')}
          />
        )}

        {activeTab === 'telemetry' && (
          <TelemetryHUD 
            droneState={droneState}
            setDroneState={setDroneState}
            activeField={activeField}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard 
            droneState={droneState}
            activeField={activeField}
          />
        )}

        {activeTab === 'guide' && (
          <FarmerGuide 
            onLaunchDemo={() => setActiveTab('simulator')}
          />
        )}
      </main>

    </div>
  );
}
