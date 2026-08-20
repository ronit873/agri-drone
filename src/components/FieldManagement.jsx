import React, { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Check, 
  Sprout, 
  Droplets, 
  ShieldAlert, 
  Sun, 
  Layers, 
  Plane, 
  Trash2, 
  Calendar,
  AlertTriangle,
  ChevronRight,
  Search
} from 'lucide-react';

export default function FieldManagement({ fields, setFields, activeField, setActiveField, onDeployDrone }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New field form state
  const [newField, setNewField] = useState({
    name: '',
    location: '',
    area: '4.5',
    crop: 'Wheat (Gehun)',
    soil: 'Alluvial Soil',
    moisture: '65',
    pestRisk: 'Low',
    growthStage: 'Seeding Ready'
  });

  const handleAddField = (e) => {
    e.preventDefault();
    if (!newField.name || !newField.location) return;

    const created = {
      id: `field-${Date.now()}`,
      name: newField.name,
      location: newField.location,
      area: parseFloat(newField.area) || 3.0,
      crop: newField.crop,
      soil: newField.soil,
      moisture: parseInt(newField.moisture) || 60,
      pestRisk: newField.pestRisk,
      growthStage: newField.growthStage,
      gridSpaced: '10 Meters',
      lastSurveyed: 'Just now'
    };

    setFields([created, ...fields]);
    setActiveField(created);
    setShowAddModal(false);
    setNewField({
      name: '',
      location: '',
      area: '4.5',
      crop: 'Wheat (Gehun)',
      soil: 'Alluvial Soil',
      moisture: '65',
      pestRisk: 'Low',
      growthStage: 'Seeding Ready'
    });
  };

  const handleDeleteField = (id, e) => {
    e.stopPropagation();
    if (fields.length <= 1) return;
    const filtered = fields.filter(f => f.id !== id);
    setFields(filtered);
    if (activeField.id === id) {
      setActiveField(filtered[0]);
    }
  };

  const filteredFields = fields.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" />
              <span>Khet Niyojan / Field Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Farmer Fields & Crop Locations
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage field boundaries, monitor soil moisture, configure 10-meter drone seeding grids & pesticide routines.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Register New Field</span>
          </button>
        </div>

        {/* Search & Active Field Overview Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Selected Field Focus Card */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  CURRENTLY ACTIVE FOR KRISHI DRONE
                </span>
                <h2 className="text-xl font-bold text-white mt-2 flex items-center space-x-2">
                  <span>{activeField.name}</span>
                </h2>
                <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{activeField.location}</span>
                  <span>•</span>
                  <span>{activeField.area} Acres Area</span>
                </div>
              </div>

              <button
                onClick={onDeployDrone}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-md"
              >
                <Plane className="w-4 h-4" />
                <span>Launch 3D Drone Demo</span>
              </button>
            </div>

            {/* Grid Metrics breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass-card p-3.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <Sprout className="w-4 h-4 text-emerald-400" />
                  <span>Crop Type</span>
                </div>
                <div className="text-sm font-bold text-white">{activeField.crop}</div>
              </div>

              <div className="glass-card p-3.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Seeding Spacing</span>
                </div>
                <div className="text-sm font-bold text-emerald-400">10 Meters Grid</div>
              </div>

              <div className="glass-card p-3.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span>Soil Moisture</span>
                </div>
                <div className="text-sm font-bold text-blue-400">{activeField.moisture}% (Optimal)</div>
              </div>

              <div className="glass-card p-3.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Pest Risk</span>
                </div>
                <div className="text-sm font-bold text-amber-400">{activeField.pestRisk}</div>
              </div>
            </div>

            {/* Field Map Mockup & GPS Waypoint Track */}
            <div className="relative h-44 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
              
              {/* Simulated 10m grid lines on mini map */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-0.5 opacity-20 border border-emerald-500/20">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="border border-emerald-500/20" />
                ))}
              </div>

              <div className="relative z-10 text-center space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>GPS Grid Target: 10m Interval Auto-Seeding</span>
                </div>
                <div className="text-xs text-slate-400">
                  Drone flight coordinates synchronized with central agricultural satellite network.
                </div>
              </div>
            </div>

          </div>

          {/* Quick Stats & Weather Summary */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-3 flex items-center space-x-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Field Environment & Weather</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <span className="text-slate-400">Air Temperature:</span>
                  <span className="font-bold text-white">31°C (Warm & Clear)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <span className="text-slate-400">Wind Velocity:</span>
                  <span className="font-bold text-emerald-400">8 km/h (Ideal for Spraying)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <span className="text-slate-400">Soil Type:</span>
                  <span className="font-bold text-white">{activeField.soil}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <span className="text-slate-400">Growth Stage:</span>
                  <span className="font-bold text-teal-300">{activeField.growthStage}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
              <div className="font-bold text-emerald-400 flex items-center space-x-1.5">
                <Sprout className="w-4 h-4" />
                <span>Smart Seeding Recommendation</span>
              </div>
              <p className="text-slate-300">
                10-meter spacing ensures optimal root space and sunlight penetration for {activeField.crop}.
              </p>
            </div>
          </div>

        </div>

        {/* Registered Fields List */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>All Registered Fields ({fields.length})</span>
            </h2>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search field or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFields.map((f) => {
              const isActive = activeField.id === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => setActiveField(f)}
                  className={`glass-panel p-5 rounded-2xl border transition-all cursor-pointer space-y-4 ${
                    isActive 
                      ? 'border-emerald-500/80 bg-slate-900/90 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-500/10' 
                      : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base flex items-center space-x-2">
                        <span>{f.name}</span>
                        {isActive && <Check className="w-4 h-4 text-emerald-400" />}
                      </h3>
                      <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{f.location}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteField(f.id, e)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition-all"
                      title="Remove field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-slate-800/80 py-3">
                    <div>
                      <span className="text-slate-400 block">Area:</span>
                      <span className="font-semibold text-slate-200">{f.area} Acres</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Crop:</span>
                      <span className="font-semibold text-emerald-400">{f.crop}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Soil Moisture:</span>
                      <span className="font-semibold text-blue-400">{f.moisture}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Pesticide Routine:</span>
                      <span className="font-semibold text-amber-400">10m Auto Pass</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500">Last survey: {f.lastSurveyed}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveField(f);
                        onDeployDrone();
                      }}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
                    >
                      <span>Deploy Drone</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Modal: Register New Field Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel max-w-lg w-full p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>Register New Field for Krishi Drone</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddField} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Field Name (Khet Ka Naam)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar - North Wheat Field"
                  value={newField.name}
                  onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Location / Village / GPS</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Village Rampur, Sector 4, Punjab"
                  value={newField.location}
                  onChange={(e) => setNewField({ ...newField, location: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newField.area}
                    onChange={(e) => setNewField({ ...newField, area: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Crop Type</label>
                  <select
                    value={newField.crop}
                    onChange={(e) => setNewField({ ...newField, crop: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Wheat (Gehun)">Wheat (Gehun)</option>
                    <option value="Rice / Paddy (Dhan)">Rice / Paddy (Dhan)</option>
                    <option value="Corn / Maize (Makka)">Corn / Maize (Makka)</option>
                    <option value="Cotton (Kapas)">Cotton (Kapas)</option>
                    <option value="Sugarcane (Ganna)">Sugarcane (Ganna)</option>
                    <option value="Mustard (Sarson)">Mustard (Sarson)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Soil Type</label>
                  <select
                    value={newField.soil}
                    onChange={(e) => setNewField({ ...newField, soil: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Alluvial Soil">Alluvial Soil</option>
                    <option value="Black Soil">Black Soil</option>
                    <option value="Red & Yellow Soil">Red & Yellow Soil</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Initial Moisture (%)</label>
                  <input
                    type="number"
                    value={newField.moisture}
                    onChange={(e) => setNewField({ ...newField, moisture: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                ⚡ <span className="text-emerald-400 font-semibold">10m Precision Seeding Grid:</span> Drone will automatically calculate seeding interval (1 seed every 10 meters) based on land boundary.
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg"
                >
                  Save & Register Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
