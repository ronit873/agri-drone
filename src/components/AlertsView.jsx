import React from 'react';

export default function AlertsView({ onNavigateTab }) {
  const alertsList = [
    {
      id: 'alert-1',
      title: 'Pest Risk Alert: Yellow Rust Vulnerability',
      category: 'Crop Risk',
      severity: 'Medium',
      time: '45 mins ago',
      field: 'Ramesh Farm — Wheat Plot A',
      description: 'Humid conditions in Sector 4B detected. Recommended micro-mist fungicide application to prevent early yellow rust spread.',
      actionText: 'Plan Spray Mission',
      actionTab: 'planner',
      icon: 'warning',
      color: 'amber'
    },
    {
      id: 'alert-2',
      title: 'RTK-GPS Centimeter Signal Locked',
      category: 'Telemetry',
      severity: 'Low',
      time: '2 hours ago',
      field: 'Green Acres Paddy Field',
      description: 'High-precision RTK base station signal acquired with 14 satellites. Boustrophedon swath accuracy guaranteed within 2 cm.',
      actionText: 'View Telemetry',
      actionTab: 'simulator',
      icon: 'satellite_alt',
      color: 'emerald'
    },
    {
      id: 'alert-3',
      title: 'Pesticide Tank Level Below 20%',
      category: 'Hardware Payload',
      severity: 'High',
      time: '3 hours ago',
      field: 'Drone Agri-X1 Pro',
      description: 'Liquid tank level is at 18%. Refill zero-exposure micro-mist canister before starting next 5-acre mission.',
      actionText: 'Refill Checklist',
      actionTab: 'guide',
      icon: 'opacity',
      color: 'red'
    }
  ];

  return (
    <div className="p-gutter max-w-[1600px] mx-auto flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface">System Alerts &amp; Advisories</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Real-time notifications for agronomic risks, payload warnings, and flight telemetry
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="border border-outline-variant hover:bg-surface-container-low text-on-surface font-semibold px-4 py-2.5 rounded-lg text-label-md transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">done_all</span>
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex flex-col gap-4">
        {alertsList.map((alert) => (
          <div 
            key={alert.id}
            className={`bg-surface-container-lowest border rounded-xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
              alert.severity === 'High' ? 'border-error/40 bg-error-container/10' :
              alert.severity === 'Medium' ? 'border-amber-500/40 bg-amber-50/20' :
              'border-outline-variant'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                alert.severity === 'High' ? 'bg-error text-on-error' :
                alert.severity === 'Medium' ? 'bg-amber-500 text-white' :
                'bg-primary-container text-on-primary'
              }`}>
                <span className="material-symbols-outlined text-[24px]">{alert.icon}</span>
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-headline-md font-bold text-on-surface">{alert.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-label-sm font-bold ${
                    alert.severity === 'High' ? 'bg-error-container text-on-error-container' :
                    alert.severity === 'Medium' ? 'bg-amber-100 text-amber-900' :
                    'bg-secondary-container text-on-secondary-container'
                  }`}>
                    {alert.severity} Priority
                  </span>
                  <span className="text-label-sm text-on-surface-variant">• {alert.time}</span>
                </div>

                <p className="text-body-md text-on-surface-variant mt-1">{alert.description}</p>
                <p className="text-label-sm text-outline mt-1 font-semibold">Field / Unit: {alert.field}</p>
              </div>
            </div>

            <button 
              onClick={() => onNavigateTab(alert.actionTab)}
              className="bg-primary-container hover:bg-primary text-on-primary font-semibold px-4 py-2.5 rounded-lg text-label-md transition-colors flex items-center gap-2 flex-shrink-0 shadow-sm"
            >
              <span>{alert.actionText}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
