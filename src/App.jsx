import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DroneSimulator from './components/3d/DroneSimulator';
import FieldManagement from './components/FieldManagement';
import TelemetryHUD from './components/TelemetryHUD';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import FarmerGuide from './components/FarmerGuide';

export default function App() {
  const [activeTab, setActiveTab] = useState('simulator');

  // Initial Registered Fields Data
  const [fields, setFields] = useState([
    {
      id: 'field-1',
      name: 'Ramesh Farm - Wheat Plot A',
      location: 'Sector 4B, Punjab / GPS 30.7333° N, 76.7794° E',
      area: 5.5,
      crop: 'Wheat (Gehun)',
      soil: 'Alluvial Soil',
      moisture: 68,
      pestRisk: 'Low Risk',
      growthStage: 'Seeding Ready (10m Grid)',
      gridSpaced: '10 Meters',
      lastSurveyed: '10 mins ago'
    },
    {
      id: 'field-2',
      name: 'Green Acres Paddy Field',
      location: 'Karnal, Haryana / GPS 29.6857° N, 76.9905° E',
      area: 8.0,
      crop: 'Rice / Paddy (Dhan)',
      soil: 'Black Clay Loam',
      moisture: 82,
      pestRisk: 'Medium (Needs Spray)',
      growthStage: 'Vegetative Growth',
      gridSpaced: '10 Meters',
      lastSurveyed: '2 hours ago'
    },
    {
      id: 'field-3',
      name: 'Suraj Kisan Cotton Plantation',
      location: 'Rajkot, Gujarat / GPS 22.3039° N, 70.8022° E',
      area: 4.2,
      crop: 'Cotton (Kapas)',
      soil: 'Sandy Loam',
      moisture: 54,
      pestRisk: 'Low Risk',
      growthStage: 'Germination Stage',
      gridSpaced: '10 Meters',
      lastSurveyed: '1 day ago'
    }
  ]);

  const [activeField, setActiveField] = useState(fields[0]);

  // Global Telemetry State
  const [droneState, setDroneState] = useState({
    battery: 94,
    seedsTank: 85,
    seedsCount: 12,
    waterLevel: 90,
    pesticideLevel: 88,
    distanceCovered: 120,
    status: 'In-Flight (10m Grid Seeding)'
  });

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
          />
        )}

        {activeTab === 'fields' && (
          <FieldManagement 
            fields={fields}
            setFields={setFields}
            activeField={activeField}
            setActiveField={setActiveField}
            onDeployDrone={() => setActiveTab('simulator')}
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
