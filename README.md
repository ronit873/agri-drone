# 🌾 KRISHI VIKAS — Autonomous Agricultural Drone & 3D Field Management Platform

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.168.0-black?logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.13-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Lucide Icons](https://img.shields.io/badge/Lucide_React-0.446.0-F97316?logo=lucide)](https://lucide.dev/)
[![License](https://img.shields.io/badge/License-MIT-10B981.svg)](LICENSE)
[![Phase](https://img.shields.io/badge/Phase_I-Completed-10B981.svg)](#-phase-i--real-field-definition--gps-mission-planner)

---

## 📌 1. Project Overview

**KRISHI VIKAS** is an integrated precision-agriculture platform being engineered to modernize crop care and farm management through autonomous agricultural drones, GPS mission planning, computer vision, and interactive 3D WebGL simulation. 

The `ronit873/agri-drone` repository provides the web-based **Field Management, GPS Mission Planner, and 3D Drone Simulator** component of the overarching KRISHI VIKAS project.

> ⚠️ **Important Project Clarification**: The project is being engineered **incrementally, phase by phase**. While Phase I (Real Field Definition & GPS Mission Planning) is fully implemented in software alongside an interactive 3D WebGL simulation engine, physical flight hardware control, computer vision inference, and real telemetry are planned for subsequent phases.

---

## 🎯 2. Project Vision

KRISHI VIKAS aims to become a full-stack, autonomous agricultural intelligence and execution platform that seamlessly bridges digital agronomy and field robotics:

```text
┌───────────────────────────────────────────────────────────────────────────┐
│                           KRISHI VIKAS PLATFORM                           │
├─────────────────────────────┬─────────────────────────────────────────────┤
│   DIGITAL AGRONOMY LAYER    │          ROBOTIC EXECUTION LAYER            │
│  • Field Boundary Polygons  │  • Autonomous GPS Mission Execution         │
│  • Crop Spacing Database    │  • Variable-Rate Seeding Dispersal          │
│  • Boustrophedon Swaths     │  • Targeted Water Mist Irrigation           │
│  • QGC / JSON Flight Plans  │  • Zero-Exposure Pesticide Micro-Misting   │
│  • Farmer Cockpit HUD       │  • Multispectral NDVI & AI Crop Health      │
└─────────────────────────────┴─────────────────────────────────────────────┘
```

---

## 📊 3. Current Development Status

* **Phase 0 — Project Vision & Planning**: ✅ **COMPLETED**
* **Phase I — Real Field Definition & GPS Mission Planner**: ✅ **COMPLETED**
* **Phase II — Computer Vision & AI (Dataset & YOLO Pipeline)**: 🟡 **NEXT / IN PROGRESS**

```text
[ Phase 0: Planned ] ──> [ Phase 1: Completed ] ──> [ Phase 2: In Progress ] ──> [ Phases 3-13: Planned ]
```

---

## 🛰️ 4. Phase I — Real Field Definition & GPS Mission Planner

Phase I establishes the foundational geospatial and mission-planning engine. It transforms hardcoded demo routes into a dynamic, crop-aware flight planning system driven by authentic GPS field boundaries.

### Core Implemented Capabilities:

```text
Farmer Dashboard
      ↓
Create / Select Field
      ↓
Define Real GPS Polygon Boundary (WGS-84)
      ↓
Geospatial Field Validation
      ↓
Select Crop Species (Wheat, Rice, Corn, Cotton, etc.)
      ↓
Load Agronomic Parameters (Row / Plant Spacing, Altitude, Speed)
      ↓
Generate Deterministic GPS Waypoints (Boustrophedon Pattern)
      ↓
2D Interactive Mission Preview & CSV/JSON Export
      ↓
Convert GPS Coordinates to Local 3D Cartesian Metric Space
      ↓
Simulate Flight & Seeding in Three.js WebGL Engine
```

---

## 🛠️ 5. Implemented Features

### A. Real Field Boundaries & Vertex Editor
* **Multi-Point GPS Polygons**: Field boundaries stored as ordered WGS-84 coordinate arrays:
  ```json
  [
    { "latitude": 30.733600, "longitude": 76.779100 },
    { "latitude": 30.733600, "longitude": 76.780300 },
    { "latitude": 30.732600, "longitude": 76.780300 },
    { "latitude": 30.732600, "longitude": 76.779100 }
  ]
  ```
* **Interactive Vertex Editor**: Add, edit, and remove GPS coordinates with real-time geodesic acreage calculations.
* **Pre-Loaded Indian Agricultural Parcels**:
  * *Ramesh Farm — Wheat Plot A* (Ludhiana, Punjab / 30.7333° N, 76.7794° E)
  * *Green Acres Paddy Field* (Karnal, Haryana / 29.6857° N, 76.9905° E)
  * *Suraj Kisan Cotton Plantation* (Rajkot, Gujarat / 22.3039° N, 70.8022° E)
  * *Godavari Sugarcane Estate* (Kolhapur, Maharashtra / 16.7050° N, 74.2433° E)

### B. Geospatial Validation Engine (`fieldValidator.js`)
* **Minimum Point Count**: Enforces $\ge 3$ vertices.
* **Coordinate Bounds**: Validates Latitude $\in [-90^\circ, +90^\circ]$ and Longitude $\in [-180^\circ, +180^\circ]$.
* **Topological Checks**: Detects duplicate consecutive vertices, out-of-range inputs, and collinear vertices (zero surface area).
* **Mission Blocker**: Prevents waypoint generation if validation fails and displays clear error messages.

### C. Geospatial Processing (`geoUtils.js`)
* **Geodesic Surface Area**: Computes surface area in square meters, acres, and hectares via Transverse Equirectangular projection and the Shoelace formula.
* **Centroid Datum**: Calculates the polygon's center of mass as the local coordinate origin.
* **Point-in-Polygon (PIP)**: Ray-casting algorithm to test local points against complex polygon boundaries.

### D. Centralized Crop Agronomic Database (`cropConfig.js`)
Centralizes initial agronomic engineering parameters across 8 agricultural crops:

| Crop | Category | Row Spacing ($m$) | Plant Spacing ($m$) | Seed Rate ($kg/acre$) | Flight Alt ($m$) | Swath Width ($m$) | Water Rate ($L/acre$) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Wheat (*Gehun*)** | Cereal / Rabi | 0.22 | 0.10 | 40 | 3.5 | 4.0 | 250 |
| **Rice / Paddy (*Dhan*)** | Cereal / Kharif | 0.20 | 0.15 | 15 | 3.0 | 3.5 | 400 |
| **Corn / Maize (*Makka*)** | Cereal / Kharif & Rabi | 0.60 | 0.20 | 8 | 4.5 | 4.5 | 200 |
| **Cotton (*Kapas*)** | Cash Crop / Kharif | 0.90 | 0.45 | 2.5 | 4.0 | 4.5 | 180 |
| **Sugarcane (*Ganna*)** | Cash Crop / Annual | 1.20 | 0.30 | 300 | 5.0 | 5.0 | 500 |
| **Mustard (*Sarson*)** | Oilseed / Rabi | 0.30 | 0.10 | 2.0 | 3.5 | 4.0 | 120 |
| **Potato (*Aloo*)** | Tuber / Rabi | 0.60 | 0.20 | 1200 | 3.0 | 3.6 | 220 |
| **Tomato (*Tamatar*)** | Horticulture / Multi | 0.75 | 0.45 | 0.15 | 3.2 | 3.8 | 280 |

### E. GPS Waypoint Generation (`waypointGenerator.js`)
* Generates systematic **Boustrophedon (lawnmower)** coverage tracks strictly constrained inside the field boundary.
* Produces deterministic waypoint records with:
  * `sequence`: 1-based sequential index
  * `latitude` & `longitude`: WGS-84 GPS coordinates
  * `altitude`: Altitude above soil in meters
  * `speed`: Operational flight velocity ($m/s$)
  * `action`: `TAKEOFF`, `START_SEEDING`, `STOP_SEEDING`, `START_SPRAY`, `STOP_SPRAY`, `SURVEY_PASS`, `RTL`
  * `localX`, `localY`, `localZ`: Transformed Cartesian metric coordinates for 3D rendering

### F. 2D Mission Planner & Exporters (`MissionPlanner.jsx`, `missionPlanner.js`)
* **Interactive Canvas**: Displays satellite grid, polygon perimeter, swath lines, waypoint nodes with labels, and seed drop locations.
* **Mission Preview Metrics**: Real-time computation of total survey distance ($m/km$), estimated flight duration ($min$), waypoint count, estimated consumables (seeds, water, pesticide), and battery drain.
* **Standard Mission Export**:
  * **CSV**: QGroundControl & Mission Planner compatible waypoint format.
  * **JSON**: Structured mission dataset with metadata, datum, bounding box, and waypoints.
* **1-Click 3D Deployment**: Deploys the generated mission directly to the 3D simulator.

### G. Connected 3D Simulation (`DroneSimulator.jsx`)
* Procedural 3D Quadcopter model with spinning rotor blades, carbon-fiber arms, navigation LEDs, LiDAR cone, and triple payload bay (seeds, water, pesticide).
* Dynamically renders the field's GPS polygon perimeter in 3D space with yellow corner beacons.
* Drone autonomously navigates through the generated GPS mission waypoints in 3D.
* **Dynamic Seeding**: Generates 3D sprout meshes at ground level according to the crop's exact plant spacing interval.
* **Multi-Camera Views**: 3D Orbit, 3rd-Person Follow, Drone Cockpit POV, and Top-Down Grid.
* **Particle Spray Systems**: Water irrigation mist and pesticide chemical fog simulation.

### H. Local Persistence
* All field additions and custom polygon configurations persist across page refreshes using `localStorage`.

---

## ⚖️ 6. Real vs. Configurable vs. Simulated vs. Future

| Subsystem / Feature | Current Classification | Description |
| :--- | :--- | :--- |
| **GPS Polygon Boundaries** | ✅ **Real / Configurable** | User-defined or pre-loaded WGS-84 latitude/longitude polygon coordinates. |
| **Geodesic Field Area** | ✅ **Implemented** | Geodesic acreage calculated via local Shoelace projection. |
| **Geospatial Validation** | ✅ **Implemented** | Boundary closure, vertex count, and coordinate validation algorithms. |
| **Crop Spacing Engine** | ✅ **Configurable** | Agronomic parameters (row/plant spacing, flight altitude) per crop species. |
| **GPS Waypoint Generator** | ✅ **Implemented** | Deterministic Boustrophedon survey swath & waypoint generation. |
| **Mission Export (CSV/JSON)** | ✅ **Implemented** | Exporting flight paths to QGroundControl CSV and structured JSON. |
| **3D Drone Flight** | 🎮 **Simulated** | Three.js WebGL physics & path-following simulation. |
| **Seed Drop / Sprouting** | 🎮 **Simulated** | Visual 3D sprout generation at calculated crop intervals. |
| **Water / Pesticide Spray** | 🎮 **Simulated** | Real-time particle stream and fog visualization. |
| **Telemetry HUD** | 🎮 **Simulated** | Simulated battery drain, motor RPMs, ESC status, and payload depletion. |
| **Computer Vision (YOLO)** | 🟡 **Phase II In Progress** | Dataset verification, preprocessing, and training pipeline. |
| **Drone Camera Stream** | ⏳ **Future Phase** | Real video/camera feed integration. |
| **MAVLink / ROS2 Protocol** | ⏳ **Future Phase** | Autopilot telemetry and flight controller communication. |
| **Physical Hardware Control**| ⏳ **Future Phase** | Real drone airframe, motors, GPS antenna, and spray nozzles. |

---

## 📐 7. Coordinate System & Conversion Pipeline

The application maps spherical GPS coordinates to Three.js Cartesian space:

```text
Real GPS (WGS-84: Latitude, Longitude in degrees)
      ↓  (Transverse Equirectangular projection relative to polygon centroid datum)
Local Metric Cartesian Coordinates (X: Easting in meters, Z: Northing in meters)
      ↓  (Mapped to 3D simulation coordinate frame)
Three.js World Coordinates (X: East, Y: Flight Altitude Up, Z: South)
```

Mathematical transformations:
$$\Delta \text{Lat} = \text{Lat} - \text{Lat}_{\text{datum}}, \quad \Delta \text{Lon} = \text{Lon} - \text{Lon}_{\text{datum}}$$
$$X = \Delta \text{Lon} \cdot R_{\text{earth}} \cdot \cos(\text{Lat}_{\text{datum}})$$
$$Z = -\Delta \text{Lat} \cdot R_{\text{earth}}$$

---

## 🔬 8. Phase II — Computer Vision & AI (Immediate Focus)

The immediate next development phase focuses on building the **Computer Vision & AI Intelligence Layer**.

### Immediate Workflow Sequence:
```text
Dataset Verification ──> Dataset Cleaning ──> Annotation Validation ──> Dataset Preparation ──> YOLO Training ──> Model Evaluation ──> Optimization ──> AI Inference Pipeline
```

### Pre-Training Dataset Quality Verification:
Prior to initiating YOLO model training, the agricultural dataset must undergo rigorous quality assurance:
1. **Corrupt & Unreadable Images**: Verification of image file headers and bitstream integrity.
2. **Missing Images & Orphaned Labels**: Detection of un-annotated images and label files without corresponding images.
3. **Annotation Format & Boundary Validation**: Verification of normalized bounding box format (`class_id center_x center_y width height` in $[0.0, 1.0]$).
4. **Incorrect / Out-of-Bounds Class IDs**: Validation of class indices against the dataset schema (crop health, weeds, disease symptoms).
5. **Duplicate Images & Overlapping Samples**: Identification of perceptual duplicate frames to prevent data bias.
6. **Class Distribution & Imbalance**: Analysis of sample distributions across disease and weed classes.
7. **Train / Validation / Test Leakage**: Strict partition verification ensuring no spatial overlap between training and validation splits.
8. **YOLO Directory Structure**: Conformance to `images/train`, `images/val`, `labels/train`, `labels/val`.

---

## 🗺️ 9. Complete Development Roadmap

| Phase | Phase Name | Status | Key Deliverables |
| :---: | :--- | :---: | :--- |
| **0** | **Project Vision & Architecture** | ✅ Completed | Overall architecture, technical requirements, and repository setup. |
| **1** | **Real Field Definition & GPS Mission Planner** | ✅ Completed | WGS-84 polygon boundaries, crop agronomics, Boustrophedon waypoints, 2D preview, CSV/JSON export, connected 3D WebGL simulator. |
| **2** | **Computer Vision & AI** | 🟡 In Progress | Dataset verification, cleaning, YOLO model training, crop disease & weed detection. |
| **3** | **Drone Camera & AI Stream Integration** | ⏳ Planned | Live video ingest, bounding box overlay, real-time visual frame processing. |
| **4** | **GPS & Autonomous Navigation** | ⏳ Planned | Waypoint upload to autopilot, geofencing, dynamic obstacle avoidance. |
| **5** | **Real Telemetry / MAVLink / ROS2** | ⏳ Planned | Bidirectional communication with PX4 / ArduPilot flight controllers via MAVLink. |
| **6** | **Crop Monitoring & Disease Diagnostics** | ⏳ Planned | Multispectral NDVI mapping, localized infection severity scoring. |
| **7** | **Precision Seed Placement** | ⏳ Planned | Actuated seed metering mechanism, synchronized ground speed dispersal. |
| **8** | **Precision Irrigation Control** | ⏳ Planned | Soil-moisture-guided variable rate misting. |
| **9** | **Targeted Pesticide Spraying** | ⏳ Planned | AI-guided spot spraying directly over detected weed/pest clusters. |
| **10** | **AI Decision & Automation Layer** | ⏳ Planned | Prescriptive agronomy analytics and automated flight mission dispatch. |
| **11** | **Complete System Integration** | ⏳ Planned | Unified hardware-software interface across drone, ground station, and cloud. |
| **12** | **Testing & Real-World Validation** | ⏳ Planned | Farm field trials, spray drift analysis, and germination yield validation. |
| **13** | **Optimization & Demonstration** | ⏳ Planned | Full autonomous demonstration, latency optimization, and final deployment. |

---

## 🏗️ 10. Target System Architecture (Future Vision)

```text
                               ┌────────────────────────┐
                               │   FARMER / OPERATOR    │
                               └───────────┬────────────┘
                                           │
                                           ▼
                               ┌────────────────────────┐
                               │ KRISHI VIKAS DASHBOARD │
                               └───────────┬────────────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
             ┌─────────────────────┐               ┌─────────────────────┐
             │   FIELD MANAGEMENT  │               │   MISSION PLANNER   │
             │   (GPS Boundaries)  │               │ (Boustrophedon WPs) │
             └──────────┬──────────┘               └──────────┬──────────┘
                        │                                     │
                        └──────────────────┬──────────────────┘
                                           │ (QGC CSV / MAVLink)
                                           ▼
                               ┌────────────────────────┐
                               │    AUTONOMOUS DRONE    │
                               │  (PX4 / ArduPilot FC)  │
                               └───────────┬────────────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
             ┌─────────────────────┐               ┌─────────────────────┐
             │  4K / MULTISPECTRAL │               │   ACTUATED PAYLOAD  │
             │     CAMERA POD      │               │ (Seeds/Water/Spray) │
             └──────────┬──────────┘               └──────────┬──────────┘
                        │                                     ▲
                        ▼                                     │ (Trigger)
             ┌─────────────────────┐                          │
             │   ONBOARD AI (YOLO) │ ─────────────────────────┘
             │  Disease/Weed/Pest  │
             └──────────┬──────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │ GPS-TAGGED ANALYTICS│ ──> Back to Farmer Dashboard
             └─────────────────────┘
```

---

## 💻 11. Technology Stack

### Currently Implemented in Repository:
* **Frontend Framework**: [React 18.3.1](https://react.dev/)
* **Build Tool**: [Vite 5.4.2](https://vitejs.dev/)
* **3D Simulation Engine**: [Three.js 0.168.0](https://threejs.org/) (WebGL, custom meshes, particle systems)
* **Styling**: [Tailwind CSS 3.4.13](https://tailwindcss.com/) with Glassmorphism UI
* **Icons**: [Lucide React 0.446.0](https://lucide.dev/)
* **Geospatial Math**: Custom Transverse Equirectangular & Shoelace Geodesic Projection

### Planned for Subsequent Phases:
* **Computer Vision**: YOLOv8 / YOLOv11 (PyTorch, ONNX Runtime)
* **Drone Robotics**: ROS2, MAVLink, MAVSDK
* **Flight Controller**: PX4 Autopilot / ArduPilot
* **Hardware Sensors**: RTK-GPS, Downward LiDAR, Multispectral Cameras

---

## 📁 12. Project Architecture

```text
agri-drone/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md                           <-- Project Documentation
├── .gitignore
└── src/
    ├── main.jsx                        <-- Application Entry Point
    ├── index.css                       <-- Global Styles & Tailwind Configuration
    ├── App.jsx                         <-- Root State, Field Data & Tab Routing
    ├── data/
    │   └── cropConfig.js               <-- Centralized Agronomic Database (8 Crops)
    ├── utils/
    │   ├── geoUtils.js                 <-- Geodetic GPS & Coordinate Transformations
    │   ├── fieldValidator.js           <-- Boundary Polygon & GPS Vertex Validator
    │   ├── waypointGenerator.js        <-- Boustrophedon Coverage Waypoint Generator
    │   └── missionPlanner.js           <-- Mission Planner Service & CSV/JSON Exporters
    └── components/
        ├── Navbar.jsx                  <-- Top Navigation & Telemetry Quick Bar
        ├── MissionPlanner.jsx          <-- 2D Canvas GPS Mission Planner & Preview
        ├── FieldManagement.jsx         <-- Field Polygon Editor & Khet Dashboard
        ├── TelemetryHUD.jsx            <-- Simulated Cockpit Diagnostics & Payload Gauges
        ├── AnalyticsDashboard.jsx      <-- Farm Efficiency & Yield Comparisons
        ├── FarmerGuide.jsx             <-- Multilingual Kisan Nirdeshika Guide
        └── 3d/
            └── DroneSimulator.jsx      <-- Three.js 3D WebGL Simulation Engine
```

---

## 🚀 13. Setup & Installation

### Prerequisites
* **Node.js (v18.0 or higher)**
* **npm (v9.0 or higher)**

### Step-by-Step Installation:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ronit873/agri-drone.git
   cd agri-drone
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your web browser.

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

---

## ⚠️ 14. Current Limitations

1. **Simulation Platform**: The current application is a **GPS mission-planning and 3D simulation platform**; physical drone hardware control is not yet implemented.
2. **Terrain Elevation**: Assumes a flat elevation datum ($Z = 0\text{ m}$) across the field parcel.
3. **Map Tile Provider**: Boundary definitions currently use clean coordinate inputs and procedural 2D canvas visualization rather than an external paid map SDK.
4. **AI Inference**: Computer vision models for disease and weed detection are in development (Phase II) and not yet integrated into the live flight loop.

---

## 📜 15. Repository & Phase I Commit Information

* **Repository**: `ronit873/agri-drone`
* **Phase I Feature Branch**: `feature/phase-1-field-mission-planner`
* **Phase I Commit**: `4b26f98`
* **Commit Message**: `feat(phase-1): Implement Real Field Definition & GPS Mission Planner with Crop Spacing & 3D Simulation`
* **Pull Request**: [#1](https://github.com/ronit873/agri-drone/pull/1)

---

## 🎯 16. Immediate Next Step

Proceed to **Phase II — Computer Vision & AI**:
1. Execute dataset verification and cleaning checks.
2. Validate bounding box annotations for crop diseases and weeds.
3. Prepare YOLO dataset splits and train agricultural detection models.

---

## 🌾 17. Long-Term Goal

Deliver a fully validated, production-ready autonomous agricultural drone system capable of reducing chemical usage by 60%, saving 45% irrigation water, and boosting crop yields across Indian farmlands.

---

## 📄 18. License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
