import React from 'react';
import { 
  BookOpen, 
  Sprout, 
  Droplets, 
  ShieldAlert, 
  MapPin, 
  Plane, 
  HelpCircle, 
  CheckCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function FarmerGuide({ onLaunchDemo }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Banner Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>Kisan Nirdeshika / Farmer Operation Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            How KRISHI VIKAS Drone System Works
          </h1>
          <p className="text-sm text-slate-400">
            Simplified guide for farmers to deploy autonomous drones for 10-meter precision seeding, automated watering, and safe pesticide spraying.
          </p>
        </div>

        {/* 4 Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-4xl font-black text-slate-800">01</div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">1. Field Registration (Khet Ka Vivran)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Open the <strong>Field Management</strong> tab and enter your field name, village location, crop type (Wheat, Rice, Cotton, etc.), and soil details. The system automatically plots a 10-meter grid across your land.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-4xl font-black text-slate-800">02</div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Sprout className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">2. 10-Meter Precision Seeding (Beej Bopana)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Load seeds into the drone's seed dispenser hopper. Launch the drone in <strong>Seeding Mode</strong>. The drone will fly along the field grid and drop one seed exactly every 10 meters, giving plants optimal soil room.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-4xl font-black text-slate-800">03</div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">3. Water Irrigation Mist Spraying (Sinchai)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fill the drone's 20-Liter water tank. Switch to <strong>Water Irrigation Mode</strong>. The drone emits a fine water mist directly over planted rows, saving 48% more water compared to traditional flood channels.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-4xl font-black text-slate-800">04</div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">4. Crop Growth & Pesticide Protection (Keetnashak)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Once crops sprout and grow, fill the pesticide container and run the anti-pest mist routine. The drone applies targeted chemical mist safely without farmer direct contact or health risks.
            </p>
          </div>

        </div>

        {/* Call to Action Box */}
        <div className="glass-panel p-8 rounded-2xl border border-emerald-500/30 text-center space-y-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
          <Sparkles className="w-8 h-8 text-emerald-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Ready to see the 3D Drone Demonstration?</h2>
          <p className="text-xs text-slate-300 max-w-xl mx-auto">
            Experience our real-time interactive 3D WebGL simulator to see the drone in action dropping seeds every 10 meters and spraying water/pesticides!
          </p>
          <button
            onClick={onLaunchDemo}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-sm shadow-xl hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-95"
          >
            <Plane className="w-5 h-5" />
            <span>Launch 3D Simulation Demo Now</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* FAQ Section */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <span>Frequently Asked Questions (Aam Sawal)</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <div className="font-bold text-white text-sm mb-1">Q: Why drop 1 seed every 10 meters?</div>
              <p className="text-slate-400">
                A 10-meter grid spacing gives roots maximum depth access, prevents crop overcrowding, allows optimal sunlight exposure, and provides clear space for automated watering and harvesting equipment.
              </p>
            </div>

            <div>
              <div className="font-bold text-white text-sm mb-1">Q: Can the drone carry seeds, water, and pesticide at the same time?</div>
              <p className="text-slate-400">
                Yes! The KRISHI VIKAS drone features a modular triple-payload bay: 1 bottom seed dropper nozzle, 2 lateral water tanks, and 1 rear pesticide canister.
              </p>
            </div>

            <div>
              <div className="font-bold text-white text-sm mb-1">Q: What happens when battery or tanks are empty?</div>
              <p className="text-slate-400">
                The onboard AI automatically calculates distance to base and executes an emergency Return-To-Home (RTH) landing at 15% battery or low tank level.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
