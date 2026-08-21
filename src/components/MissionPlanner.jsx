import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, 
  MapPin, 
  Sprout, 
  Play, 
  Download, 
  Sliders, 
  RotateCcw, 
  Layers, 
  Clock, 
  Zap, 
  Droplets, 
  ShieldAlert, 
  FileText, 
  Compass, 
  CheckCircle2,
  ChevronRight,
  Info,
  AlertTriangle,
  Radio,
  Eye
} from 'lucide-react';
import { cropConfigs, getCropConfig } from '../data/cropConfig';
import { 
  generateMissionPlan, 
  exportWaypointsToCsv, 
  exportWaypointsToJson,
  MISSION_TYPES
} from '../utils/missionPlanner';
import { validateField } from '../utils/fieldValidator';

export default function MissionPlanner({ 
  activeField, 
  onDeployToSimulator,
  onUpdateFieldPlan
}) {
  const canvasRef = useRef(null);
  const [selectedCropId, setSelectedCropId] = useState(activeField.cropId || activeField.crop?.toLowerCase().split(' ')[0] || 'wheat');
  const cropConfig = getCropConfig(selectedCropId);
  const [missionType, setMissionType] = useState(MISSION_TYPES.SEEDING);

  // Field validation status
  const validation = validateField(activeField);

  // Custom flight parameters (initialized to crop defaults)
  const [customParams, setCustomParams] = useState({
    rowSpacing: cropConfig.rowSpacing,
    plantSpacing: cropConfig.plantSpacing,
    altitude: cropConfig.recommendedFlightAltitude,
    speed: cropConfig.flightSpeed,
    swathWidth: cropConfig.swathWidth
  });

  // Re-sync defaults when crop selection changes
  useEffect(() => {
    const newCfg = getCropConfig(selectedCropId);
    setCustomParams({
      rowSpacing: newCfg.rowSpacing,
      plantSpacing: newCfg.plantSpacing,
      altitude: newCfg.recommendedFlightAltitude,
      speed: newCfg.flightSpeed,
      swathWidth: newCfg.swathWidth
    });
  }, [selectedCropId]);

  // Generate Mission Plan from active field boundary if valid
  const missionPlan = React.useMemo(() => {
    if (!validation.isValid) return null;
    try {
      return generateMissionPlan({
        boundary: activeField.boundary || activeField.polygon,
        crop: selectedCropId,
        customParams,
        missionType
      });
    } catch (err) {
      console.error('Mission generation error:', err);
      return null;
    }
  }, [activeField, selectedCropId, customParams, missionType, validation.isValid]);

  // Update parent with latest plan if available
  useEffect(() => {
    if (missionPlan && onUpdateFieldPlan) {
      onUpdateFieldPlan(missionPlan);
    }
  }, [missionPlan, onUpdateFieldPlan]);

  // Draw 2D Interactive Map Preview on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const gridSize = 28;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (!missionPlan || !missionPlan.localPolygon || missionPlan.localPolygon.length < 3) {
      // Draw placeholder text if invalid
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        validation.isValid ? 'Generating Flight Path...' : 'Invalid Field Boundary: Please fix polygon vertices in Field Management',
        width / 2,
        height / 2
      );
      return;
    }

    const { localPolygon, waypoints, seedDropPositions, boundingBox } = missionPlan;

    // Compute scale and offsets to fit canvas with padding
    const padding = 55;
    const polyWidth = Math.max(10, boundingBox.width);
    const polyHeight = Math.max(10, boundingBox.height);
    const scale = Math.min(
      (width - padding * 2) / polyWidth,
      (height - padding * 2) / polyHeight
    );

    const centerX = (boundingBox.minX + boundingBox.maxX) / 2;
    const centerZ = (boundingBox.minZ + boundingBox.maxZ) / 2;

    const toCanvasX = (lx) => width / 2 + (lx - centerX) * scale;
    const toCanvasY = (lz) => height / 2 + (lz - centerZ) * scale;

    // 1. Draw Field Polygon Fill & Boundary
    ctx.beginPath();
    localPolygon.forEach((pt, i) => {
      const cx = toCanvasX(pt.x);
      const cy = toCanvasY(pt.z);
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    });
    ctx.closePath();

    // Polygon background fill & border
    ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([]);
    ctx.stroke();

    // 2. Draw Seed / Spray Drop Location Dots
    if (seedDropPositions && seedDropPositions.length > 0 && missionType === MISSION_TYPES.SEEDING) {
      ctx.fillStyle = cropConfig.color || '#10b981';
      seedDropPositions.forEach(sd => {
        const cx = toCanvasX(sd.localX);
        const cy = toCanvasY(sd.localZ);
        ctx.beginPath();
        ctx.arc(cx, cy, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 3. Draw Drone Flight Mission Track (Boustrophedon swaths)
    if (waypoints && waypoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = missionType === MISSION_TYPES.SEEDING ? '#38bdf8' : missionType === MISSION_TYPES.SPRAYING ? '#facc15' : '#a855f7';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);

      waypoints.forEach((wp, i) => {
        const cx = toCanvasX(wp.localX);
        const cy = toCanvasY(wp.localZ);
        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Waypoint nodes
      waypoints.forEach((wp) => {
        const cx = toCanvasX(wp.localX);
        const cy = toCanvasY(wp.localZ);

        ctx.beginPath();
        ctx.arc(cx, cy, wp.type === 'TAKEOFF' || wp.type === 'RTH' ? 7 : 4, 0, Math.PI * 2);
        
        if (wp.type === 'TAKEOFF') {
          ctx.fillStyle = '#10b981';
        } else if (wp.type === 'RTH') {
          ctx.fillStyle = '#f43f5e';
        } else {
          ctx.fillStyle = '#38bdf8';
        }
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label for Takeoff & RTH
        if (wp.type === 'TAKEOFF' || wp.type === 'RTH') {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(`WP${wp.sequence}: ${wp.type}`, cx + 9, cy - 3);
        }
      });
    }

    // 4. Draw Polygon GPS Corner Vertex Markers
    localPolygon.forEach((pt, idx) => {
      const cx = toCanvasX(pt.x);
      const cy = toCanvasY(pt.z);

      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#eab308';
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`V${idx + 1}`, cx, cy - 8);
    });

  }, [missionPlan, cropConfig, missionType, validation.isValid]);

  // Handle export files
  const handleExportCsv = () => {
    if (!missionPlan) return;
    const csv = exportWaypointsToCsv(missionPlan);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeField.name.replace(/\s+/g, '_')}_Mission_Waypoints.csv`;
    a.click();
  };

  const handleExportJson = () => {
    if (!missionPlan) return;
    const json = exportWaypointsToJson(missionPlan);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeField.name.replace(/\s+/g, '_')}_Mission_Plan.json`;
    a.click();
  };

  // Export QGroundControl / Pixhawk Hardware Format (.waypoints WPL 110)
  const handleExportWpl110 = () => {
    if (!missionPlan || !missionPlan.waypoints) return;
    let wpl = 'QGC WPL 110\n';
    missionPlan.waypoints.forEach((wp, index) => {
      const isHome = index === 0 ? 1 : 0;
      const cmd = wp.type === 'TAKEOFF' ? 22 : wp.type === 'RTH' ? 20 : wp.type === 'LAND' ? 21 : 16;
      wpl += `${index}\t${isHome}\t3\t${cmd}\t0.000000\t0.000000\t0.000000\t0.000000\t${wp.latitude.toFixed(7)}\t${wp.longitude.toFixed(7)}\t${wp.altitude.toFixed(2)}\t1\n`;
    });

    const blob = new Blob([wpl], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeField.name.replace(/\s+/g, '_')}_Pixhawk_QGC.waypoints`;
    a.click();
  };

  const resetToCropDefaults = () => {
    const cfg = getCropConfig(selectedCropId);
    setCustomParams({
      rowSpacing: cfg.rowSpacing,
      plantSpacing: cfg.plantSpacing,
      altitude: cfg.recommendedFlightAltitude,
      speed: cfg.flightSpeed,
      swathWidth: cfg.swathWidth
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>KRISHI VIKAS — Phase I: GPS Mission Planning Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-3">
              <span>Real Field GPS & Crop-Specific Mission Planner</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Generate deterministic GPS waypoint missions from field boundary polygons with agronomic crop spacing.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (missionPlan && onDeployToSimulator) {
                  onDeployToSimulator(missionPlan);
                }
              }}
              disabled={!validation.isValid || !missionPlan}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95 ${
                validation.isValid && missionPlan
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start 3D Simulation</span>
            </button>
          </div>
        </div>

        {/* Phase I System Status Banner */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase text-[10px]">
              REAL / CONFIGURABLE
            </span>
            <span className="text-slate-300">
              GPS Polygon Boundaries, Agronomic Spacing &amp; Boustrophedon Waypoint Generation
            </span>
          </div>
          <div className="flex items-center space-x-2.5 text-slate-400">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold uppercase text-[10px]">
              SIMULATED
            </span>
            <span>3D Drone Movement &amp; Seed Placement Execution</span>
          </div>
        </div>

        {/* Validation Errors Alert if any */}
        {!validation.isValid && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1.5">
            <div className="font-bold flex items-center space-x-1.5 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Field Boundary Validation Failed — Mission Generation Blocked</span>
            </div>
            <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
              {validation.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Main 2-Column Grid: Map Preview & Mission Parameters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: 2D Interactive Map Preview (7 Cols) */}
          <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${validation.isValid ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className="text-xs font-bold text-white uppercase">2D GPS Coverage Track Preview</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  ({(activeField.boundary || activeField.polygon)?.length || 0} GPS Vertices)
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportWpl110}
                  disabled={!missionPlan}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold hover:bg-emerald-500/30 disabled:opacity-50"
                  title="Download Pixhawk / ArduPilot QGC .waypoints file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>QGC (.waypoints)</span>
                </button>
                <button
                  onClick={handleExportCsv}
                  disabled={!missionPlan}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-50"
                  title="Download CSV Waypoints"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={handleExportJson}
                  disabled={!missionPlan}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-50"
                  title="Download JSON Waypoints"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>JSON</span>
                </button>
              </div>
            </div>

            {/* Canvas Map Container */}
            <div className="relative w-full h-96 bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={700}
                height={380}
                className="w-full h-full object-contain"
              />

              {/* Map Legend Overlay */}
              <div className="absolute bottom-3 left-3 glass-panel px-3 py-2 rounded-lg border border-slate-800 text-[10px] space-y-1">
                <div className="flex items-center space-x-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Field Perimeter ({missionPlan?.areaInfo?.acres || activeField.area} Acres)</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <span className="w-3 h-0.5 bg-sky-400 border-dashed" />
                  <span>Lawnmower Track ({customParams.swathWidth}m Swath)</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>GPS Polygon Vertices</span>
                </div>
              </div>
            </div>

            {/* Mission Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="glass-card p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Track</div>
                <div className="text-sm font-extrabold text-sky-400">
                  {missionPlan?.metrics.totalDistanceMeters || 0} m
                </div>
              </div>

              <div className="glass-card p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Est. Flight Time</div>
                <div className="text-sm font-extrabold text-emerald-400">
                  {missionPlan?.metrics.estimatedTimeMinutes || 0} min
                </div>
              </div>

              <div className="glass-card p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Waypoints</div>
                <div className="text-sm font-extrabold text-amber-400">
                  {missionPlan?.metrics.totalWaypoints || 0} WPs
                </div>
              </div>

              <div className="glass-card p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Est. Battery Drain</div>
                <div className="text-sm font-extrabold text-teal-300">
                  ~{missionPlan?.metrics.estimatedBatteryUsage || 0}%
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Mission Type, Crop Agronomics & Spacing Settings (5 Cols) */}
          <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 space-y-5">
            
            {/* Mission Type Selector */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase flex items-center space-x-1.5 mb-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>Mission Operation Type</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setMissionType(MISSION_TYPES.SEEDING)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    missionType === MISSION_TYPES.SEEDING
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Sprout className="w-3.5 h-3.5" />
                  <span>Seeding</span>
                </button>

                <button
                  onClick={() => setMissionType(MISSION_TYPES.SPRAYING)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    missionType === MISSION_TYPES.SPRAYING
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Spraying</span>
                </button>

                <button
                  onClick={() => setMissionType(MISSION_TYPES.SURVEY)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    missionType === MISSION_TYPES.SURVEY
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Survey</span>
                </button>
              </div>
            </div>

            {/* Crop Selector Card */}
            <div className="border-t border-slate-800 pt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase flex items-center space-x-1.5">
                  <Sprout className="w-4 h-4 text-emerald-400" />
                  <span>Crop Configuration</span>
                </label>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {cropConfig.category}
                </span>
              </div>

              <select
                value={selectedCropId}
                onChange={(e) => setSelectedCropId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                {Object.values(cropConfigs).map(crop => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name} - {crop.hindiName}
                  </option>
                ))}
              </select>

              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                <Info className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
                {cropConfig.description}
              </p>
            </div>

            {/* Agronomic Spacing & Flight Parameters */}
            <div className="space-y-4 border-t border-slate-800 pt-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase text-[11px] flex items-center space-x-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Agronomic Spacing Parameters</span>
                </span>
                <button
                  onClick={resetToCropDefaults}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Defaults</span>
                </button>
              </div>

              {/* Row Spacing Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Row Spacing (Line-to-Line)</span>
                  <span className="font-bold text-emerald-400">{customParams.rowSpacing} m ({(customParams.rowSpacing * 100).toFixed(0)} cm)</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.05"
                  value={customParams.rowSpacing}
                  onChange={(e) => setCustomParams({ ...customParams, rowSpacing: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Plant Spacing Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Intra-Row Plant Spacing</span>
                  <span className="font-bold text-teal-400">{customParams.plantSpacing} m ({(customParams.plantSpacing * 100).toFixed(0)} cm)</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={customParams.plantSpacing}
                  onChange={(e) => setCustomParams({ ...customParams, plantSpacing: parseFloat(e.target.value) })}
                  className="w-full accent-teal-500"
                />
              </div>

              {/* Swath Width Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Flight Track Swath Width</span>
                  <span className="font-bold text-sky-400">{customParams.swathWidth} m</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="8.0"
                  step="0.5"
                  value={customParams.swathWidth}
                  onChange={(e) => setCustomParams({ ...customParams, swathWidth: parseFloat(e.target.value) })}
                  className="w-full accent-sky-500"
                />
              </div>

              {/* Flight Altitude Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Drone Flight Altitude</span>
                  <span className="font-bold text-amber-400">{customParams.altitude} m</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="10.0"
                  step="0.5"
                  value={customParams.altitude}
                  onChange={(e) => setCustomParams({ ...customParams, altitude: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* Estimated Consumables Payload Card */}
            <div className="border-t border-slate-800 pt-4 space-y-2.5 text-xs">
              <span className="font-bold text-white uppercase text-[11px] block">
                Estimated Farm Consumables Required
              </span>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 flex items-center justify-center space-x-1 mb-0.5">
                    <Sprout className="w-3 h-3 text-emerald-400" />
                    <span>Seeds</span>
                  </div>
                  <div className="font-bold text-emerald-400">
                    {(missionPlan?.areaInfo.acres * cropConfig.seedRate).toFixed(1)} kg
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 flex items-center justify-center space-x-1 mb-0.5">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <span>Water</span>
                  </div>
                  <div className="font-bold text-blue-400">
                    {missionPlan?.metrics.totalWaterLitres} L
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 flex items-center justify-center space-x-1 mb-0.5">
                    <ShieldAlert className="w-3 h-3 text-amber-400" />
                    <span>Chemical</span>
                  </div>
                  <div className="font-bold text-amber-400">
                    {missionPlan?.metrics.totalPesticideLitres} L
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Waypoints Inspector Table */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Generated GPS Mission Waypoint Sequence ({missionPlan?.waypoints?.length || 0})</span>
            </h2>
            <span className="text-xs text-slate-400">
              Format: WGS-84 Transverse Equirectangular / QGC Compliant
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Seq #</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Latitude</th>
                  <th className="py-2.5 px-3">Longitude</th>
                  <th className="py-2.5 px-3">Altitude (m)</th>
                  <th className="py-2.5 px-3">Speed (m/s)</th>
                  <th className="py-2.5 px-3">Mission Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {missionPlan?.waypoints?.map((wp) => (
                  <tr key={wp.sequence} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-2 px-3 font-bold text-emerald-400">{wp.sequence}</td>
                    <td className="py-2 px-3 text-slate-300 font-sans">{wp.type}</td>
                    <td className="py-2 px-3 text-slate-400">{wp.latitude.toFixed(6)}° N</td>
                    <td className="py-2 px-3 text-slate-400">{wp.longitude.toFixed(6)}° E</td>
                    <td className="py-2 px-3 text-sky-400">{wp.altitude.toFixed(1)}m</td>
                    <td className="py-2 px-3 text-teal-400">{wp.speed.toFixed(1)} m/s</td>
                    <td className="py-2 px-3 text-amber-300 font-sans">{wp.action || wp.actionDescription}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
