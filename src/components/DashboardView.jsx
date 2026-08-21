import React from 'react';
import DroneSimulator from './3d/DroneSimulator';

export default function DashboardView({ droneState, setDroneState, activeField, activeMission, onNavigateTab }) {
  return (
    <div className="p-gutter max-w-[1600px] mx-auto">
      
      {/* Top Welcome Banner */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-headline-lg font-headline-lg text-on-surface">Welcome back, Ramesh</h1>
            <span className="bg-primary-container/20 text-primary-container px-2.5 py-0.5 rounded-full text-label-sm font-semibold border border-primary-container/30">
              Field Ready
            </span>
          </div>
          <p className="text-body-md text-on-surface-variant mt-1">
            Monitoring <strong className="text-on-surface">{activeField?.name || 'Active Parcel'}</strong> — {activeField?.location || 'Ludhiana, Punjab'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigateTab('planner')}
            className="bg-primary-container hover:bg-primary text-on-primary font-semibold px-4 py-2.5 rounded-lg text-label-md transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
            Plan New Mission
          </button>
          <button 
            onClick={() => onNavigateTab('fields')}
            className="border border-outline-variant hover:bg-surface-container-low text-on-surface font-semibold px-4 py-2.5 rounded-lg text-label-md transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">edit_road</span>
            Edit Boundary
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        
        {/* Large 3D WebGL Simulator Area */}
        <div className="lg:col-span-2 flex flex-col gap-gutter">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col relative h-[560px]">
            <div className="absolute top-4 left-4 z-20 bg-surface/90 backdrop-blur-md border border-outline-variant rounded-lg p-3 shadow-md pointer-events-none">
              <h3 className="text-label-md font-label-md font-bold text-on-surface mb-0.5">{activeField?.name || 'Sector 4 - Ludhiana'}</h3>
              <p className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Interactive 3D WebGL Flight Canvas
              </p>
            </div>

            {/* Embedded Three.js 3D Simulator */}
            <div className="flex-1 w-full h-full relative">
              <DroneSimulator 
                droneState={droneState}
                setDroneState={setDroneState}
                activeField={activeField}
                activeMission={activeMission}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry & Recent Activity */}
        <div className="flex flex-col gap-gutter">
          
          {/* Drone Status Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant">
              <h3 className="text-headline-md font-headline-md text-on-surface">Drone Telemetry</h3>
              <div className="flex items-center gap-2 bg-secondary-container/30 px-3 py-1 rounded-full border border-secondary-container">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-label-sm font-label-sm text-primary-container font-semibold">Online</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/60">
                <span className="text-label-sm font-label-sm text-on-surface-variant block mb-1">Battery</span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container">battery_charging_80</span>
                  <span className="text-body-md font-bold text-on-surface">{Math.round(droneState.battery)}%</span>
                </div>
              </div>

              <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/60">
                <span className="text-label-sm font-label-sm text-on-surface-variant block mb-1">GPS Signal</span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container">satellite_alt</span>
                  <span className="text-body-md font-bold text-on-surface">RTK Locked</span>
                </div>
              </div>

              <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/60">
                <span className="text-label-sm font-label-sm text-on-surface-variant block mb-1">Seed Tank</span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-600">sprout</span>
                  <span className="text-body-md font-bold text-on-surface">{droneState.seedsCount} units</span>
                </div>
              </div>

              <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/60">
                <span className="text-label-sm font-label-sm text-on-surface-variant block mb-1">Water / Spray</span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600">water_drop</span>
                  <span className="text-body-md font-bold text-on-surface">{Math.round(droneState.waterLevel)}%</span>
                </div>
              </div>

              <div className="col-span-2 bg-surface-container p-3 rounded-lg border border-outline-variant">
                <span className="text-label-sm font-label-sm text-on-surface-variant block mb-1">Current Active Mission</span>
                <span className="text-body-md font-bold text-on-surface">
                  {activeMission?.cropName || activeField?.crop || 'Boustrophedon Survey Route'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => onNavigateTab('tracking')} 
                className="w-full bg-primary-container text-on-primary py-3 px-4 rounded-lg text-label-md font-bold hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">videocam</span>
                View Live Tracking HUD
              </button>
              <button 
                onClick={() => setDroneState(prev => ({ ...prev, status: 'Return-To-Home Initiated' }))} 
                className="w-full bg-surface text-error border border-error/50 py-2.5 px-4 rounded-lg text-label-md font-bold hover:bg-error-container/30 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">home</span>
                Return To Home (RTH)
              </button>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex-1">
            <h3 className="text-headline-md font-headline-md text-on-surface mb-4 pb-3 border-b border-outline-variant">
              Recent Field Activity
            </h3>
            <div className="flex flex-col gap-4 relative before:absolute before:inset-y-0 before:left-[15px] before:w-px before:bg-outline-variant">
              <div className="flex gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-surface border-2 border-primary-container flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <span className="material-symbols-outlined text-primary-container text-[14px]">check</span>
                </div>
                <div>
                  <p className="text-body-md text-on-surface font-medium">Boustrophedon swath flight active</p>
                  <p className="text-label-sm text-on-surface-variant mt-0.5">Live now — {activeField?.name}</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-surface border-2 border-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <span className="material-symbols-outlined text-amber-600 text-[14px]">eco</span>
                </div>
                <div>
                  <p className="text-body-md text-on-surface font-medium">Variable-rate seeding enabled</p>
                  <p className="text-label-sm text-on-surface-variant mt-0.5">Row spacing: 20 cm calculated</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-surface border-2 border-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <span className="material-symbols-outlined text-blue-600 text-[14px]">water_drop</span>
                </div>
                <div>
                  <p className="text-body-md text-on-surface font-medium">Zero-exposure micro misting</p>
                  <p className="text-label-sm text-on-surface-variant mt-0.5">Coverage area: {activeField?.area} acres</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
