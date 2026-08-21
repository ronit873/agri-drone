# 🌾 KRISHI VIKAS — Autonomous Agricultural Drone & 3D Field Management Platform (GCS v2.0)

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.168.0-black?logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.13-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-10B981.svg)](LICENSE)
[![Status](https://img.shields.io/badge/GCS_v2.0-Completed-10B981.svg)](#-project-overview)

---

## 📌 1. Project Overview

**KRISHI VIKAS** is an integrated precision-agriculture platform engineered to modernize crop care and farm robotics through autonomous agricultural drones, GPS mission planning, computer vision, and interactive 3D WebGL simulation. 

The `ronit873/KRISHI-VIKASH` repository contains the web-based **Ground Control Station (GCS v2.0)** featuring multi-point field polygon definition, agronomic Boustrophedon waypoint generation, YOLOv8 computer vision leaf disease scanning, WebSerial MAVLink hardware integration, and a Three.js 3D drone simulator with both Autonomous GPS and Manual RC Joystick flight controls.

---

## 🛰️ 2. Core Implemented Features (GCS v2.0)

### 🎨 A. Ground Control Station Interface & Day/Night Mode
* **Unified Aviation Aesthetic**: Tactical dark/light Ground Control Station styling (`slate-950` / `slate-50`).
* **Day & Night Mode Switcher**: Instant theme toggle (☀️ **Day Mode** / 🌙 **Night Mode**) with persistent local storage and dynamic 3D WebGL sky/terrain adaptation.

### 🕹️ B. Autonomous GPS & Manual RC Flight Modes
* **Dual Control Engine**: Switch seamlessly between:
  * 🤖 **Autonomous GPS Mode**: Boustrophedon lawnmower swaths with crop row & plant spacing rules.
  * 🕹️ **Manual RC Pilot Mode**: Manual flight controls using **WASD / Arrow Keys** (Pitch/Roll), **Q/E** (Yaw), **R/F** (Throttle Altitude), and an interactive on-screen **D-Pad Joystick Overlay**.

### 🤖 C. AI Vision & YOLOv8 Plant Disease Detector
* **YOLOv8 Edge Object Detection**: Live bounding boxes for *Yellow Rust*, *Bacterial Leaf Blight*, *Leaf Chlorosis*, and *Healthy Canopy*.
* **Live Hardware Camera Input**: Stream real-world video directly from connected laptop or USB agronomic inspect cameras via `navigator.mediaDevices.getUserMedia()`.
* **Direct Targeted Spray Mission**: Transfer AI disease treatment prescriptions directly into drone waypoint flight plans.

### 📡 D. Real-World Physical Hardware Suite
* **QGroundControl Export (`.waypoints` / WPL 110)**: Export standard MAVLink WPL 110 files ready for direct loading into Pixhawk 4, Cube Orange, or ArduPilot flight controllers.
* **WebSerial MAVLink Telemetry Bridge**: Connect to 915MHz / 433MHz SiK Telemetry Radios or USB COM ports @ 57600/115200 baud.
* **Real Device GPS Geolocation**: Map farmer field boundaries using real device GPS hardware (`navigator.geolocation.getCurrentPosition()`).

### 🌾 E. Indian Crop Agronomy Database & Field Polygon Editor
* **Geodesic Shoelace Math**: Calculate real field acreage from WGS-84 coordinate vertices.
* **Crop Agronomics**: Pre-configured parameters for Wheat, Rice, Cotton, Sugarcane, Corn, Soybean, Pulses, and Mustard.

---

## 🛠️ 3. Quick Start & Local Setup

### Prerequisites
* Node.js (v18.0.0 or higher)
* npm (v9.0.0 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/ronit873/KRISHI-VIKASH.git

# Navigate to project directory
cd KRISHI-VIKASH

# Install dependencies
npm install

# Start Vite local dev server
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

---

## 📜 4. License
Distributed under the MIT License. See `LICENSE` for more information.
