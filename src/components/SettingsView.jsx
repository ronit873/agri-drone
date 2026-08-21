import React, { useState } from 'react';

export default function SettingsView() {
  const [profile, setProfile] = useState({
    name: 'Ramesh Kisan',
    phone: '+91 98765 43210',
    location: 'Ludhiana, Punjab, India',
    droneModel: 'Agri-X1 Pro Quadcopter',
    fcHardware: 'Pixhawk 6X / ArduPilot Flight Controller',
    rtkFrequency: '868 MHz RTK Base Station',
    autoRthBattery: 20
  });

  return (
    <div className="p-gutter max-w-[1200px] mx-auto flex flex-col gap-6">
      
      {/* Header Banner */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
        <h1 className="text-headline-lg font-headline-lg text-on-surface">Farmer Profile &amp; Drone Settings</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Configure farm credentials, physical drone hardware interfaces, and safety triggers
        </p>
      </div>

      {/* Settings Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        
        {/* Profile Details */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="text-headline-md font-bold text-on-surface border-b border-outline-variant pb-3">Farmer Profile</h3>

          <div>
            <label className="text-label-sm font-semibold text-on-surface-variant block mb-1">Farmer Full Name</label>
            <input 
              type="text" 
              value={profile.name} 
              onChange={e => setProfile({...profile, name: e.target.value})}
              className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface text-body-md focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface-variant block mb-1">Phone Number</label>
            <input 
              type="text" 
              value={profile.phone} 
              onChange={e => setProfile({...profile, phone: e.target.value})}
              className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface text-body-md focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface-variant block mb-1">Primary Farm Location</label>
            <input 
              type="text" 
              value={profile.location} 
              onChange={e => setProfile({...profile, location: e.target.value})}
              className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface text-body-md focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Drone Hardware Hardware Config */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="text-headline-md font-bold text-on-surface border-b border-outline-variant pb-3">Drone Hardware &amp; Telemetry Setup</h3>

          <div>
            <label className="text-label-sm font-semibold text-on-surface-variant block mb-1">Quadcopter Unit Model</label>
            <input 
              type="text" 
              value={profile.droneModel} 
              onChange={e => setProfile({...profile, droneModel: e.target.value})}
              className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface text-body-md focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface-variant block mb-1">Flight Controller Firmware</label>
            <input 
              type="text" 
              value={profile.fcHardware} 
              onChange={e => setProfile({...profile, fcHardware: e.target.value})}
              className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface text-body-md focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface-variant block mb-1">Auto Return-to-Home Battery Threshold (%)</label>
            <input 
              type="number" 
              value={profile.autoRthBattery} 
              onChange={e => setProfile({...profile, autoRthBattery: Number(e.target.value)})}
              className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface text-body-md focus:outline-none focus:border-primary"
            />
          </div>
        </div>

      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          onClick={() => alert("Settings saved successfully!")}
          className="bg-primary-container hover:bg-primary text-on-primary font-bold px-6 py-3 rounded-lg text-label-md transition-colors shadow-sm"
        >
          Save Configuration
        </button>
      </div>

    </div>
  );
}
