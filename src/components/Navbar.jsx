import React, { useState } from 'react';

export default function Navbar({ activeTab, setActiveTab, droneState, activeField }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const searchPlaceholders = {
    dashboard: "Search fields, missions...",
    fields: "Search fields...",
    missions: "Search missions, fields...",
    plant_health: "Search plant health records...",
    tracking: "Search live drones, routes...",
    alerts: "Search system alerts...",
    reports: "Search generated reports...",
    settings: "Search settings...",
    guide: "Search farmer guide..."
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'fields', label: 'Fields', icon: 'potted_plant' },
    { id: 'missions', label: 'Missions', icon: 'flight_takeoff' },
    { id: 'plant_health', label: 'Plant Health', icon: 'health_metrics' },
    { id: 'tracking', label: 'Live Tracking', icon: 'my_location' },
    { id: 'alerts', label: 'Alerts', icon: 'notifications' },
    { id: 'reports', label: 'Reports', icon: 'analytics' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'guide', label: 'Farmer Guide', icon: 'book' },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-screen w-[280px] z-40 flex-col py-md border-r border-outline-variant bg-surface shadow-sm">
        {/* Brand Header */}
        <div className="px-lg mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[24px]">agriculture</span>
          </div>
          <div>
            <h1 className="text-headline-md font-headline-md font-bold text-primary tracking-tight">KRISHI VIKAS</h1>
            <p className="text-label-sm font-label-sm text-on-surface-variant">Autonomous AgriDrone System</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col gap-1 px-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left font-label-md text-label-md ${
                  isActive
                    ? 'active text-primary font-bold border-r-4 border-primary bg-secondary-container/30'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                }`}
              >
                <span 
                  className={`material-symbols-outlined ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.id === 'alerts' && (
                  <span className="ml-auto bg-error text-on-error text-[10px] font-bold px-2 py-0.5 rounded-full">
                    2
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Farmer Profile Footer */}
        <div className="px-4 mt-auto">
          <button 
            onClick={() => handleNavClick('settings')}
            className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors rounded-lg border-t border-outline-variant pt-4 mt-4 text-left"
          >
            <span className="material-symbols-outlined">account_circle</span>
            <div>
              <p className="text-label-md font-label-md font-semibold text-on-surface">Ramesh Kisan</p>
              <p className="text-label-sm font-label-sm text-on-surface-variant">Ludhiana, Punjab</p>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Backdrop & Off-Canvas Sidebar */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <nav 
        className={`fixed left-0 top-0 h-screen w-[280px] z-50 flex flex-col py-md border-r border-outline-variant bg-surface shadow-lg transition-transform duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-lg mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
            <span className="material-symbols-outlined">agriculture</span>
          </div>
          <div className="flex-1">
            <h1 className="text-headline-md font-headline-md font-bold text-primary">KRISHI VIKAS</h1>
            <p className="text-label-sm font-label-sm text-on-surface-variant">Precision Farming</p>
          </div>
          <button 
            onClick={() => setMobileOpen(false)}
            className="text-on-surface-variant p-2 rounded-full hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-1 px-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left font-label-md text-label-md ${
                  isActive
                    ? 'active text-primary font-bold border-r-4 border-primary bg-secondary-container/30'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 border-b border-outline-variant bg-surface/90 backdrop-blur-md shadow-sm flex justify-between items-center h-16 px-md w-full md:pl-[296px]">
        <div className="flex-1 flex items-center gap-3">
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-on-surface-variant hover:bg-surface-container-low rounded-full p-2 transition-colors"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          
          {/* Top Search Input */}
          <div className="relative w-72 hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-label-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface placeholder:text-on-surface-variant/60"
              placeholder={searchPlaceholders[activeTab] || "Search..."} 
              type="text"
            />
          </div>

          {/* Active Field Badge */}
          {activeField && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-surface-container border border-outline-variant rounded-full text-label-sm font-label-sm text-on-surface">
              <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
              <span className="font-semibold">{activeField.name}</span>
            </div>
          )}
        </div>

        {/* Right Status Actions & Profile */}
        <div className="flex items-center gap-3">
          {/* Live Telemetry Pill */}
          <div className="flex items-center gap-2 bg-secondary-container/40 px-3 py-1 rounded-full border border-secondary-container text-label-sm font-label-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-primary-container font-semibold">{droneState.status || 'GPS Lock Active'}</span>
          </div>

          {/* Notifications Button */}
          <button 
            onClick={() => setActiveTab('alerts')}
            className="relative text-on-surface-variant hover:bg-surface-container-low rounded-full p-2 transition-colors"
            title="Alerts & Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"></span>
          </button>

          {/* Help Button */}
          <button 
            onClick={() => setActiveTab('guide')}
            className="text-on-surface-variant hover:bg-surface-container-low rounded-full p-2 transition-colors"
            title="Farmer Guide"
          >
            <span className="material-symbols-outlined">help</span>
          </button>

          {/* Farmer Avatar */}
          <div 
            onClick={() => setActiveTab('settings')}
            className="ml-1 w-9 h-9 rounded-full overflow-hidden border-2 border-primary-container/40 bg-surface-container-low cursor-pointer hover:border-primary transition-colors flex items-center justify-center bg-primary-container text-on-primary font-bold text-xs"
          >
            RK
          </div>
        </div>
      </header>
    </>
  );
}
