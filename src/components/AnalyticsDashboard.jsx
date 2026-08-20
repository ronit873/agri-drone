import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Sprout, 
  Droplets, 
  ShieldAlert, 
  Zap, 
  Clock, 
  Award,
  CheckCircle2,
  PieChart
} from 'lucide-react';

export default function AnalyticsDashboard({ droneState, activeField }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Yield & Efficiency Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Farm Performance & Resource Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Quantitative metrics comparing Krishi Vikas autonomous 10m drone seeding against traditional farming methods.
          </p>
        </div>

        {/* Top Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
              <span>Seeding Precision</span>
              <Sprout className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">99.4%</div>
            <p className="text-xs text-emerald-400 flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Exact 10-meter interval accuracy</span>
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
              <span>Water Conservation</span>
              <Droplets className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-blue-400">-48%</div>
            <p className="text-xs text-slate-400">vs. traditional flood irrigation</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
              <span>Chemical Reduction</span>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-400">-62%</div>
            <p className="text-xs text-slate-400">zero waste targeted misting</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
              <span>Time Saved / Acre</span>
              <Clock className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-3xl font-black text-teal-400">12x Faster</div>
            <p className="text-xs text-slate-400">10 mins/acre vs 3 hours manual</p>
          </div>

        </div>

        {/* Comparison Tables & Graphs Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Method Comparison Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>KRISHI VIKAS vs Traditional Manual Farming</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Seed Placement Spacing</div>
                  <div className="text-slate-400 text-[11px]">Uniform root room & sunlight</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">Exact 10 Meters</div>
                  <div className="text-rose-400 line-through text-[10px]">Random / Clustered</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Farmer Chemical Exposure</div>
                  <div className="text-slate-400 text-[11px]">Pesticide safety & health</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">0% Exposure (Autonomous)</div>
                  <div className="text-rose-400 text-[10px]">High risk (Hand spray)</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Water Efficiency</div>
                  <div className="text-slate-400 text-[11px]">Targeted misting vs canal waste</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">92% Utilization</div>
                  <div className="text-rose-400 text-[10px]">45% Lost to evaporation</div>
                </div>
              </div>
            </div>
          </div>

          {/* Crop Lifecycle Stage Progress */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <PieChart className="w-5 h-5 text-teal-400" />
              <span>Crop Lifecycle Stage Tracker</span>
            </h2>

            <div className="space-y-4 text-xs">
              
              <div>
                <div className="flex justify-between font-semibold text-slate-300 mb-1">
                  <span className="flex items-center space-x-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Stage 1: 10m Seeding Pass</span>
                  </span>
                  <span className="text-emerald-400">100% Complete</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-300 mb-1">
                  <span className="flex items-center space-x-1.5 text-blue-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Stage 2: Water Mist Irrigation</span>
                  </span>
                  <span className="text-blue-400">85% Complete</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-500 w-[85%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-300 mb-1">
                  <span className="flex items-center space-x-1.5 text-amber-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Stage 3: Pesticide Protection Routine</span>
                  </span>
                  <span className="text-amber-400">Active Monitoring</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 w-[60%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-300 mb-1">
                  <span className="flex items-center space-x-1.5 text-slate-400">
                    <span>Stage 4: Harvest & Yield Analytics</span>
                  </span>
                  <span className="text-slate-400">Upcoming in 45 days</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div className="h-full bg-slate-700 w-[20%]" />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
