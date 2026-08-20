import React from 'react';
import { 
  Plane, 
  MapPin, 
  Activity, 
  BarChart3, 
  BookOpen, 
  ShieldCheck,
  Zap,
  Droplets,
  Sprout
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, droneState, activeField }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('simulator')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-green-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Plane className="w-6 h-6 text-emerald-400 transform -rotate-45" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
                  KRISHI VIKAS
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  AI DRONE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Autonomous 10m Precision Seeding & Field Care System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'simulator'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>3D Simulation</span>
            </button>

            <button
              onClick={() => setActiveTab('fields')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'fields'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Field Management</span>
            </button>

            <button
              onClick={() => setActiveTab('telemetry')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'telemetry'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Telemetry HUD</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'guide'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Farmer Guide</span>
            </button>
          </nav>

          {/* Quick Telemetry Indicators */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-3 text-xs bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-1.5">
              <div className="flex items-center space-x-1.5 text-emerald-400">
                <Zap className="w-3.5 h-3.5" />
                <span className="font-semibold">{Math.round(droneState.battery)}%</span>
              </div>
              <div className="h-3 w-[1px] bg-slate-800" />
              <div className="flex items-center space-x-1.5 text-amber-400">
                <Sprout className="w-3.5 h-3.5" />
                <span>{droneState.seedsCount} seeds</span>
              </div>
              <div className="h-3 w-[1px] bg-slate-800" />
              <div className="flex items-center space-x-1.5 text-blue-400">
                <Droplets className="w-3.5 h-3.5" />
                <span>{Math.round(droneState.waterLevel)}% Water</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="capitalize">{droneState.status}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Tab bar */}
      <div className="flex md:hidden border-t border-slate-800/80 bg-slate-950 overflow-x-auto py-1 px-2 space-x-1">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex-1 py-1.5 px-2 rounded text-center text-xs font-medium whitespace-nowrap ${
            activeTab === 'simulator' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400'
          }`}
        >
          3D Demo
        </button>
        <button
          onClick={() => setActiveTab('fields')}
          className={`flex-1 py-1.5 px-2 rounded text-center text-xs font-medium whitespace-nowrap ${
            activeTab === 'fields' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400'
          }`}
        >
          Fields
        </button>
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`flex-1 py-1.5 px-2 rounded text-center text-xs font-medium whitespace-nowrap ${
            activeTab === 'telemetry' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400'
          }`}
        >
          Telemetry
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-1.5 px-2 rounded text-center text-xs font-medium whitespace-nowrap ${
            activeTab === 'analytics' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400'
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`flex-1 py-1.5 px-2 rounded text-center text-xs font-medium whitespace-nowrap ${
            activeTab === 'guide' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400'
          }`}
        >
          Guide
        </button>
      </div>
    </header>
  );
}
