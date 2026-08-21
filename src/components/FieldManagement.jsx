import React, { useState } from 'react';
import { calculatePolygonArea } from '../utils/geoUtils';
import { validateField } from '../utils/fieldValidator';
import { cropConfigs, getCropConfig } from '../data/cropConfig';

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
  
  // Form state for adding new field
  const [newField, setNewField] = useState({
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

  const [formErrors, setFormErrors] = useState([]);

  // Calculate live acreage of boundary polygon
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
    
    try {
      localStorage.setItem('krishi_vikas_fields', JSON.stringify(updatedFields));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
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
  const activeBoundary = activeField.boundary || activeField.polygon || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1700px] mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Fields &amp; GPS Boundary Manager</h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-point WGS-84 geodesic polygon editor &amp; agronomy database
          </p>
        </div>

        <button
          onClick={() => {
            setFormErrors([]);
            setShowAddModal(true);
          }}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/15"
        >
          <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
          Register New Field Parcel
        </button>
      </div>

      {/* Main Focus: Active Field Polygon Visualization & Coordinates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dominant Field Boundary Map & Details */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  SELECTED PARCEL
                </span>
                <h2 className="text-lg font-bold text-white">{activeField.name}</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {activeField.location} • <strong className="text-emerald-400">{activeField.area} Acres</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onPlanMission}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-emerald-400 font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">compass_calibration</span>
                Plan Mission
              </button>
              <button
                onClick={onDeployDrone}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
              >
                <span className="material-symbols-outlined text-[16px]">flight</span>
                3D View
              </button>
            </div>
          </div>

          {/* Simulated 2D Map Polygon Render */}
          <div className="w-full h-64 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center map-grid">
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
              Shoelace Area: {activeField.area} Acres | Vertices: {activeBoundary.length}
            </div>

            <svg className="w-full h-full p-8" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon 
                points="15,20 85,15 80,85 20,80" 
                fill="rgba(16, 185, 129, 0.15)" 
                stroke="#10b981" 
                strokeWidth="2" 
                strokeDasharray="4,4"
              />
              <circle cx="15" cy="20" r="3" fill="#10b981" />
              <circle cx="85" cy="15" r="3" fill="#10b981" />
              <circle cx="80" cy="85" r="3" fill="#10b981" />
              <circle cx="20" cy="80" r="3" fill="#10b981" />
            </svg>
          </div>

          {/* GPS Coordinates Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-400 text-[18px]">location_searching</span>
                WGS-84 Coordinate Vertices ({activeBoundary.length} Points)
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                activeValidation.isValid ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {activeValidation.isValid ? 'GEODESIC POLYGON VALID' : 'VALIDATION WARNING'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
              {activeBoundary.map((pt, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">V{i + 1}:</span>
                  <span className="text-slate-300">
                    {(pt.latitude || pt.lat)?.toFixed(6)}° N, {(pt.longitude || pt.lng)?.toFixed(6)}° E
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agronomic Recommendations Panel */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="material-symbols-outlined text-amber-400 text-[20px]">psychology</span>
              Crop Agronomy Parameters
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Crop Species:</span>
                <span className="font-bold text-emerald-400">{activeField.crop}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Row Spacing:</span>
                <span className="font-bold text-white">{activeCropConfig.rowSpacing} m ({activeCropConfig.rowSpacing * 100} cm)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Plant-to-Plant Spacing:</span>
                <span className="font-bold text-white">{activeCropConfig.plantSpacing} m</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Optimum Altitude:</span>
                <span className="font-bold text-sky-400">{activeCropConfig.recommendedFlightAltitude} m</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Growth Stage:</span>
                <span className="font-bold text-amber-400">{activeField.growthStage}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
            <span className="font-bold text-emerald-400 block">Agronomic Recommendation</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Ready for Boustrophedon swath flight planning. Estimated seed payload required: <strong>{(activeField.area * 12).toFixed(1)} kg</strong>.
            </p>
          </div>
        </div>

      </div>

      {/* Field List Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-white">Registered Field Parcels ({fields.length})</h2>

          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">search</span>
            <input
              type="text"
              placeholder="Search by field, crop, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFields.map((f) => {
            const isActive = activeField.id === f.id;
            return (
              <div
                key={f.id}
                onClick={() => setActiveField(f)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isActive 
                    ? 'border-emerald-500/60 bg-slate-900 ring-1 ring-emerald-500/30' 
                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{f.name}</span>
                      {isActive && <span className="text-emerald-400 font-bold">✓</span>}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{f.location}</p>
                  </div>

                  <button
                    onClick={(e) => handleDeleteField(f.id, e)}
                    className="text-slate-500 hover:text-rose-400 p-1 text-xs"
                    title="Delete field"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-400 block text-[10px]">AREA</span>
                    <span className="font-bold text-white">{f.area} Acres</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">CROP</span>
                    <span className="font-bold text-emerald-400">{f.crop}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Field Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 max-w-lg w-full p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Register GPS Polygon Field Parcel</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            {formErrors.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {formErrors.join(', ')}
              </div>
            )}

            <form onSubmit={handleAddField} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Field Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Farm — Wheat Plot A"
                  value={newField.name}
                  onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ludhiana, Punjab"
                  value={newField.location}
                  onChange={(e) => setNewField({ ...newField, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Crop</label>
                  <select
                    value={newField.crop}
                    onChange={(e) => setNewField({ ...newField, crop: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {Object.values(cropConfigs).map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Soil</label>
                  <select
                    value={newField.soil}
                    onChange={(e) => setNewField({ ...newField, soil: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Alluvial Soil">Alluvial Soil</option>
                    <option value="Black Soil">Black Soil</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                  </select>
                </div>
              </div>

              {/* Polygon Vertices Editor */}
              <div className="border-t border-slate-800 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">GPS Vertices (Min 3)</span>
                  <button type="button" onClick={handleAddVertex} className="text-emerald-400 font-bold">+ Add Vertex</button>
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {newField.boundary.map((pt, index) => (
                    <div key={index} className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 font-mono">
                      <span className="text-emerald-400 font-bold">V{index+1}</span>
                      <input
                        type="number"
                        step="0.000001"
                        value={pt.latitude}
                        onChange={(e) => handleVertexChange(index, 'latitude', e.target.value)}
                        className="w-1/2 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-[11px]"
                      />
                      <input
                        type="number"
                        step="0.000001"
                        value={pt.longitude}
                        onChange={(e) => handleVertexChange(index, 'longitude', e.target.value)}
                        className="w-1/2 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-[11px]"
                      />
                      {newField.boundary.length > 3 && (
                        <button type="button" onClick={() => handleRemoveVertex(index)} className="text-slate-500 hover:text-rose-400">✕</button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  Area: <strong className="text-emerald-400">{newFieldArea.acres} Acres</strong>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold">Save Field</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
