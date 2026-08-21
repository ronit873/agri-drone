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
  Search,
  ChevronRight,
  Compass,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { cropConfigs, getCropConfig } from '../data/cropConfig';
import { calculatePolygonArea } from '../utils/geoUtils';
import { validateField } from '../utils/fieldValidator';

export default function FieldManagement({ 
  fields, 
  setFields, 
  activeField, 
  setActiveField, 
  onDeployDrone,
  onPlanMission 
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New field form state
  const [newField, setNewField] = useState({
    name: '',
    location: '',
    crop: 'Wheat (Gehun)',
    soil: 'Alluvial Soil',
    moisture: 65,
    pestRisk: 'Low',
    growthStage: 'Seeding Ready',
    // Default 4-corner polygon boundary in meters/GPS offset
    boundary: [
      { latitude: 30.733300, longitude: 76.779400 },
      { latitude: 30.733300, longitude: 76.780100 },
      { latitude: 30.732700, longitude: 76.780100 },
      { latitude: 30.732700, longitude: 76.779400 }
    ]
  });

  const [formErrors, setFormErrors] = useState([]);

  // Calculate live area of new field boundary
  const newFieldArea = calculatePolygonArea(newField.boundary);

  const handleVertexChange = (index, fieldKey, val) => {
    const updated = [...newField.boundary];
    updated[index] = {
      ...updated[index],
      [fieldKey]: parseFloat(val) || 0
    };
    setNewField({ ...newField, boundary: updated });
  };

  const handleAddVertex = () => {
    const last = newField.boundary[newField.boundary.length - 1];
    const newPt = last 
      ? { latitude: last.latitude + 0.0002, longitude: last.longitude + 0.0002 }
      : { latitude: 30.7333, longitude: 76.7794 };
    setNewField({
      ...newField,
      boundary: [...newField.boundary, newPt]
    });
  };

  const handleRemoveVertex = (index) => {
    if (newField.boundary.length <= 3) return;
    setNewField({
      ...newField,
      boundary: newField.boundary.filter((_, i) => i !== index)
    });
  };

  const handleAddField = (e) => {
    e.preventDefault();
    setFormErrors([]);

    const candidate = {
      id: `field-${Date.now()}`,
      name: newField.name.trim(),
      location: newField.location.trim(),
      area: newFieldArea.acres > 0 ? newFieldArea.acres : 4.5,
      crop: newField.crop,
      soil: newField.soil,
      moisture: parseInt(newField.moisture) || 60,
      pestRisk: newField.pestRisk,
      growthStage: newField.growthStage,
      boundary: newField.boundary,
      lastSurveyed: 'Just now'
    };

    const validation = validateField(candidate);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    const updatedFields = [candidate, ...fields];
    setFields(updatedFields);
    setActiveField(candidate);
    setShowAddModal(false);
    
    // Save to local storage for Phase I persistence
    try {
      localStorage.setItem('krishi_vikas_fields', JSON.stringify(updatedFields));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }

    // Reset form
    setNewField({
      name: '',
      location: '',
      crop: 'Wheat (Gehun)',
      soil: 'Alluvial Soil',
      moisture: 65,
      pestRisk: 'Low',
      growthStage: 'Seeding Ready',
      boundary: [
        { latitude: 30.733300, longitude: 76.779400 },
        { latitude: 30.733300, longitude: 76.780100 },
        { latitude: 30.732700, longitude: 76.780100 },
        { latitude: 30.732700, longitude: 76.779400 }
      ]
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
    try {
      localStorage.setItem('krishi_vikas_fields', JSON.stringify(filtered));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  };

  const filteredFields = fields.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCropConfig = getCropConfig(activeField.crop);
  const activeValidation = validateField(activeField);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" />
              <span>Phase I: Real Field Registry &amp; Boundary Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Farmer Fields &amp; GPS Boundary Polygons
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Define precise GPS coordinate vertices, calculate geodesic acreage, and link crop agronomic parameters.
            </p>
          </div>

          <button
            onClick={() => {
              setFormErrors([]);
              setShowAddModal(true);
            }}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all active:scale-95 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Register Field with GPS Boundary</span>
          </button>
        </div>

        {/* Search & Active Field Overview Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Selected Field Focus Card */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  CURRENTLY ACTIVE FIELD
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

              <div className="flex items-center space-x-2">
                <button
                  onClick={onPlanMission}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-emerald-400 font-bold text-xs transition-all shadow-md"
                >
                  <Compass className="w-4 h-4" />
                  <span>Plan GPS Mission</span>
                </button>
                <button
                  onClick={onDeployDrone}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-md"
                >
                  <Plane className="w-4 h-4" />
                  <span>3D Simulation</span>
                </button>
              </div>
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
                  <span>Row Spacing</span>
                </div>
                <div className="text-sm font-bold text-emerald-400">
                  {activeCropConfig.rowSpacing}m ({activeCropConfig.rowSpacing * 100}cm)
                </div>
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
                <div className="text-sm font-bold text-amber-400">{activeField.pestRisk || 'Low'}</div>
              </div>
            </div>

            {/* Field GPS Boundary Vertices List */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center space-x-1.5">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>Polygon GPS Boundary Vertices ({(activeField.boundary || activeField.polygon)?.length || 0} Points)</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activeValidation.isValid ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {activeValidation.isValid ? 'VALID POLYGON' : 'VALIDATION ERROR'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {(activeField.boundary || activeField.polygon || []).map((pt, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-emerald-400 font-bold">V{i + 1}:</span>
                    <span className="text-slate-300">
                      {(pt.latitude || pt.lat)?.toFixed(6)}° N, {(pt.longitude || pt.lng)?.toFixed(6)}° E
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Stats & Crop Agronomic Recommendation */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-3 flex items-center space-x-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Field Environment &amp; Soil</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <span className="text-slate-400">Air Temperature:</span>
                  <span className="font-bold text-white">31°C (Warm &amp; Clear)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <span className="text-slate-400">Wind Velocity:</span>
                  <span className="font-bold text-emerald-400">8 km/h (Ideal for Flight)</span>
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
                <span>Agronomic Spacing: {activeField.crop}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Row spacing: <strong>{activeCropConfig.rowSpacing}m</strong> | Intra-row plant spacing: <strong>{activeCropConfig.plantSpacing}m</strong>.
                Optimal flight altitude: <strong>{activeCropConfig.recommendedFlightAltitude}m</strong>.
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
                placeholder="Search field, location, or crop..."
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
              const fCropConfig = getCropConfig(f.crop);
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
                      <span className="text-slate-400 block">Row Spacing:</span>
                      <span className="font-semibold text-sky-400">{fCropConfig.rowSpacing} m</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">GPS Vertices:</span>
                      <span className="font-semibold text-amber-400">{(f.boundary || f.polygon)?.length || 4} Points</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveField(f);
                        onPlanMission();
                      }}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Plan Mission</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveField(f);
                        onDeployDrone();
                      }}
                      className="text-xs text-slate-300 hover:text-white font-semibold flex items-center space-x-1"
                    >
                      <span>Simulation</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Modal: Register New Field with GPS Polygon Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass-panel max-w-xl w-full p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>Register Field with GPS Polygon Boundary</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            {formErrors.length > 0 && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1">
                <div className="font-bold flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Validation Errors</span>
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  {formErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleAddField} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Field Name (Khet Ka Naam)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sardar Patel - North Wheat Plot"
                  value={newField.name}
                  onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Location / Village / District</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ludhiana, Punjab / GPS 30.7333° N, 76.7794° E"
                  value={newField.location}
                  onChange={(e) => setNewField({ ...newField, location: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Crop Type</label>
                  <select
                    value={newField.crop}
                    onChange={(e) => setNewField({ ...newField, crop: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    {Object.values(cropConfigs).map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

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
              </div>

              {/* GPS Polygon Vertices Editor */}
              <div className="border-t border-slate-800 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white uppercase text-[11px] flex items-center space-x-1.5">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    <span>GPS Polygon Vertices (Minimum 3 Points)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddVertex}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Vertex</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {newField.boundary.map((pt, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 w-6">V{index + 1}</span>
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          step="0.000001"
                          placeholder="Latitude"
                          value={pt.latitude}
                          onChange={(e) => handleVertexChange(index, 'latitude', e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                        <input
                          type="number"
                          step="0.000001"
                          placeholder="Longitude"
                          value={pt.longitude}
                          onChange={(e) => handleVertexChange(index, 'longitude', e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                      {newField.boundary.length > 3 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVertex(index)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Calculated Surface Area:</span>
                  <span className="font-bold text-emerald-400 font-mono">{newFieldArea.acres} Acres ({newFieldArea.sqMeters} m²)</span>
                </div>
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
                  Save &amp; Register Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
