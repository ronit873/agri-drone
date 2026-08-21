import React, { useState, useEffect } from 'react';
import DroneSimulator from './components/3d/DroneSimulator';

const INITIAL_FIELD = {
  id: 'demo-field',
  name: 'Demo Field',
  location: 'Exhibition Hall / Demo Coord',
  area: 5.5,
  crop: 'Wheat (Gehun)',
  cropId: 'wheat',
  boundary: [
    { latitude: 30.733600, longitude: 76.779100 },
    { latitude: 30.733600, longitude: 76.780300 },
    { latitude: 30.732600, longitude: 76.780300 },
    { latitude: 30.732600, longitude: 76.779100 }
  ]
};

export default function App() {
  const [demoStep, setDemoStep] = useState('IDLE'); 
  // Steps: IDLE -> TAKEOFF -> NORMAL_FLIGHT -> SURVEY -> SEEDING -> WATER -> PESTICIDE -> RETURN -> LANDED

  const [droneState, setDroneState] = useState({
    battery: 100,
    seedsTank: 100,
    seedsCount: 0,
    waterLevel: 100,
    pesticideLevel: 100,
    distanceCovered: 0,
    status: 'Grounded - Ready to Start',
    altitude: 0.0,
    speed: 0.0
  });

  const [logs, setLogs] = useState(["System Ready. Awaiting Sequence."]);

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev].slice(0, 10));
  };

  const handleSequence = (step) => {
    setDemoStep(step);
    let newStatus = '';
    if (step === 'TAKEOFF') newStatus = 'Taking Off...';
    if (step === 'NORMAL_FLIGHT') newStatus = 'Normal Navigation Flight (No Payload)';
    if (step === 'SURVEY') newStatus = 'SIMULATED DEMO: Survey & AI Detection Active';
    if (step === 'SEEDING') newStatus = 'Precision Seeding Active';
    if (step === 'WATER') newStatus = 'Water Irrigation Active';
    if (step === 'PESTICIDE') newStatus = 'SIMULATED PESTICIDE APPLICATION';
    if (step === 'RETURN') newStatus = 'Returning to Home Base...';
    if (step === 'LANDED') newStatus = 'Mission Complete - Drone Landed';
    if (step === 'IDLE') newStatus = 'Grounded - Ready to Start';
    
    addLog(newStatus);
    setDroneState(prev => ({ ...prev, status: newStatus }));
  };

  const renderReset = () => {
    setDemoStep('IDLE');
    setDroneState({
      battery: 100,
      seedsTank: 100,
      seedsCount: 0,
      waterLevel: 100,
      pesticideLevel: 100,
      distanceCovered: 0,
      status: 'Grounded - Ready to Start',
      altitude: 0.0,
      speed: 0.0
    });
    setLogs(["SIMULATION RESET to Initial State."]);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans flex flex-col md:flex-row text-white overflow-hidden">
      
      {/* LEFT PANEL: 3D Visualization */}
      <div className="w-full md:w-3/4 relative h-[60vh] md:h-screen">
        {/* Absolutely positioned overlay title */}
        <div className="absolute top-4 left-4 z-50 bg-black/60 p-3 rounded-xl border border-slate-700 pointer-events-none">
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            KRISHI VIKASH PRESENTATION DEMO
          </h1>
          <p className="text-xs text-yellow-500 font-mono mt-1">SIMULATION / DEMONSTRATION MODE ONLY</p>
        </div>

        <DroneSimulator 
          droneState={droneState}
          setDroneState={setDroneState}
          activeField={INITIAL_FIELD}
          demoStep={demoStep}
          addLog={addLog}
        />
      </div>

      {/* RIGHT PANEL: Sequence Controls, Telemetry & Analytics */}
      <div className="w-full md:w-1/4 h-[40vh] md:h-screen overflow-y-auto bg-slate-900 border-l border-slate-800 p-4 flex flex-col gap-6">
        
        {/* Sequence Control Panel */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Mission Sequence control</h2>
          
          <div className="flex flex-col gap-2">
             <button disabled={demoStep !== 'IDLE'} onClick={() => handleSequence('TAKEOFF')} className="px-4 py-2 bg-slate-700 hover:bg-emerald-600 disabled:opacity-30 rounded text-sm text-left transition-colors font-medium text-white shadow-sm border border-slate-600">
               <span className="font-mono text-emerald-400 mr-2">01</span> MISSION START (TAKE OFF)
             </button>
             <button disabled={demoStep === 'IDLE' || demoStep === 'LANDED'} onClick={() => handleSequence('NORMAL_FLIGHT')} className="px-4 py-2 bg-slate-700 hover:bg-cyan-600 disabled:opacity-30 rounded text-sm text-left transition-colors font-medium border border-slate-600">
               <span className="font-mono text-cyan-400 mr-2">02</span> NORMAL FLIGHT
             </button>
             <button disabled={demoStep === 'IDLE' || demoStep === 'LANDED'} onClick={() => handleSequence('SURVEY')} className="px-4 py-2 bg-slate-700 hover:bg-purple-600 disabled:opacity-30 rounded text-sm text-left transition-colors font-medium border border-slate-600">
               <span className="font-mono text-purple-400 mr-2">03</span> FIELD SURVEY (SIM. AI)
             </button>
             <button disabled={demoStep === 'IDLE' || demoStep === 'LANDED'} onClick={() => handleSequence('SEEDING')} className="px-4 py-2 bg-slate-700 hover:bg-emerald-600 disabled:opacity-30 rounded text-sm text-left transition-colors font-medium border border-slate-600">
               <span className="font-mono text-emerald-400 mr-2">04</span> PRECISION SEEDING
             </button>
             <button disabled={demoStep === 'IDLE' || demoStep === 'LANDED'} onClick={() => handleSequence('WATER')} className="px-4 py-2 bg-slate-700 hover:bg-blue-600 disabled:opacity-30 rounded text-sm text-left transition-colors font-medium border border-slate-600">
               <span className="font-mono text-blue-400 mr-2">05</span> WATER APPLICATION
             </button>
             <button disabled={demoStep === 'IDLE' || demoStep === 'LANDED'} onClick={() => handleSequence('PESTICIDE')} className="px-4 py-2 bg-slate-700 hover:bg-amber-600 disabled:opacity-30 rounded text-sm text-left transition-colors font-medium border border-slate-600">
               <span className="font-mono text-amber-500 mr-2">06</span> PESTICIDE SPRAY
             </button>
             <button disabled={demoStep === 'IDLE' || demoStep === 'LANDED'} onClick={() => handleSequence('RETURN')} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 rounded text-sm text-left transition-colors font-medium border border-slate-600">
               <span className="font-mono text-slate-400 mr-2">07</span> RETURN HOME
             </button>
             <button disabled={demoStep === 'IDLE' || demoStep === 'LANDED'} onClick={() => handleSequence('LANDED')} className="px-4 py-2 bg-slate-700 hover:bg-emerald-700 disabled:opacity-30 rounded text-sm text-left transition-colors font-medium border border-slate-600">
               <span className="font-mono text-white mr-2">08</span> LAND (MISSION COMPLETE)
             </button>
          </div>
          
          <button onClick={renderReset} className="w-full mt-4 px-4 py-3 bg-red-900/50 hover:bg-red-600 text-red-100 rounded text-sm transition-colors border border-red-800/50 shadow-inner font-bold">
            RESET SIMULATION
          </button>
        </div>

        {/* Telemetry Display */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Simulated Telemetry</h2>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-slate-900 p-2 border border-slate-700 rounded"><span className="text-slate-500">BATTERY:</span> <br/><span className="text-emerald-400 text-base">{Math.max(0, droneState.battery.toFixed(1))}%</span></div>
            <div className="bg-slate-900 p-2 border border-slate-700 rounded"><span className="text-slate-500">ALTITUDE:</span> <br/><span className="text-blue-300 text-base">{droneState.altitude.toFixed(1)} m</span></div>
            <div className="bg-slate-900 p-2 border border-slate-700 rounded"><span className="text-slate-500">DISTANCE:</span> <br/><span className="text-cyan-300 text-base">{droneState.distanceCovered.toFixed(1)} m</span></div>
            <div className="bg-slate-900 p-2 border border-slate-700 rounded"><span className="text-slate-500">SEEDS PLACED:</span> <br/><span className="text-green-300 text-base">{droneState.seedsCount}</span></div>
            <div className="bg-slate-900 p-2 border border-slate-700 rounded"><span className="text-slate-500">WATER CAP:</span> <br/><span className="text-blue-500 text-base">{droneState.waterLevel.toFixed(1)}%</span></div>
            <div className="bg-slate-900 p-2 border border-slate-700 rounded"><span className="text-slate-500">PEST CAP:</span> <br/><span className="text-amber-500 text-base">{droneState.pesticideLevel.toFixed(1)}%</span></div>
          </div>
          <div className="mt-3 p-2 bg-slate-900 border border-slate-700 rounded">
            <span className="text-slate-500 text-[10px]">STATUS</span><br/>
            <span className="text-xs text-yellow-400 font-bold">{droneState.status}</span>
          </div>
        </div>

        {/* Analytics Display (Shows strongly at end) */}
        {demoStep === 'LANDED' && (
          <div className="bg-emerald-900/20 p-4 rounded-xl border border-emerald-500/30 shadow-lg animate-fade-in">
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">Simulated Analytics</h2>
            <div className="text-xs space-y-1 font-mono text-emerald-100">
               <p>Field Coverage: {(Math.min(100, (droneState.seedsCount / 20) * 100)).toFixed(1)}%</p>
               <p>Flight Distance: {droneState.distanceCovered.toFixed(0)} meters</p>
               <p>Seeds Consumed: {100 - droneState.seedsTank.toFixed(0)}%</p>
               <p>Water Sprayed: {100 - droneState.waterLevel.toFixed(0)}%</p>
               <p>Pesticide Used: {100 - droneState.pesticideLevel.toFixed(0)}%</p>
            </div>
          </div>
        )}

        {/* Mission Event Log */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex-1 min-h-[150px] shadow-inner text-[10px] font-mono text-slate-400 overflow-y-auto">
          {logs.map((log, i) => (
             <div key={i} className="mb-1">{">"} {log}</div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
