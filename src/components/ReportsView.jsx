import React from 'react';

export default function ReportsView({ activeField }) {
  const missionLogs = [
    { id: 'LOG-1092', date: 'Aug 21, 2026', type: 'Boustrophedon Seeding', field: 'Ludhiana Wheat Plot A', duration: '24m 12s', coverage: '5.5 acres', status: 'Completed' },
    { id: 'LOG-1091', date: 'Aug 20, 2026', type: 'Zero-Exposure Spraying', field: 'Karnal Paddy Field', duration: '38m 45s', coverage: '8.0 acres', status: 'Completed' },
    { id: 'LOG-1090', date: 'Aug 18, 2026', type: 'NDVI Canopy Scan', field: 'Rajkot Cotton Plot', duration: '18m 05s', coverage: '4.2 acres', status: 'Completed' },
    { id: 'LOG-1089', date: 'Aug 15, 2026', type: 'Topographical Survey', field: 'Kolhapur Sugarcane', duration: '31m 20s', coverage: '6.8 acres', status: 'Completed' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1700px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Flight &amp; Mission Reports</h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase">
              DEMO LOGS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical flight manifests, coverage metrics, and resource savings
          </p>
        </div>

        <button 
          onClick={() => alert("Downloading PDF summary report...")}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/15"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export PDF Log Manifest
        </button>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-slate-400 block font-medium">Total Area Covered</span>
          <div className="text-2xl font-extrabold text-emerald-400">24.5 Acres</div>
          <span className="text-[11px] text-slate-400 block">100% Autonomous Execution</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-slate-400 block font-medium">Water / Chemical Savings</span>
          <div className="text-2xl font-extrabold text-white">35% Saved</div>
          <span className="text-[11px] text-emerald-400 block">Micro-misting precision reduction</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-slate-400 block font-medium">Labor Hours Saved</span>
          <div className="text-2xl font-extrabold text-amber-400">14.2 Hours</div>
          <span className="text-[11px] text-slate-400 block">Compared to manual tractor labor</span>
        </div>
      </div>

      {/* Manifest Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs">
          <h3 className="font-bold text-white">Recent Mission Manifests</h3>
          <span className="text-slate-400 font-mono">4 Completed Flights</span>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3.5">Log ID</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Operation Type</th>
                <th className="p-3.5">Field Parcel</th>
                <th className="p-3.5">Flight Time</th>
                <th className="p-3.5">Coverage</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
              {missionLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/80 transition-colors">
                  <td className="p-3.5 font-bold text-emerald-400">{log.id}</td>
                  <td className="p-3.5 font-sans text-slate-300">{log.date}</td>
                  <td className="p-3.5 font-sans font-medium text-white">{log.type}</td>
                  <td className="p-3.5 font-sans text-slate-400">{log.field}</td>
                  <td className="p-3.5 text-sky-400">{log.duration}</td>
                  <td className="p-3.5 text-slate-200">{log.coverage}</td>
                  <td className="p-3.5 text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-sans font-bold">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
