import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import DroneSimulator from './components/3d/DroneSimulator';
import MissionPlanner from './components/MissionPlanner';
import FieldManagement from './components/FieldManagement';
import PlantHealthView from './components/PlantHealthView';
import AlertsView from './components/AlertsView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';

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
  const [activeTab, setActiveTab] = useState('overview');

  // Day / Night Theme State ('dark' or 'light')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('krishi_vikas_theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('krishi_vikas_theme', theme);
  }, [theme]);

  // Toggle Day & Night Mode function
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Load fields with LocalStorage fallback
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

  // Global Telemetry State
  const [droneState, setDroneState] = useState({
    battery: 94,
    seedsTank: 85,
    seedsCount: 12,
    waterLevel: 90,
    pesticideLevel: 88,
    distanceCovered: 120,
    status: 'In-Flight (GPS Mission Mode)'
  });

  // Keep activeField reference aligned
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
    setActiveTab('overview');
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col antialiased transition-colors duration-300 ${
      theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      
      {/* Navigation Shell: Left Sidebar & Header Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        droneState={droneState}
        activeField={activeField}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main GCS Workspace Viewport */}
      <main className="flex-1 lg:pl-[260px]">
        {(activeTab === 'overview' || activeTab === 'dashboard') && (
          <DashboardView 
            droneState={droneState}
            setDroneState={setDroneState}
            activeField={activeField}
            activeMission={activeMission}
            onNavigateTab={setActiveTab}
            theme={theme}
          />
        )}

        {activeTab === 'fields' && (
          <FieldManagement 
            fields={fields}
            setFields={setFields}
            activeField={activeField}
            setActiveField={setActiveField}
            onDeployDrone={() => setActiveTab('drone')}
            onPlanMission={() => setActiveTab('missions')}
            theme={theme}
          />
        )}

        {(activeTab === 'missions' || activeTab === 'planner') && (
          <MissionPlanner
            activeField={activeField}
            activeMission={activeMission}
            onDeployToSimulator={handleDeployToSimulator}
            onUpdateFieldPlan={(plan) => setActiveMission(plan)}
            theme={theme}
          />
        )}

        {(activeTab === 'drone' || activeTab === 'simulator') && (
          <div className="w-full h-full relative">
            <DroneSimulator 
              droneState={droneState}
              setDroneState={setDroneState}
              activeField={activeField}
              activeMission={activeMission}
              theme={theme}
            />
          </div>
        )}

        {activeTab === 'plant_health' && (
          <PlantHealthView 
            activeField={activeField}
            theme={theme}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsView 
            onNavigateTab={setActiveTab}
            theme={theme}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView 
            activeField={activeField}
            theme={theme}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView 
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </main>

    </div>
  );
}
