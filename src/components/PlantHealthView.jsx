import React from 'react';

export default function PlantHealthView({ activeField }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1700px] mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Plant Health &amp; NDVI Analytics</h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase">
              DEMO / SIMULATED ANALYTICS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multispectral canopy health index &amp; nitrogen stress indicators for <strong className="text-slate-200">{activeField?.name}</strong>
          </p>
        </div>

        <button 
          onClick={() => alert("Simulated scan requested for " + activeField?.name)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/15"
        >
          <span className="material-symbols-outlined text-[18px]">document_scanner</span>
          Trigger Simulated Scan
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-slate-400 block font-medium">Avg NDVI Index</span>
          <div className="text-2xl font-extrabold text-emerald-400">0.84</div>
          <span className="text-[11px] text-slate-400 block">Canopy vigor optimal (Simulated)</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-slate-400 block font-medium">Healthy Canopy Coverage</span>
          <div className="text-2xl font-extrabold text-white">94.2%</div>
          <span className="text-[11px] text-emerald-400 block">{activeField?.area ? (activeField.area * 0.94).toFixed(1) : 5.1} of {activeField?.area || 5.5} Acres</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-slate-400 block font-medium">Nitrogen Deficiency Index</span>
          <div className="text-2xl font-extrabold text-amber-400">Low Risk</div>
          <span className="text-[11px] text-slate-400 block">Sector 4B requires light nitrogen</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-slate-400 block font-medium">Pest Vulnerability</span>
          <div className="text-2xl font-extrabold text-emerald-400">Low Risk</div>
          <span className="text-[11px] text-emerald-400 block">Zero active blight detected</span>
        </div>
      </div>

      {/* Main Grid: Heatmap & Trend Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* NDVI Canopy Scan Visualization */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Multispectral NDVI Canopy Map</h3>
            <span className="text-[10px] text-amber-400 font-mono">SIMULATED OVERLAY</span>
          </div>

          <div className="w-full h-64 rounded-xl bg-gradient-to-tr from-emerald-950 via-emerald-800 to-green-500 border border-emerald-500/30 p-4 relative flex flex-col justify-between">
            <div className="flex justify-between items-start text-xs font-mono text-white/80">
              <span className="bg-black/60 backdrop-blur px-2.5 py-1 rounded">Lat: 30.7336° N | Lng: 76.7791° E</span>
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded border border-emerald-500/40">NDVI 0.84</span>
            </div>

            <div className="w-full bg-black/60 backdrop-blur p-2 rounded-lg text-[10px] font-mono text-slate-300 flex justify-between">
              <span>0.1 (Bare Soil)</span>
              <div className="flex-1 mx-3 h-2 rounded bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500 my-auto"></div>
              <span>0.9 (Dense Canopy)</span>
            </div>
          </div>
        </div>

        {/* 4-Week Health Index Trend */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Canopy Health Progress (4 Weeks)</h3>
            <span className="text-xs text-slate-400">Target NDVI: 0.75+</span>
          </div>

          <div className="flex items-end justify-between gap-3 h-52 pt-4 px-2 text-xs">
            <div className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 transition-all rounded-t-xl h-[65%] flex flex-col justify-end items-center p-2 text-slate-300">
              <span className="font-bold text-emerald-400">0.72</span>
              <span className="text-[10px] text-slate-400 mt-1">W1</span>
            </div>
            <div className="flex-1 bg-emerald-500/30 hover:bg-emerald-500/40 transition-all rounded-t-xl h-[75%] flex flex-col justify-end items-center p-2 text-slate-300">
              <span className="font-bold text-emerald-400">0.78</span>
              <span className="text-[10px] text-slate-400 mt-1">W2</span>
            </div>
            <div className="flex-1 bg-emerald-500/50 hover:bg-emerald-500/60 transition-all rounded-t-xl h-[85%] flex flex-col justify-end items-center p-2 text-slate-300">
              <span className="font-bold text-emerald-400">0.81</span>
              <span className="text-[10px] text-slate-400 mt-1">W3</span>
            </div>
            <div className="flex-1 bg-emerald-500 hover:bg-emerald-400 transition-all rounded-t-xl h-[95%] flex flex-col justify-end items-center p-2 text-slate-950 font-bold">
              <span>0.84</span>
              <span className="text-[10px] text-slate-950 mt-1">W4</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
