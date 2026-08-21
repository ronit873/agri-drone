import React from 'react';

export default function ReportsView({ activeField }) {
  const missionLogs = [
    { id: 'LOG-1092', date: 'Aug 21, 2026', type: 'Boustrophedon Seeding', field: 'Ludhiana Wheat Plot A', duration: '24m 12s', coverage: '5.5 acres', status: 'Completed' },
    { id: 'LOG-1091', date: 'Aug 20, 2026', type: 'Zero-Exposure Spraying', field: 'Karnal Paddy Field', duration: '38m 45s', coverage: '8.0 acres', status: 'Completed' },
    { id: 'LOG-1090', date: 'Aug 18, 2026', type: 'NDVI Canopy Scan', field: 'Rajkot Cotton Plot', duration: '18m 05s', coverage: '4.2 acres', status: 'Completed' },
    { id: 'LOG-1089', date: 'Aug 15, 2026', type: 'Topographical Survey', field: 'Kolhapur Sugarcane', duration: '31m 20s', coverage: '6.8 acres', status: 'Completed' },
  ];

  return (
    <div className="p-gutter max-w-[1600px] mx-auto flex flex-col gap-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface">Flight &amp; Mission Reports</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Historical flight logs, resource efficiency analytics, and exported mission manifests
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert("Downloading PDF summary report...")}
            className="bg-primary-container hover:bg-primary text-on-primary font-semibold px-4 py-2.5 rounded-lg text-label-md transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export PDF Summary Report
          </button>
        </div>
      </div>

      {/* Analytics Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm">
          <span className="text-label-sm text-on-surface-variant font-medium">Total Area Covered</span>
          <div className="text-display-lg text-primary font-bold mt-2">24.5 Acres</div>
          <span className="text-label-sm text-emerald-600 font-semibold mt-1 block">100% Autonomous GPS Execution</span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm">
          <span className="text-label-sm text-on-surface-variant font-medium">Estimated Water / Chemical Saved</span>
          <div className="text-display-lg text-on-surface font-bold mt-2">35% Saved</div>
          <span className="text-label-sm text-emerald-600 font-semibold mt-1 block">Targeted Zero-Exposure Micro-Misting</span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm">
          <span className="text-label-sm text-on-surface-variant font-medium">Farmer Labor Time Saved</span>
          <div className="text-display-lg text-amber-600 font-bold mt-2">14.2 Hours</div>
          <span className="text-label-sm text-on-surface-variant/80 mt-1 block">Compared to manual tractor spraying</span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h3 className="text-headline-md font-bold text-on-surface">Recent Mission Execution Manifests</h3>
          <span className="text-label-sm text-on-surface-variant font-medium">Showing 4 recent missions</span>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/60 text-label-sm text-on-surface-variant uppercase bg-surface-container/50">
                <th className="p-4 font-semibold">Log ID</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Mission Type</th>
                <th className="p-4 font-semibold">Field Parcel</th>
                <th className="p-4 font-semibold">Flight Time</th>
                <th className="p-4 font-semibold">Coverage</th>
                <th className="p-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-body-md text-on-surface">
              {missionLogs.map((log) => (
                <tr key={log.id} className="border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors">
                  <td className="p-4 font-mono font-bold text-primary">{log.id}</td>
                  <td className="p-4">{log.date}</td>
                  <td className="p-4 font-medium">{log.type}</td>
                  <td className="p-4 text-on-surface-variant">{log.field}</td>
                  <td className="p-4 font-mono">{log.duration}</td>
                  <td className="p-4">{log.coverage}</td>
                  <td className="p-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/30 text-primary-container text-label-sm font-semibold border border-secondary-container">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
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
