import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Camera, 
  Compass, 
  Zap, 
  Droplets, 
  Sprout, 
  ShieldAlert, 
  Eye, 
  Navigation,
  Sparkles,
  Layers
} from 'lucide-react';

export default function DroneSimulator({ droneState, setDroneState, activeField }) {
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [cameraMode, setCameraMode] = useState('orbit'); // 'orbit', 'follow', 'pov', 'top'
  const [opMode, setOpMode] = useState('seeding'); // 'seeding', 'watering', 'pesticide', 'inspect'
  const [logs, setLogs] = useState([
    'System Initialized: KRISHI VIKAS Quadcopter Drone Ready',
    'GPS Lock established: 16 Satellites connected',
    '10-Meter Precision Seeding grid mapped.'
  ]);

  // Scene references
  const sceneRef = useRef(null);
  const droneGroupRef = useRef(null);
  const rotorsRef = useRef([]);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const waterParticlesRef = useRef(null);
  const pesticideParticlesRef = useRef(null);
  const seedParticlesRef = useRef([]);
  const plantsGroupRef = useRef(null);
  const gridBeaconsRef = useRef([]);

  // Animation state references
  const flightStateRef = useRef({
    currentWaypointIndex: 0,
    distanceTraveled: 0,
    lastSeedDistance: 0,
    targetPos: new THREE.Vector3(-25, 3.5, -25),
    seedsDropped: 0,
    plants: [], // array of positions
    opMode: 'seeding',
    isPlaying: true,
    speedMultiplier: 1,
    cameraMode: 'orbit'
  });

  // Keep ref synchronized with React state
  useEffect(() => {
    flightStateRef.current.opMode = opMode;
    flightStateRef.current.isPlaying = isPlaying;
    flightStateRef.current.speedMultiplier = speedMultiplier;
    flightStateRef.current.cameraMode = cameraMode;
  }, [opMode, isPlaying, speedMultiplier, cameraMode]);

  // Define 10-meter grid waypoints across the field (-25 to +25 grid, step 10 meters)
  const waypoints = useRef([
    new THREE.Vector3(-20, 3.5, -20),
    new THREE.Vector3(-10, 3.5, -20),
    new THREE.Vector3(0, 3.5, -20),
    new THREE.Vector3(10, 3.5, -20),
    new THREE.Vector3(20, 3.5, -20),
    
    new THREE.Vector3(20, 3.5, -10),
    new THREE.Vector3(10, 3.5, -10),
    new THREE.Vector3(0, 3.5, -10),
    new THREE.Vector3(-10, 3.5, -10),
    new THREE.Vector3(-20, 3.5, -10),

    new THREE.Vector3(-20, 3.5, 0),
    new THREE.Vector3(-10, 3.5, 0),
    new THREE.Vector3(0, 3.5, 0),
    new THREE.Vector3(10, 3.5, 0),
    new THREE.Vector3(20, 3.5, 0),

    new THREE.Vector3(20, 3.5, 10),
    new THREE.Vector3(10, 3.5, 10),
    new THREE.Vector3(0, 3.5, 10),
    new THREE.Vector3(-10, 3.5, 10),
    new THREE.Vector3(-20, 3.5, 10),

    new THREE.Vector3(-20, 3.5, 20),
    new THREE.Vector3(-10, 3.5, 20),
    new THREE.Vector3(0, 3.5, 20),
    new THREE.Vector3(10, 3.5, 20),
    new THREE.Vector3(20, 3.5, 20),
  ]).current;

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev.slice(0, 7)]);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a1120);
    scene.fog = new THREE.FogExp2(0x0a1120, 0.015);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 25, 45);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5ea, 1.4);
    sunLight.position.set(40, 60, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 150;
    const d = 35;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x2d4a20, 0.4);
    scene.add(hemiLight);

    // 5. Soil Terrain & Field Bed
    const terrainGeo = new THREE.PlaneGeometry(70, 70, 70, 70);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x291f16,
      roughness: 0.9,
      metalness: 0.1,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // 10-meter Grid lines overlay
    const gridHelper = new THREE.GridHelper(60, 6, 0x10b981, 0x334155); // 6 divisions = 10m each
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // Add 10m marker flags / beacons around the field
    const beaconsGroup = new THREE.Group();
    for (let x = -20; x <= 20; x += 10) {
      for (let z = -20; z <= 20; z += 10) {
        // Flag pole
        const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(x, 0.6, z);
        pole.castShadow = true;

        // Glowing 10m indicator sphere top
        const bulbGeo = new THREE.SphereGeometry(0.2, 12, 12);
        const bulbMat = new THREE.MeshStandardMaterial({ 
          color: 0x10b981, 
          emissive: 0x059669, 
          emissiveIntensity: 0.6 
        });
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(x, 1.3, z);

        beaconsGroup.add(pole);
        beaconsGroup.add(bulb);
      }
    }
    scene.add(beaconsGroup);
    gridBeaconsRef.current = beaconsGroup;

    // Plants container
    const plantsGroup = new THREE.Group();
    scene.add(plantsGroup);
    plantsGroupRef.current = plantsGroup;

    // 6. Custom 3D Quadcopter Drone Model
    const droneGroup = new THREE.Group();
    droneGroup.position.set(-20, 3.5, -20);
    scene.add(droneGroup);
    droneGroupRef.current = droneGroup;

    // Central Chassis Body
    const bodyGeo = new THREE.BoxGeometry(1.6, 0.4, 1.6);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    droneGroup.add(body);

    // Top Cover Shell (Carbon fiber look)
    const topShellGeo = new THREE.CylinderGeometry(0.7, 0.9, 0.3, 8);
    const topShellMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.1 });
    const topShell = new THREE.Mesh(topShellGeo, topShellMat);
    topShell.position.y = 0.3;
    topShell.castShadow = true;
    droneGroup.add(topShell);

    // KRISHI VIKAS Payload Tanks:
    // 1) Water Tank (Center blue)
    const waterTankGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.5, 12);
    const waterTankMat = new THREE.MeshPhysicalMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.8,
      roughness: 0.1,
      transmission: 0.6
    });
    const waterTank = new THREE.Mesh(waterTankGeo, waterTankMat);
    waterTank.position.set(0, -0.4, -0.2);
    droneGroup.add(waterTank);

    // 2) Pesticide Container (Yellow back)
    const pesticideGeo = new THREE.BoxGeometry(0.5, 0.4, 0.4);
    const pesticideMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.3, roughness: 0.4 });
    const pesticideTank = new THREE.Mesh(pesticideGeo, pesticideMat);
    pesticideTank.position.set(0, -0.35, 0.4);
    droneGroup.add(pesticideTank);

    // 3) Seed Dropper Dispenser Nozzle (Bottom center tip)
    const dropperGeo = new THREE.ConeGeometry(0.18, 0.4, 8);
    const dropperMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.9 });
    const dropper = new THREE.Mesh(dropperGeo, dropperMat);
    dropper.rotation.x = Math.PI;
    dropper.position.set(0, -0.6, 0);
    droneGroup.add(dropper);

    // Downward Laser Scanning Cone
    const laserGeo = new THREE.ConeGeometry(1.8, 3.5, 16, 1, true);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    const laserCone = new THREE.Mesh(laserGeo, laserMat);
    laserCone.position.set(0, -1.75, 0);
    droneGroup.add(laserCone);

    // Motor Arms & Rotors
    const rotorArray = [];
    const armPositions = [
      { x: 1.5, z: 1.5 },
      { x: -1.5, z: 1.5 },
      { x: 1.5, z: -1.5 },
      { x: -1.5, z: -1.5 }
    ];

    armPositions.forEach((pos, idx) => {
      // Carbon Arm Tube
      const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.2, 8);
      const armMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 });
      const arm = new THREE.Mesh(armGeo, armMat);
      arm.rotation.z = Math.PI / 2;
      arm.rotation.y = idx % 2 === 0 ? Math.PI / 4 : -Math.PI / 4;
      arm.position.set(pos.x / 2, 0.05, pos.z / 2);
      droneGroup.add(arm);

      // Motor Pod
      const motorGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 12);
      const motorMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9 });
      const motor = new THREE.Mesh(motorGeo, motorMat);
      motor.position.set(pos.x, 0.15, pos.z);
      droneGroup.add(motor);

      // Rotor Blades
      const rotorGroup = new THREE.Group();
      rotorGroup.position.set(pos.x, 0.32, pos.z);

      const bladeGeo = new THREE.BoxGeometry(1.6, 0.02, 0.12);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      const blade1 = new THREE.Mesh(bladeGeo, bladeMat);
      const blade2 = new THREE.Mesh(bladeGeo, bladeMat);
      blade2.rotation.y = Math.PI / 2;
      rotorGroup.add(blade1);
      rotorGroup.add(blade2);

      droneGroup.add(rotorGroup);
      rotorArray.push(rotorGroup);

      // Navigation LED Light on each arm
      const ledGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const ledColor = idx < 2 ? 0x10b981 : 0xef4444; // Front Green, Rear Red
      const ledMat = new THREE.MeshBasicMaterial({ color: ledColor });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(pos.x * 1.1, 0.1, pos.z * 1.1);
      droneGroup.add(led);
    });

    rotorsRef.current = rotorArray;

    // 7. Particle Systems for Water Mist & Pesticide Fog
    // Water Mist Spray Particles
    const waterPartCount = 150;
    const waterGeo = new THREE.BufferGeometry();
    const waterPos = new Float32Array(waterPartCount * 3);
    for (let i = 0; i < waterPartCount; i++) {
      waterPos[i * 3] = (Math.random() - 0.5) * 0.8;
      waterPos[i * 3 + 1] = -Math.random() * 3.0;
      waterPos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    waterGeo.setAttribute('position', new THREE.BufferAttribute(waterPos, 3));
    const waterMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.15,
      transparent: true,
      opacity: 0.7
    });
    const waterParticles = new THREE.Points(waterGeo, waterMat);
    waterParticles.visible = false;
    droneGroup.add(waterParticles);
    waterParticlesRef.current = waterParticles;

    // Pesticide Spray Fog Particles
    const pestPartCount = 150;
    const pestGeo = new THREE.BufferGeometry();
    const pestPos = new Float32Array(pestPartCount * 3);
    for (let i = 0; i < pestPartCount; i++) {
      pestPos[i * 3] = (Math.random() - 0.5) * 1.0;
      pestPos[i * 3 + 1] = -Math.random() * 3.0;
      pestPos[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
    }
    pestGeo.setAttribute('position', new THREE.BufferAttribute(pestPos, 3));
    const pestMat = new THREE.PointsMaterial({
      color: 0xfacc15,
      size: 0.2,
      transparent: true,
      opacity: 0.6
    });
    const pesticideParticles = new THREE.Points(pestGeo, pestMat);
    pesticideParticles.visible = false;
    droneGroup.add(pesticideParticles);
    pesticideParticlesRef.current = pesticideParticles;

    // 8. Orbit Controls (Simple mouse drag interaction)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraAngle = { polar: Math.PI / 4, azimuth: 0, distance: 45 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      cameraAngle.azimuth -= deltaX * 0.005;
      cameraAngle.polar = Math.max(0.1, Math.min(Math.PI / 2.2, cameraAngle.polar - deltaY * 0.005));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      cameraAngle.distance = Math.max(10, Math.min(90, cameraAngle.distance + e.deltaY * 0.03));
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElem.addEventListener('wheel', onWheel);

    // 9. Animation Render Loop
    let clock = new THREE.Clock();
    let animFrameId;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const st = flightStateRef.current;

      // Rotate rotor blades continuously
      rotorsRef.current.forEach(r => {
        r.rotation.y += st.isPlaying ? 0.4 * st.speedMultiplier : 0.05;
      });

      // Subtle drone hover wobble
      if (droneGroupRef.current) {
        const time = clock.getElapsedTime();
        droneGroupRef.current.position.y = 3.5 + Math.sin(time * 3) * 0.15;
      }

      // Update Spray visibility based on mode
      if (waterParticlesRef.current) {
        waterParticlesRef.current.visible = st.opMode === 'watering' && st.isPlaying;
        if (waterParticlesRef.current.visible) {
          const positions = waterParticlesRef.current.geometry.attributes.position.array;
          for (let i = 1; i < positions.length; i += 3) {
            positions[i] -= delta * 8;
            if (positions[i] < -3.4) positions[i] = 0;
          }
          waterParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
      }

      if (pesticideParticlesRef.current) {
        pesticideParticlesRef.current.visible = st.opMode === 'pesticide' && st.isPlaying;
        if (pesticideParticlesRef.current.visible) {
          const positions = pesticideParticlesRef.current.geometry.attributes.position.array;
          for (let i = 1; i < positions.length; i += 3) {
            positions[i] -= delta * 6;
            if (positions[i] < -3.4) positions[i] = 0;
          }
          pesticideParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
      }

      // Autonomous Flight along 10m Waypoints
      if (st.isPlaying && waypoints.length > 0) {
        const targetWP = waypoints[st.currentWaypointIndex];
        const dronePos = droneGroupRef.current.position;

        const dir = new THREE.Vector3().subVectors(targetWP, dronePos);
        const dist = dir.length();

        if (dist > 0.2) {
          dir.normalize();
          const speed = 4.0 * st.speedMultiplier * delta;
          droneGroupRef.current.position.addScaledVector(dir, speed);

          // Face direction of movement
          const targetAngle = Math.atan2(dir.x, dir.z);
          droneGroupRef.current.rotation.y = THREE.MathUtils.lerp(droneGroupRef.current.rotation.y, targetAngle, 0.1);

          // Distance tracking
          st.distanceTraveled += speed;

          // Check for 10-meter seed drop trigger
          if (st.opMode === 'seeding' && st.distanceTraveled - st.lastSeedDistance >= 10.0) {
            st.lastSeedDistance = st.distanceTraveled;
            st.seedsDropped += 1;

            // Spawn Crop plant at drone ground position
            const plantX = Math.round(dronePos.x / 10) * 10;
            const plantZ = Math.round(dronePos.z / 10) * 10;
            
            // Check if plant already exists at location
            const plantKey = `${plantX}_${plantZ}`;
            if (!st.plants.includes(plantKey)) {
              st.plants.push(plantKey);

              // 3D Plant Mesh (Sprout / Crop)
              const plantGroup = new THREE.Group();
              plantGroup.position.set(plantX, 0, plantZ);

              // Soil mound
              const moundGeo = new THREE.ConeGeometry(0.6, 0.25, 8);
              const moundMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });
              const mound = new THREE.Mesh(moundGeo, moundMat);
              mound.position.y = 0.1;
              plantGroup.add(mound);

              // Green Sprout Stem & Leaves
              const stemGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.6, 6);
              const stemMat = new THREE.MeshStandardMaterial({ color: 0x22c55e });
              const stem = new THREE.Mesh(stemGeo, stemMat);
              stem.position.y = 0.4;
              plantGroup.add(stem);

              const leafGeo = new THREE.SphereGeometry(0.25, 8, 8);
              leafGeo.scale(1.5, 0.3, 0.8);
              const leafMat = new THREE.MeshStandardMaterial({ color: 0x4ade80 });
              const leaf1 = new THREE.Mesh(leafGeo, leafMat);
              leaf1.position.set(0.15, 0.6, 0);
              leaf1.rotation.z = -0.4;
              const leaf2 = new THREE.Mesh(leafGeo, leafMat);
              leaf2.position.set(-0.15, 0.6, 0);
              leaf2.rotation.z = 0.4;
              plantGroup.add(leaf1);
              plantGroup.add(leaf2);

              plantsGroupRef.current.add(plantGroup);
            }

            // Sync with React parent telemetry
            setDroneState(prev => ({
              ...prev,
              seedsCount: prev.seedsCount + 1,
              seedsTank: Math.max(0, prev.seedsTank - 0.2),
              distanceCovered: Math.round(st.distanceTraveled),
              battery: Math.max(10, prev.battery - 0.1)
            }));
          }

          // Resource consumption for water / pesticide mode
          if (st.opMode === 'watering') {
            setDroneState(prev => ({
              ...prev,
              waterLevel: Math.max(0, prev.waterLevel - 0.05),
              battery: Math.max(10, prev.battery - 0.08)
            }));
          } else if (st.opMode === 'pesticide') {
            setDroneState(prev => ({
              ...prev,
              pesticideLevel: Math.max(0, prev.pesticideLevel - 0.04),
              battery: Math.max(10, prev.battery - 0.08)
            }));
          }

        } else {
          // Reached waypoint, advance to next
          st.currentWaypointIndex = (st.currentWaypointIndex + 1) % waypoints.length;
        }
      }

      // Camera Position Modes
      if (droneGroupRef.current && cameraRef.current) {
        const dPos = droneGroupRef.current.position;

        if (st.cameraMode === 'orbit') {
          camera.position.x = dPos.x + cameraAngle.distance * Math.sin(cameraAngle.polar) * Math.sin(cameraAngle.azimuth);
          camera.position.y = dPos.y + cameraAngle.distance * Math.cos(cameraAngle.polar);
          camera.position.z = dPos.z + cameraAngle.distance * Math.sin(cameraAngle.polar) * Math.cos(cameraAngle.azimuth);
          camera.lookAt(dPos);

        } else if (st.cameraMode === 'follow') {
          const backOffset = new THREE.Vector3(0, 4, 10).applyAxisAngle(new THREE.Vector3(0, 1, 0), droneGroupRef.current.rotation.y);
          camera.position.copy(dPos).add(backOffset);
          camera.lookAt(dPos.x, dPos.y + 1, dPos.z);

        } else if (st.cameraMode === 'pov') {
          const frontOffset = new THREE.Vector3(0, 0.4, -0.6).applyAxisAngle(new THREE.Vector3(0, 1, 0), droneGroupRef.current.rotation.y);
          camera.position.copy(dPos).add(frontOffset);
          const targetAhead = new THREE.Vector3(0, 0, -10).applyAxisAngle(new THREE.Vector3(0, 1, 0), droneGroupRef.current.rotation.y);
          camera.lookAt(dPos.clone().add(targetAhead));

        } else if (st.cameraMode === 'top') {
          camera.position.set(dPos.x, dPos.y + 35, dPos.z + 0.1);
          camera.lookAt(dPos);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Window resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('wheel', onWheel);
      if (renderer.domElement) container.removeChild(renderer.domElement);
    };
  }, []);

  const resetSimulation = () => {
    flightStateRef.current.currentWaypointIndex = 0;
    flightStateRef.current.distanceTraveled = 0;
    flightStateRef.current.lastSeedDistance = 0;
    flightStateRef.current.seedsDropped = 0;
    flightStateRef.current.plants = [];

    if (droneGroupRef.current) {
      droneGroupRef.current.position.set(-20, 3.5, -20);
      droneGroupRef.current.rotation.y = 0;
    }
    if (plantsGroupRef.current) {
      while (plantsGroupRef.current.children.length > 0) {
        plantsGroupRef.current.remove(plantsGroupRef.current.children[0]);
      }
    }
    setDroneState(prev => ({
      ...prev,
      seedsCount: 0,
      seedsTank: 100,
      waterLevel: 100,
      pesticideLevel: 100,
      battery: 100,
      distanceCovered: 0
    }));
    addLog('Simulation Reset: Drone returned to Waypoint 0 (0m). Tank refilled.');
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-slate-950">
      
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Title & Field Badge */}
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2 pointer-events-none">
        <div className="glass-panel px-4 py-2.5 rounded-xl border border-slate-800 flex items-center space-x-3 pointer-events-auto">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="text-xs text-slate-400 font-medium">Active Field</div>
            <div className="text-sm font-bold text-white flex items-center space-x-2">
              <span>{activeField.name}</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {activeField.location}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Mode Status Indicator */}
        <div className="glass-panel px-3 py-1.5 rounded-lg border border-slate-800 flex items-center space-x-2 text-xs pointer-events-auto">
          <span className="text-slate-400">Operation:</span>
          <span className="font-semibold text-emerald-400 capitalize flex items-center space-x-1">
            {opMode === 'seeding' && <Sprout className="w-3.5 h-3.5 text-emerald-400" />}
            {opMode === 'watering' && <Droplets className="w-3.5 h-3.5 text-blue-400" />}
            {opMode === 'pesticide' && <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />}
            {opMode === 'inspect' && <Eye className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{opMode} (10m Precision Grid)</span>
          </span>
        </div>
      </div>

      {/* Top Right Controls Overlay: Camera & Operations Selector */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end space-y-3">
        
        {/* Operations Selector Card */}
        <div className="glass-panel p-2 rounded-xl border border-slate-800 flex flex-col space-y-1 w-52">
          <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
            Flight Operation
          </div>

          <button
            onClick={() => { setOpMode('seeding'); addLog('Switched to 10m Seeding Mode'); }}
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              opMode === 'seeding'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Seeding (Every 10m)</span>
          </button>

          <button
            onClick={() => { setOpMode('watering'); addLog('Switched to Water Irrigation Mist Mode'); }}
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              opMode === 'watering'
                ? 'bg-blue-500 text-white font-bold shadow-md'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>Water Irrigation</span>
          </button>

          <button
            onClick={() => { setOpMode('pesticide'); addLog('Switched to Pesticide Protection Spray Mode'); }}
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              opMode === 'pesticide'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Pesticide Spray</span>
          </button>

          <button
            onClick={() => { setOpMode('inspect'); addLog('Switched to LiDAR Field Inspection Mode'); }}
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              opMode === 'inspect'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>LiDAR Inspection</span>
          </button>
        </div>

        {/* Camera Views Bar */}
        <div className="glass-panel p-1.5 rounded-xl border border-slate-800 flex items-center space-x-1">
          <span className="text-[10px] text-slate-400 font-semibold px-2">CAM:</span>
          <button
            onClick={() => setCameraMode('orbit')}
            className={`px-2.5 py-1 rounded text-xs font-medium ${
              cameraMode === 'orbit' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            3D Orbit
          </button>
          <button
            onClick={() => setCameraMode('follow')}
            className={`px-2.5 py-1 rounded text-xs font-medium ${
              cameraMode === 'follow' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            Follow
          </button>
          <button
            onClick={() => setCameraMode('pov')}
            className={`px-2.5 py-1 rounded text-xs font-medium ${
              cameraMode === 'pov' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            Drone POV
          </button>
          <button
            onClick={() => setCameraMode('top')}
            className={`px-2.5 py-1 rounded text-xs font-medium ${
              cameraMode === 'top' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            Top Grid
          </button>
        </div>

      </div>

      {/* Bottom Center Playback HUD & Live Telemetry Gauge */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center space-y-3 w-full max-w-2xl px-4">
        
        <div className="glass-panel w-full p-3.5 rounded-2xl border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Main Controls: Play/Pause, Speed, Reset */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setIsPlaying(!isPlaying);
                addLog(isPlaying ? 'Simulation Paused' : 'Simulation Resumed');
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-lg transition-transform active:scale-95 ${
                isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={resetSimulation}
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-all"
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Speed Multiplier Button */}
            <button
              onClick={() => {
                const nextSpeed = speedMultiplier === 1 ? 2 : speedMultiplier === 2 ? 5 : 1;
                setSpeedMultiplier(nextSpeed);
                addLog(`Flight Speed set to ${nextSpeed}x`);
              }}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-emerald-400 flex items-center space-x-1"
            >
              <span>{speedMultiplier}x Speed</span>
            </button>
          </div>

          {/* Key Telemetry Stats */}
          <div className="grid grid-cols-4 gap-3 w-full md:w-auto text-center border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Seeds Planted</div>
              <div className="text-sm font-extrabold text-emerald-400 flex items-center justify-center space-x-1">
                <Sprout className="w-3.5 h-3.5" />
                <span>{droneState.seedsCount}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Distance</div>
              <div className="text-sm font-extrabold text-slate-100 flex items-center justify-center space-x-1">
                <Navigation className="w-3.5 h-3.5 text-teal-400" />
                <span>{droneState.distanceCovered}m</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Water Level</div>
              <div className="text-sm font-extrabold text-blue-400 flex items-center justify-center space-x-1">
                <Droplets className="w-3.5 h-3.5" />
                <span>{Math.round(droneState.waterLevel)}%</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Pesticide</div>
              <div className="text-sm font-extrabold text-amber-400 flex items-center justify-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{Math.round(droneState.pesticideLevel)}%</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Left Live Console Logs Overlay */}
      <div className="absolute bottom-6 left-4 z-20 hidden lg:block w-72">
        <div className="glass-panel p-3 rounded-xl border border-slate-800/80 text-[11px] font-mono">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-slate-400 font-sans text-xs font-semibold">
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Telemetry Flight Log</span>
            </span>
            <span className="text-[10px] text-emerald-400">10m GRID ACTIVE</span>
          </div>
          <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
            {logs.map((log, index) => (
              <div key={index} className={`truncate ${index === 0 ? 'text-emerald-300 font-semibold' : 'text-slate-400'}`}>
                &gt; {log}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
