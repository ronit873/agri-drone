import React, { useState } from 'react';

export default function Navbar({ activeTab, setActiveTab, droneState, activeField, theme, toggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'fields', label: 'Fields & Boundaries', icon: 'potted_plant' },
    { id: 'missions', label: 'Mission Planner', icon: 'flight_takeoff' },
    { id: 'drone', label: 'Drone Control (3D)', icon: 'flight' },
    { id: 'ai_vision', label: 'AI Vision (YOLOv8)', icon: 'document_scanner' },
    { id: 'plant_health', label: 'Plant Health', icon: 'health_metrics' },
    { id: 'alerts', label: 'Alert Center', icon: 'notifications' },
    { id: 'reports', label: 'Flight Reports', icon: 'analytics' },
    { id: 'settings', label: 'System Settings', icon: 'settings' },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  const isLight = theme === 'light';

  return (
    <>
      {/* Fixed Left Navigation Sidebar (Desktop) */}
      <aside className={`hidden lg:flex fixed left-0 top-0 h-screen w-[260px] z-40 flex-col py-6 border-r select-none transition-colors duration-300 ${
        isLight 
          ? 'bg-white/95 border-slate-200 text-slate-800 shadow-xl' 
          : 'bg-slate-950/95 border-slate-800 text-slate-100 backdrop-blur-xl'
      }`}>
        
        {/* Brand Header */}
        <div className="px-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 font-extrabold text-xl">
              🌾
            </div>
            <div>
              <h1 className={`text-lg font-extrabold tracking-tight leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                KRISHI VIKAS
              </h1>
              <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider">AgriDrone GCS v2.0</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <div className="flex-1 flex flex-col gap-1.5 px-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left text-xs font-semibold ${
                  isActive
                    ? isLight
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm font-bold'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/5'
                    : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span 
                  className={`material-symbols-outlined text-[20px] ${
                    isActive 
                      ? 'text-emerald-600' 
                      : isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.id === 'alerts' && (
                  <span className="ml-auto bg-amber-500/20 text-amber-600 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    3
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Status & Theme Toggle */}
        <div className="px-4 mt-auto pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          
          {/* Day / Night Theme Toggle Switch */}
          <button
            onClick={toggleTheme}
            className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between border text-xs font-bold transition-all ${
              isLight
                ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                : 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                {isLight ? 'wb_sunny' : 'dark_mode'}
              </span>
              <span>{isLight ? 'Day Mode (Light)' : 'Night Mode (Dark)'}</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600">
              Switch
            </span>
          </button>

          <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className={`font-mono text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>RTK-GPS</span>
            </div>
            <span className="text-emerald-600 font-bold font-mono">14 SAT</span>
          </div>

        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Off-Canvas Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-screen w-[260px] z-50 flex flex-col py-6 border-r shadow-2xl transition-transform duration-300 lg:hidden ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="px-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">🌾</div>
            <h1 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>KRISHI VIKAS</h1>
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-slate-400 p-1">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-1.5 px-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold w-full text-left ${
                  isActive ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30' : isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Top Header Bar */}
      <header className={`sticky top-0 z-30 border-b flex justify-between items-center h-16 px-4 lg:px-8 w-full lg:pl-[284px] backdrop-blur-xl transition-colors duration-300 ${
        isLight 
          ? 'bg-white/80 border-slate-200 text-slate-900' 
          : 'bg-slate-950/80 border-slate-800/80 text-slate-100'
      }`}>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg border ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">location_on</span>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              <strong className={isLight ? 'text-slate-900' : 'text-white'}>{activeField?.name || 'Wheat Plot A'}</strong> ({activeField?.area || 5.5} Acres)
            </span>
          </div>
        </div>

        {/* Telemetry Header Badges & Quick Day/Night Toggle */}
        <div className="flex items-center gap-3 text-xs font-mono">
          
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all ${
              isLight 
                ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200' 
                : 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
            }`}
            title="Toggle Day / Night Mode"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isLight ? 'light_mode' : 'dark_mode'}
            </span>
            <span className="hidden sm:inline font-bold font-sans text-[11px]">
              {isLight ? 'Day Mode' : 'Night Mode'}
            </span>
          </button>

          <div className={`hidden md:flex items-center gap-4 border px-3.5 py-1.5 rounded-xl ${
            isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900/80 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <span className="material-symbols-outlined text-[16px]">battery_charging_80</span>
              <span>{Math.round(droneState.battery)}%</span>
            </div>
            <div className={`w-px h-3.5 ${isLight ? 'bg-slate-300' : 'bg-slate-800'}`} />
            <div className="flex items-center gap-1.5 text-sky-600 font-bold">
              <span className="material-symbols-outlined text-[16px]">speed</span>
              <span>3.4 m/s</span>
            </div>
            <div className={`w-px h-3.5 ${isLight ? 'bg-slate-300' : 'bg-slate-800'}`} />
            <div className="flex items-center gap-1.5 text-amber-600 font-bold">
              <span className="material-symbols-outlined text-[16px]">height</span>
              <span>5.2 m</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-emerald-600 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{droneState.status || 'GPS Lock'}</span>
          </div>

        </div>

      </header>
    </>
  );
}
