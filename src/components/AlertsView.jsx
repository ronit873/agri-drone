import React from 'react';

export default function AlertsView({ onNavigateTab }) {
  const alerts = [
    {
      id: 'ALT-01',
      title: 'Pest Risk Warning: Yellow Rust Vulnerability',
      category: 'Crop Health',
      severity: 'WARNING',
      time: '45 mins ago',
      details: 'High humidity detected in Sector 4B. Recommended fungicide micro-misting.',
      actionText: 'Plan Spray Mission',
      tabTarget: 'missions'
    },
    {
      id: 'ALT-02',
      title: 'RTK-GPS Base Station Lock Acquired',
      category: 'GPS',
      severity: 'INFO',
      time: '2 hours ago',
      details: 'RTK positioning active with 14 satellites. 2cm accuracy confirmed.',
      actionText: 'Open Drone Control',
      tabTarget: 'drone'
    },
    {
      id: 'ALT-03',
      title: 'Pesticide Tank Level Low (<20%)',
      category: 'Payload',
      severity: 'CRITICAL',
      time: '3 hours ago',
      details: 'Canister volume at 18%. Refill zero-exposure payload before next flight.',
      actionText: 'Check Tank Status',
      tabTarget: 'drone'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1700px] mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Alert &amp; Advisory Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            System warnings, battery thresholds, and crop protection advisories
          </p>
        </div>

        <button className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs">
          Acknowledge All
        </button>
      </div>

      <div className="space-y-4">
        {alerts.map((item) => (
          <div 
            key={item.id}
            className={`p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
              item.severity === 'CRITICAL' ? 'border-rose-500/50 bg-rose-500/10' :
              item.severity === 'WARNING' ? 'border-amber-500/50 bg-amber-500/10' :
              'border-slate-800 bg-slate-900/60'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                  item.severity === 'CRITICAL' ? 'bg-rose-500 text-slate-950' :
                  item.severity === 'WARNING' ? 'bg-amber-500 text-slate-950' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {item.severity}
                </span>
                <span className="text-slate-400 font-semibold">{item.category}</span>
                <span className="text-slate-500">• {item.time}</span>
              </div>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-300">{item.details}</p>
            </div>

            <button
              onClick={() => onNavigateTab(item.tabTarget)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1 flex-shrink-0"
            >
              <span>{item.actionText}</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
