import React from 'react';
import { 
  Activity, 
  Zap, 
  Droplets, 
  Sprout, 
  ShieldAlert, 
  Wifi, 
  Navigation, 
  Cpu, 
  Gauge, 
  Radio, 
  AlertTriangle,
  RotateCcw,
  Sliders,
  BatteryCharging
} from 'lucide-react';

export default function TelemetryHUD({ droneState, setDroneState, activeField }) {
  
  const handleRefillAll = () => {
    setDroneState(prev => ({
      ...prev,
      battery: 100,
      seedsTank: 100,
      waterLevel: 100,
      pesticideLevel: 100,
      status: 'Ready / Refilled'
    }));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4" />
              <span>Real-Time Cockpit Diagnostics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Drone Telemetry & Payload Control
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Monitor motor speeds, seed dispenser triggers, water pump pressure, pesticide levels & flight safety sensors.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefillAll}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-emerald-400 text-xs font-bold transition-all shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Refill Tanks & Recharge</span>
            </button>
          </div>
        </div>

        {/* Top Diagnostic Gauges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Battery Gauge */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">LiPo Battery Power</span>
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white">{Math.round(droneState.battery)}%</span>
              <span className="text-xs text-emerald-400">22.8V / 6S Pack</span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className={`h-full transition-all duration-300 ${
                  droneState.battery > 50 ? 'bg-emerald-500' : droneState.battery > 20 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${droneState.battery}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between">
              <span>Flight Time Left: ~24 min</span>
              <span>Temp: 34°C</span>
            </div>
          </div>

          {/* Seed Container Gauge */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">Seed Tank Capacity</span>
              <Sprout className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-emerald-400">{Math.round(droneState.seedsTank)}%</span>
              <span className="text-xs text-slate-400">{((droneState.seedsTank / 100) * 10).toFixed(1)} kg left</span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${droneState.seedsTank}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between">
              <span>Dropped: {droneState.seedsCount} seeds</span>
              <span>Drop Rate: 1 / 10m</span>
            </div>
          </div>

          {/* Water Tank Gauge */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">Water Tank Payload</span>
              <Droplets className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-blue-400">{Math.round(droneState.waterLevel)}%</span>
              <span className="text-xs text-slate-400">{((droneState.waterLevel / 100) * 20).toFixed(1)} Liters</span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${droneState.waterLevel}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between">
              <span>Pump Pressure: 4.2 Bar</span>
              <span>Mist Nozzle: Active</span>
            </div>
          </div>

          {/* Pesticide Tank Gauge */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">Pesticide Container</span>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-amber-400">{Math.round(droneState.pesticideLevel)}%</span>
              <span className="text-xs text-slate-400">{((droneState.pesticideLevel / 100) * 5).toFixed(1)} Liters</span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${droneState.pesticideLevel}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between">
              <span>Flow: 0.8 L/min</span>
              <span>Coverage: 100% target</span>
            </div>
          </div>

        </div>

        {/* Detailed Motor Telemetry & Flight Sensors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quadcopter Motors Status */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Cpu className="w-5 h-5 text-teal-400" />
              <span>Quadcopter Rotor Motors & ESC Telemetry</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((motorNum) => (
                <div key={motorNum} className="glass-card p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Motor #{motorNum}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-xl font-black text-emerald-400">4,850 RPM</div>
                  <div className="text-[10px] text-slate-400 space-y-0.5">
                    <div>Temp: 38°C</div>
                    <div>Current: 14.2A</div>
                    <div>ESC Sync: OK</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Avionics & Sensor Locks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
                <Radio className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-xs text-slate-400">GPS Constellation</div>
                  <div className="text-sm font-bold text-white">16 Satellites Locked</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
                <Navigation className="w-5 h-5 text-teal-400" />
                <div>
                  <div className="text-xs text-slate-400">LiDAR Altitude</div>
                  <div className="text-sm font-bold text-white">3.5m Above Soil</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
                <Wifi className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-xs text-slate-400">Radio Telemetry Link</div>
                  <div className="text-sm font-bold text-white">98% (5.8 GHz)</div>
                </div>
              </div>
            </div>

          </div>

          {/* Flight Control System & Payload Calibration */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>10m Precision Seeding Settings</span>
              </h3>

              <div className="space-y-4 pt-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Grid Seeding Distance</span>
                    <span className="text-emerald-400 font-bold">10 Meters</span>
                  </div>
                  <input type="range" min="5" max="20" value="10" readOnly className="w-full accent-emerald-500 cursor-not-allowed" />
                  <p className="text-[10px] text-slate-500 mt-1">Fixed optimal spacing for crop growth.</p>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Flight Altitude</span>
                    <span className="text-teal-400 font-bold">3.5 Meters</span>
                  </div>
                  <input type="range" min="1" max="10" value="3.5" readOnly className="w-full accent-teal-500 cursor-not-allowed" />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Water Mist Pressure</span>
                    <span className="text-blue-400 font-bold">4.2 Bar</span>
                  </div>
                  <input type="range" min="1" max="6" value="4.2" readOnly className="w-full accent-blue-500 cursor-not-allowed" />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
              <div className="font-bold text-amber-400 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Automated Safety System</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Drone will trigger auto Return-To-Home (RTH) if battery drops below 15% or water/seed tanks reach 0%.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
