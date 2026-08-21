import React from 'react';

export default function PlantHealthView({ activeField }) {
  return (
    <div className="p-gutter max-w-[1600px] mx-auto flex flex-col gap-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface">Plant Health &amp; NDVI Analytics</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Multispectral crop health scan for <strong className="text-on-surface">{activeField?.name || 'Wheat Field A'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-primary-container hover:bg-primary text-on-primary font-semibold px-4 py-2.5 rounded-lg text-label-md transition-colors flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">document_scanner</span>
            Trigger New Multispectral Scan
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm">
          <span className="text-label-sm text-on-surface-variant font-medium">Avg NDVI Index</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-display-lg text-primary font-bold">0.84</span>
            <span className="text-label-md text-emerald-600 font-semibold flex items-center">
              <span className="material-symbols-outlined text-[16px]">trending_up</span> +0.05
            </span>
          </div>
          <span className="text-label-sm text-on-surface-variant/80 mt-1 block">Optimal Vegetative Canopy</span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm">
          <span className="text-label-sm text-on-surface-variant font-medium">Healthy Canopy Area</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-display-lg text-on-surface font-bold">94.2%</span>
          </div>
          <span className="text-label-sm text-emerald-600 font-semibold mt-1 block">5.18 of 5.5 Acres</span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm">
          <span className="text-label-sm text-on-surface-variant font-medium">Nitrogen Stress Index</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-display-lg text-amber-600 font-bold">Low</span>
          </div>
          <span className="text-label-sm text-on-surface-variant/80 mt-1 block">Sector 4B requires light urea</span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm">
          <span className="text-label-sm text-on-surface-variant font-medium">Pest / Disease Risk</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-display-lg text-emerald-600 font-bold">Low</span>
          </div>
          <span className="text-label-sm text-emerald-600 font-semibold mt-1 block">No active blight detected</span>
        </div>
      </div>

      {/* Main NDVI & Graph Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        
        {/* NDVI Map Visualization */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 className="text-headline-md font-bold text-on-surface">Multispectral NDVI Heatmap</h3>
            <span className="text-label-sm bg-primary-container/20 text-primary-container px-3 py-1 rounded-full font-semibold border border-primary-container/30">
              NDVI Band 0.2 - 0.9
            </span>
          </div>

          <div className="p-6 flex flex-col items-center justify-center relative min-h-[340px] bg-slate-900 text-white rounded-b-xl overflow-hidden">
            <div className="w-full h-64 rounded-lg bg-gradient-to-tr from-emerald-900 via-green-600 to-emerald-400 p-4 relative flex items-center justify-center border border-emerald-500/30">
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-md text-xs font-mono">
                Lat: 30.7336° N | Lng: 76.7791° E
              </div>
              <div className="w-3/4 h-3/4 border-2 border-dashed border-white/40 rounded-lg flex items-center justify-center relative">
                <span className="text-emerald-200 font-mono text-sm font-semibold bg-black/40 px-3 py-1 rounded">
                  NDVI Index 0.84 (Wheat Plot A)
                </span>
              </div>
            </div>

            {/* Legend Bar */}
            <div className="w-full flex items-center justify-between mt-4 text-xs font-mono text-slate-300 px-2">
              <span>0.1 (Bare Soil)</span>
              <div className="flex-1 mx-4 h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500"></div>
              <span>0.9 (Dense Canopy)</span>
            </div>
          </div>
        </div>

        {/* Historical NDVI Trend Chart */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col">
          <div className="border-b border-outline-variant pb-4 mb-4 flex justify-between items-center">
            <h3 className="text-headline-md font-bold text-on-surface">Canopy Health Trend (4 Weeks)</h3>
            <span className="text-label-sm text-on-surface-variant font-medium">Updated 2h ago</span>
          </div>

          <div className="flex-1 flex items-end justify-between gap-4 h-64 pt-6 px-4 pb-2 border-b border-outline-variant/40">
            <div className="flex-1 bg-primary-container/20 hover:bg-primary-container/30 transition-colors rounded-t-lg h-[65%] flex flex-col items-center justify-end p-2 relative group">
              <span className="text-xs font-bold text-primary mb-1">0.72</span>
              <span className="text-label-sm text-on-surface-variant font-semibold">Week 1</span>
            </div>

            <div className="flex-1 bg-primary-container/30 hover:bg-primary-container/40 transition-colors rounded-t-lg h-[75%] flex flex-col items-center justify-end p-2 relative group">
              <span className="text-xs font-bold text-primary mb-1">0.78</span>
              <span className="text-label-sm text-on-surface-variant font-semibold">Week 2</span>
            </div>

            <div className="flex-1 bg-primary-container/50 hover:bg-primary-container/60 transition-colors rounded-t-lg h-[85%] flex flex-col items-center justify-end p-2 relative group">
              <span className="text-xs font-bold text-primary mb-1">0.81</span>
              <span className="text-label-sm text-on-surface-variant font-semibold">Week 3</span>
            </div>

            <div className="flex-1 bg-primary-container hover:bg-primary transition-colors rounded-t-lg h-[94%] flex flex-col items-center justify-end p-2 relative group text-on-primary">
              <span className="text-xs font-bold mb-1">0.84</span>
              <span className="text-label-sm font-semibold">Week 4</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-label-sm text-on-surface-variant">
            <span>Target NDVI for Wheat Seeding Stage: <strong>0.75+</strong></span>
            <span className="text-emerald-700 font-bold">Status: Above Target</span>
          </div>
        </div>

      </div>

    </div>
  );
}
