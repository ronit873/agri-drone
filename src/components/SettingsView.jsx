import React, { useState, useEffect } from 'react';
import { mavlinkBridge } from '../utils/mavlinkBridge';

const DEFAULT_SETTINGS = {
  name: 'Ramesh Kisan',
  phone: '+91 98765 43210',
  location: 'Ludhiana, Punjab, India',
  droneModel: 'Agri-X1 Pro Quadcopter',
  fcHardware: 'Pixhawk 6X / ArduPilot Flight Controller',
  rtkFrequency: '868 MHz RTK Base Station',
  autoRthBattery: 20,
  maxAltitude: 15,
  telemetryBaud: 57600
};

export default function SettingsView({ theme, toggleTheme }) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('krishi_vikas_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('LocalStorage load error', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [connectingSerial, setConnectingSerial] = useState(false);
  const [serialStatus, setSerialStatus] = useState('');

  const handleSave = (e) => {
    e?.preventDefault();
    try {
      localStorage.setItem('krishi_vikas_settings', JSON.stringify(profile));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.warn('Save settings error', e);
    }
  };

  const handleConnectTelemetry = async () => {
    setConnectingSerial(true);
    setSerialStatus('Requesting USB / Serial Telemetry Radio Port...');
    try {
      await mavlinkBridge.connectSerial(profile.telemetryBaud);
      setSerialStatus('Connected to Telemetry Radio successfully!');
    } catch (err) {
      setSerialStatus(`Connection Failed: ${err.message || 'Port selection cancelled'}`);
    } finally {
      setConnectingSerial(false);
    }
  };

  const isLight = theme === 'light';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white dark:text-white tracking-tight">
            Farmer Profile &amp; Drone Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure farm credentials, physical drone hardware interfaces, and auto-safety triggers
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/15"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          Save Configuration
        </button>
      </div>

      {/* Success Notification Banner */}
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-lg">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Settings &amp; Hardware Parameters Saved Successfully to Local Persistence!</span>
        </div>
      )}

      {/* Form Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Card: Farmer Credentials */}
        <div className={`p-6 rounded-2xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <h2 className="text-base font-bold text-white dark:text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-500 text-[20px]">badge</span>
            Farmer Profile &amp; Location
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Farmer Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Contact Phone Number</label>
              <input
                type="text"
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Primary Farm Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={e => setProfile({ ...profile, location: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Display Mode Theme Preferences */}
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-slate-300 font-semibold mb-2">Display Theme Preference</label>
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full py-2.5 px-4 rounded-xl border bg-slate-950 border-slate-800 text-slate-200 font-bold flex items-center justify-between text-xs hover:border-emerald-500 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    {isLight ? 'wb_sunny' : 'dark_mode'}
                  </span>
                  <span>Current Theme: {isLight ? 'Day Mode (Light)' : 'Night Mode (Dark)'}</span>
                </div>
                <span className="text-emerald-500 text-[11px] font-mono">Toggle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Card: Physical Drone Hardware & Safety Triggers */}
        <div className={`p-6 rounded-2xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <h2 className="text-base font-bold text-white dark:text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500 text-[20px]">flight_takeoff</span>
            Drone Hardware &amp; MAVLink Telemetry
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Quadcopter Unit Model</label>
              <input
                type="text"
                value={profile.droneModel}
                onChange={e => setProfile({ ...profile, droneModel: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Flight Controller Hardware</label>
              <input
                type="text"
                value={profile.fcHardware}
                onChange={e => setProfile({ ...profile, fcHardware: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Auto RTH Battery (%)</label>
                <input
                  type="number"
                  min="10"
                  max="40"
                  value={profile.autoRthBattery}
                  onChange={e => setProfile({ ...profile, autoRthBattery: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Max Ceiling Alt (m)</label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={profile.maxAltitude}
                  onChange={e => setProfile({ ...profile, maxAltitude: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* WebSerial USB Telemetry Connection Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="font-bold text-white block text-[11px] uppercase">
                Physical Telemetry Radio Connection (WebSerial)
              </span>

              <div className="flex items-center gap-2">
                <select
                  value={profile.telemetryBaud}
                  onChange={e => setProfile({ ...profile, telemetryBaud: Number(e.target.value) })}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold text-xs"
                >
                  <option value={57600}>57600 Baud (915MHz SiK Radio)</option>
                  <option value={115200}>115200 Baud (FTDI Direct USB)</option>
                  <option value={9600}>9600 Baud (Legacy GPS Module)</option>
                </select>

                <button
                  type="button"
                  onClick={handleConnectTelemetry}
                  disabled={connectingSerial}
                  className="flex-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 font-bold py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">usb</span>
                  {connectingSerial ? 'Connecting...' : 'Connect Hardware Radio'}
                </button>
              </div>

              {serialStatus && (
                <div className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
                  {serialStatus}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Save Action */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-3 rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          Save Configuration
        </button>
      </div>

    </div>
  );
}
