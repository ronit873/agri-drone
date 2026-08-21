import React from 'react';
import DroneSimulator from './3d/DroneSimulator';

export default function DashboardView({ droneState, setDroneState, activeField, activeMission, onNavigateTab }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1700px] mx-auto space-y-6">
      
      {/* Overview GCS Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">KRISHI VIKAS GCS</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Autonomous Farming Station
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Active Parcel: <strong className="text-slate-200">{activeField?.name}</strong> ({activeField?.location}) — {activeField?.area} Acres
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigateTab('missions')}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/15"
          >
            <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
            Plan Mission
          </button>
          <button 
            onClick={() => onNavigateTab('fields')}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">edit_road</span>
            Field Boundaries
          </button>
        </div>
      </div>

      {/* Main Feature: Dominant 3D WebGL Simulator Viewport (No Duplicate Overlays) */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative min-h-[640px] flex flex-col">
        <div className="flex-1 w-full h-full relative min-h-[640px]">
          <DroneSimulator 
            droneState={droneState}
            setDroneState={setDroneState}
            activeField={activeField}
            activeMission={activeMission}
          />
        </div>
      </div>

      {/* Telemetry Summary Cards Below Viewport */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block font-medium">Flight Status</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">{droneState.status || 'GPS Lock Active'}</span>
          </div>
          <span className="material-symbols-outlined text-[28px] text-emerald-400">flight_takeoff</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block font-medium">Seed Payload</span>
            <span className="text-sm font-bold text-amber-400 mt-0.5 block">{droneState.seedsCount} seeds planted</span>
          </div>
          <span className="material-symbols-outlined text-[28px] text-amber-400">sprout</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block font-medium">Water Spray Level</span>
            <span className="text-sm font-bold text-sky-400 mt-0.5 block">{Math.round(droneState.waterLevel)}% Tank</span>
          </div>
          <span className="material-symbols-outlined text-[28px] text-sky-400">water_drop</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block font-medium">Distance Traveled</span>
            <span className="text-sm font-bold text-purple-400 mt-0.5 block">{droneState.distanceCovered || 120} meters</span>
          </div>
          <span className="material-symbols-outlined text-[28px] text-purple-400">straighten</span>
        </div>
      </div>

    </div>
  );
}
