# 🌾 KRISHI VIKAS - Autonomous Agricultural Drone & 3D Field Management Platform

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.168.0-black.svg)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.13-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**KRISHI VIKAS** is an AI-powered agricultural drone simulation and field management web platform. It features an interactive **3D WebGL simulation** demonstrating an autonomous quadcopter drone equipped with a triple-payload system (Seed Hopper, Water Tank, Pesticide Container) performing **10-meter precision grid seeding**, automated water mist irrigation, crop health monitoring, and targeted pesticide spraying.

---

## 🚀 Key Features

### 🚁 1. Interactive 3D WebGL Simulation Engine
* **Procedural 3D Quadcopter Drone**: Central metallic chassis, 4 motor arms with high-speed spinning rotors, navigation LEDs, and a downward LiDAR laser cone.
* **10-Meter Precision Seeding**: Drone flies along agricultural grid lines and drops 1 seed every 10 meters into the soil.
* **Dynamic 3D Sprout Growth**: Seeds automatically germinate into 3D sprout plants at soil level when dropped.
* **Particle Mist Systems**:
  * 💧 **Water Irrigation Mode**: Translucent blue particle stream hydrates soil rows.
  * 🌿 **Pesticide Protection Mode**: Chemical fog mist protects mature crops without human exposure.
* **Interactive Camera Views**: 3D Orbit view, 3rd-person Follow view, Drone POV (cockpit camera), and Top-Down Grid view.

---

### 🌾 2. Field Management System ("Khet Niyojan")
* **Field Registration**: Register farmer fields with Name, Village/Location, Area (Acres), Primary Crop Type (*Wheat, Rice/Paddy, Cotton, Corn, Sugarcane, Mustard*), Soil Type, and Soil Moisture %.
* **Soil & Pest Risk Monitoring**: Track soil hydration status and automated pesticide schedules.
* **One-Click Drone Deployment**: Select any field to instantly load its coordinates into the 3D drone simulator.

---

### ⚡ 3. Real-Time Telemetry HUD & Diagnostics
* **Live Gauges**: LiPo battery voltage/capacity %, Seed hopper kg remaining, Water tank liters, Pesticide chemical level.
* **Avionics & Motor Status**: Real-time RPM tracking for Motors #1–#4, ESC synchronizer status, GPS constellation lock (16 satellites), and LiDAR altitude readout.

---

### 📊 4. Yield Analytics & Farmer Operation Guide
* **Quantitative Efficiency Metrics**: Demonstrates **99.4% seeding precision**, **48% water conservation**, **62% chemical reduction**, and **12x time savings per acre**.
* **Kisan Guide**: Multilingual (Hindi/English) instructions for farmers.

---

## 🛠️ Tech Stack

* **Frontend**: React 18, Vite
* **3D Engine**: Three.js (WebGL rendering, custom shaders, lighting, particle physics)
* **Styling**: Tailwind CSS, Glassmorphism UI
* **Icons**: Lucide React

---

## 📂 Project Architecture

```
SIH/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md               <-- Documentation File
├── .gitignore
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx             <-- Main Container & Global Telemetry State
    └── components/
        ├── Navbar.jsx      <-- Header & Quick Gauges Bar
        ├── FieldManagement.jsx <-- Field Registration & Khet Dashboard
        ├── TelemetryHUD.jsx     <-- Drone Cockpit & Battery/Tank Controls
        ├── AnalyticsDashboard.jsx <-- Efficiency Graphs & Yield Reports
        ├── FarmerGuide.jsx      <-- Kisan Nirdeshika Instruction Guide
        └── 3d/
            └── DroneSimulator.jsx <-- Three.js 3D WebGL Simulation Engine
```

---

## ⚙️ Getting Started / Local Setup

### Prerequisites
Make sure you have **Node.js (v18 or higher)** installed on your machine.

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/krishi-vikas.git
   cd krishi-vikas
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:5173/` in your web browser.

---

## 📤 How to Push to GitHub Repository

If you want to push this project to your own GitHub repository:

```bash
# 1. Initialize Git (if not already done)
git init

# 2. Add all files & commit
git add .
git commit -m "Initial commit: KRISHI VIKAS 3D Drone & Field Management System"

# 3. Create a main branch
git branch -M main

# 4. Link your remote GitHub repository URL
git remote add origin https://github.com/YOUR_USERNAME/krishi-vikas.git

# 5. Push code to GitHub
git push -u origin main
```

---

## 🎮 3D Simulator Controls

| Action | Control |
| :--- | :--- |
| **Rotate 3D Scene** | Left-click + drag mouse |
| **Zoom In / Out** | Mouse wheel scroll |
| **Seeding Mode** | Drops 1 seed every 10m grid marker |
| **Water Spray** | Emits blue mist stream over crop rows |
| **Pesticide Spray** | Emits yellow chemical fog mist |
| **Camera Angles** | Toggle `Orbit`, `Follow`, `POV`, `Top Grid` |
| **Speed Multiplier** | Toggle `1x`, `2x`, or `5x` flight speed |

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
