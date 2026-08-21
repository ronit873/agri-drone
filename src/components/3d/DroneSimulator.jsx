import React, { useEffect, useRef, useState, useMemo } from 'react';
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
  Layers,
  MapPin,
  Gamepad
} from 'lucide-react';
import { getCropConfig } from '../../data/cropConfig';
import { generateMissionPlan, MISSION_TYPES } from '../../utils/missionPlanner';

export default function DroneSimulator({ 
  droneState, 
  setDroneState, 
  activeField,
  activeMission,
  theme = 'dark'
}) {
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [cameraMode, setCameraMode] = useState('orbit'); // 'orbit', 'follow', 'pov', 'top'
  const [opMode, setOpMode] = useState('seeding'); // 'seeding', 'watering', 'pesticide', 'inspect'
  
  // Control Mode: 'auto' (GPS Waypoints) vs 'manual' (Manual RC Pilot)
  const [controlMode, setControlMode] = useState('auto');
  
  const [logs, setLogs] = useState([
    'System Initialized: KRISHI VIKAS Quadcopter Drone Ready',
    'GPS Lock established: 16 Satellites connected',
    'Flight Mode: Autonomous GPS Mission Active.'
  ]);

  const keysPressed = useRef({});

  const cropConfig = getCropConfig(activeField.crop);

  // Compute or reuse active mission plan
  const mission = useMemo(() => {
    if (activeMission && activeMission.waypoints && activeMission.waypoints.length > 0) {
      return activeMission;
    }
    try {
      return generateMissionPlan({
        boundary: activeField.boundary || activeField.polygon,
        crop: activeField.crop,
        customParams: {
          altitude: cropConfig.recommendedFlightAltitude,
          rowSpacing: cropConfig.rowSpacing,
          plantSpacing: cropConfig.plantSpacing,
          swathWidth: cropConfig.swathWidth
        }
      });
    } catch (e) {
      console.warn('Fallback mission planner error', e);
      return null;
    }
  }, [activeMission, activeField, cropConfig]);

  // Convert mission waypoints to THREE.Vector3 array
  const dynamicWaypoints = useMemo(() => {
    if (!mission || !mission.waypoints || mission.waypoints.length === 0) {
      return [
        new THREE.Vector3(-15, 3.5, -15),
        new THREE.Vector3(15, 3.5, -15),
        new THREE.Vector3(15, 3.5, 15),
        new THREE.Vector3(-15, 3.5, 15)
      ];
    }
    return mission.waypoints.map(wp => new THREE.Vector3(wp.localX, wp.localY || wp.altitude || 3.5, wp.localZ));
  }, [mission]);

  // Scene & Three.js references
  const sceneRef = useRef(null);
  const droneGroupRef = useRef(null);
  const rotorsRef = useRef([]);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const waterParticlesRef = useRef(null);
  const pesticideParticlesRef = useRef(null);
  const plantsGroupRef = useRef(null);
  const boundaryGroupRef = useRef(null);

  // Flight animation state reference
  const flightStateRef = useRef({
    currentWaypointIndex: 0,
    distanceTraveled: 0,
    lastSeedDistance: 0,
    seedsDropped: 0,
    plants: [],
    opMode: 'seeding',
    controlMode: 'auto',
    isPlaying: true,
    speedMultiplier: 1,
    cameraMode: 'orbit',
    waypoints: dynamicWaypoints,
    cropConfig: cropConfig
  });

  // Keep ref synchronized with React state
  useEffect(() => {
    flightStateRef.current.opMode = opMode;
    flightStateRef.current.controlMode = controlMode;
    flightStateRef.current.isPlaying = isPlaying;
    flightStateRef.current.speedMultiplier = speedMultiplier;
    flightStateRef.current.cameraMode = cameraMode;
    flightStateRef.current.waypoints = dynamicWaypoints;
    flightStateRef.current.cropConfig = cropConfig;
  }, [opMode, controlMode, isPlaying, speedMultiplier, cameraMode, dynamicWaypoints, cropConfig]);

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev.slice(0, 7)]);
  };

  // Keyboard Event Listeners for Manual RC Flight
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Setup Three.js WebGL Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup
    const isLight = theme === 'light';
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(isLight ? 0xbfe0fd : 0x0a1120);
    scene.fog = new THREE.FogExp2(isLight ? 0xbfe0fd : 0x0a1120, 0.01);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 30, 50);
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
    const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 0.9 : 0.65);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5ea, isLight ? 1.8 : 1.4);
    sunLight.position.set(50, 70, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 200;
    const d = 50;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x2d4a20, isLight ? 0.6 : 0.4);
    scene.add(hemiLight);

    // 5. Ground Soil Bed
    const terrainGeo = new THREE.PlaneGeometry(120, 120, 40, 40);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0x4a3b2c : 0x241a12,
      roughness: 0.95,
      metalness: 0.05
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Grid lines overlay
    const gridHelper = new THREE.GridHelper(100, 20, 0x10b981, isLight ? 0x94a3b8 : 0x1e293b);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // Boundary Group
    const boundaryGroup = new THREE.Group();
    scene.add(boundaryGroup);
    boundaryGroupRef.current = boundaryGroup;

    // Plants container
    const plantsGroup = new THREE.Group();
    scene.add(plantsGroup);
    plantsGroupRef.current = plantsGroup;

    // 6. Quadcopter 3D Drone Model
    const startPos = dynamicWaypoints[0] || new THREE.Vector3(0, 3.5, 0);
    const droneGroup = new THREE.Group();
    droneGroup.position.copy(startPos);
    scene.add(droneGroup);
    droneGroupRef.current = droneGroup;

    // Central Body Chassis
    const bodyGeo = new THREE.BoxGeometry(1.6, 0.4, 1.6);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    droneGroup.add(body);

    // Top Cover Shell
    const topShellGeo = new THREE.CylinderGeometry(0.7, 0.9, 0.3, 8);
    const topShellMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.1 });
    const topShell = new THREE.Mesh(topShellGeo, topShellMat);
    topShell.position.y = 0.3;
    topShell.castShadow = true;
    droneGroup.add(topShell);

    // Payloads
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

    const pesticideGeo = new THREE.BoxGeometry(0.5, 0.4, 0.4);
    const pesticideMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.3, roughness: 0.4 });
    const pesticideTank = new THREE.Mesh(pesticideGeo, pesticideMat);
    pesticideTank.position.set(0, -0.35, 0.4);
    droneGroup.add(pesticideTank);

    const dropperGeo = new THREE.ConeGeometry(0.18, 0.4, 8);
    const dropperMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.9 });
    const dropper = new THREE.Mesh(dropperGeo, dropperMat);
    dropper.rotation.x = Math.PI;
    dropper.position.set(0, -0.6, 0);
    droneGroup.add(dropper);

    // LiDAR Laser Cone
    const laserGeo = new THREE.ConeGeometry(2.0, 4.0, 16, 1, true);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    const laserCone = new THREE.Mesh(laserGeo, laserMat);
    laserCone.position.set(0, -2.0, 0);
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
      const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.2, 8);
      const armMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 });
      const arm = new THREE.Mesh(armGeo, armMat);
      arm.rotation.z = Math.PI / 2;
      arm.rotation.y = idx % 2 === 0 ? Math.PI / 4 : -Math.PI / 4;
      arm.position.set(pos.x / 2, 0.05, pos.z / 2);
      droneGroup.add(arm);

      const motorGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 12);
      const motorMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9 });
      const motor = new THREE.Mesh(motorGeo, motorMat);
      motor.position.set(pos.x, 0.15, pos.z);
      droneGroup.add(motor);

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
    });

    rotorsRef.current = rotorArray;

    // Particle Systems for Spray
    const waterPartCount = 180;
    const waterGeo = new THREE.BufferGeometry();
    const waterPos = new Float32Array(waterPartCount * 3);
    for (let i = 0; i < waterPartCount; i++) {
      waterPos[i * 3] = (Math.random() - 0.5) * 1.2;
      waterPos[i * 3 + 1] = -Math.random() * 3.5;
      waterPos[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
    }
    waterGeo.setAttribute('position', new THREE.BufferAttribute(waterPos, 3));
    const waterMat = new THREE.PointsMaterial({ color: 0x60a5fa, size: 0.15, transparent: true, opacity: 0.75 });
    const waterParticles = new THREE.Points(waterGeo, waterMat);
    waterParticles.visible = false;
    droneGroup.add(waterParticles);
    waterParticlesRef.current = waterParticles;

    const pestPartCount = 180;
    const pestGeo = new THREE.BufferGeometry();
    const pestPos = new Float32Array(pestPartCount * 3);
    for (let i = 0; i < pestPartCount; i++) {
      pestPos[i * 3] = (Math.random() - 0.5) * 1.4;
      pestPos[i * 3 + 1] = -Math.random() * 3.5;
      pestPos[i * 3 + 2] = (Math.random() - 0.5) * 1.4;
    }
    pestGeo.setAttribute('position', new THREE.BufferAttribute(pestPos, 3));
    const pestMat = new THREE.PointsMaterial({ color: 0xfacc15, size: 0.18, transparent: true, opacity: 0.65 });
    const pesticideParticles = new THREE.Points(pestGeo, pestMat);
    pesticideParticles.visible = false;
    droneGroup.add(pesticideParticles);
    pesticideParticlesRef.current = pesticideParticles;

    // Camera Orbit Mouse Control
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraAngle = { polar: Math.PI / 4, azimuth: 0, distance: 50 };

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

    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e) => { cameraAngle.distance = Math.max(10, Math.min(120, cameraAngle.distance + e.deltaY * 0.04)); };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElem.addEventListener('wheel', onWheel);

    // Animation Loop
    let clock = new THREE.Clock();
    let animFrameId;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const st = flightStateRef.current;
      const currentWPs = st.waypoints;

      // Rotate rotor blades
      rotorsRef.current.forEach(r => {
        r.rotation.y += st.isPlaying ? 0.45 * st.speedMultiplier : 0.05;
      });

      // Particle spray visibility
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

      // ==========================================
      // 1. MANUAL RC FLIGHT MODE CONTROLS
      // ==========================================
      if (st.controlMode === 'manual' && droneGroupRef.current) {
        const drone = droneGroupRef.current;
        const speed = 8.0 * st.speedMultiplier * delta;
        const yawSpeed = 1.8 * delta;
        const keys = keysPressed.current;

        let moved = false;

        // Yaw Rotation (Turn Q/E)
        if (keys['q']) { drone.rotation.y += yawSpeed; moved = true; }
        if (keys['e']) { drone.rotation.y -= yawSpeed; moved = true; }

        // Pitch & Roll Movement (WASD / Arrows)
        const moveDir = new THREE.Vector3();
        if (keys['w'] || keys['arrowup']) { moveDir.z -= 1; moved = true; }
        if (keys['s'] || keys['arrowdown']) { moveDir.z += 1; moved = true; }
        if (keys['a'] || keys['arrowleft']) { moveDir.x -= 1; moved = true; }
        if (keys['d'] || keys['arrowright']) { moveDir.x += 1; moved = true; }

        // Altitude Throttle (R/F or PageUp/PageDown)
        if (keys['r'] || keys['pageup']) { drone.position.y = Math.min(30, drone.position.y + speed * 0.7); moved = true; }
        if (keys['f'] || keys['pagedown']) { drone.position.y = Math.max(0.5, drone.position.y - speed * 0.7); moved = true; }

        if (moveDir.length() > 0) {
          moveDir.normalize();
          moveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), drone.rotation.y);
          drone.position.x += moveDir.x * speed;
          drone.position.z += moveDir.z * speed;
          st.distanceTraveled += speed;

          // Pitch tilt animation
          drone.rotation.x = THREE.MathUtils.lerp(drone.rotation.x, -0.15, 0.1);
        } else {
          drone.rotation.x = THREE.MathUtils.lerp(drone.rotation.x, 0, 0.1);
        }

        // Manual Seeding Drop Trigger
        if (moved && st.opMode === 'seeding') {
          const plantX = Number(drone.position.x.toFixed(1));
          const plantZ = Number(drone.position.z.toFixed(1));
          const plantKey = `${plantX}_${plantZ}`;

          if (!st.plants.includes(plantKey)) {
            st.plants.push(plantKey);
            const plantGroup = new THREE.Group();
            plantGroup.position.set(plantX, 0, plantZ);

            const moundGeo = new THREE.ConeGeometry(0.4, 0.2, 8);
            const moundMat = new THREE.MeshStandardMaterial({ color: 0x3d1a04 });
            const mound = new THREE.Mesh(moundGeo, moundMat);
            mound.position.y = 0.08;
            plantGroup.add(mound);

            const stemGeo = new THREE.CylinderGeometry(0.03, 0.05, 0.5, 6);
            const stemMat = new THREE.MeshStandardMaterial({ color: 0x22c55e });
            const stem = new THREE.Mesh(stemGeo, stemMat);
            stem.position.y = 0.35;
            plantGroup.add(stem);

            if (plantsGroupRef.current) {
              plantsGroupRef.current.add(plantGroup);
            }

            setDroneState(prev => ({
              ...prev,
              seedsCount: prev.seedsCount + 1,
              distanceCovered: Math.round(st.distanceTraveled)
            }));
          }
        }
      } 
      // ==========================================
      // 2. AUTONOMOUS BUSTROPHEDON GPS MISSION MODE
      // ==========================================
      else if (st.controlMode === 'auto' && st.isPlaying && currentWPs.length > 0 && droneGroupRef.current) {
        const targetWP = currentWPs[st.currentWaypointIndex];
        const dronePos = droneGroupRef.current.position;
        const dir = new THREE.Vector3().subVectors(targetWP, dronePos);
        dir.y = 0;
        const dist = dir.length();

        if (dist > 0.3) {
          dir.normalize();
          const speed = (st.cropConfig?.flightSpeed || 4.0) * st.speedMultiplier * delta;
          droneGroupRef.current.position.x += dir.x * speed;
          droneGroupRef.current.position.z += dir.z * speed;

          const targetAngle = Math.atan2(dir.x, dir.z);
          droneGroupRef.current.rotation.y = THREE.MathUtils.lerp(droneGroupRef.current.rotation.y, targetAngle, 0.1);
          st.distanceTraveled += speed;

          const seedSpacingStep = Math.max(0.5, (st.cropConfig?.plantSpacing || 0.2) * 3.5);
          if (st.opMode === 'seeding' && st.distanceTraveled - st.lastSeedDistance >= seedSpacingStep) {
            st.lastSeedDistance = st.distanceTraveled;
            st.seedsDropped += 1;

            const plantX = Number(dronePos.x.toFixed(1));
            const plantZ = Number(dronePos.z.toFixed(1));
            const plantKey = `${plantX}_${plantZ}`;

            if (!st.plants.includes(plantKey)) {
              st.plants.push(plantKey);
              const plantGroup = new THREE.Group();
              plantGroup.position.set(plantX, 0, plantZ);

              const moundGeo = new THREE.ConeGeometry(0.4, 0.2, 8);
              const moundMat = new THREE.MeshStandardMaterial({ color: 0x3d1a04 });
              const mound = new THREE.Mesh(moundGeo, moundMat);
              mound.position.y = 0.08;
              plantGroup.add(mound);

              const stemGeo = new THREE.CylinderGeometry(0.03, 0.05, 0.5, 6);
              const stemMat = new THREE.MeshStandardMaterial({ color: 0x22c55e });
              const stem = new THREE.Mesh(stemGeo, stemMat);
              stem.position.y = 0.35;
              plantGroup.add(stem);

              if (plantsGroupRef.current) {
                plantsGroupRef.current.add(plantGroup);
              }
            }

            setDroneState(prev => ({
              ...prev,
              seedsCount: prev.seedsCount + 1,
              seedsTank: Math.max(0, prev.seedsTank - 0.15),
              distanceCovered: Math.round(st.distanceTraveled),
              battery: Math.max(10, prev.battery - 0.05)
            }));
          }

        } else {
          st.currentWaypointIndex = (st.currentWaypointIndex + 1) % currentWPs.length;
          addLog(`Reached WP #${st.currentWaypointIndex + 1} (${currentWPs[st.currentWaypointIndex].x.toFixed(1)}m, ${currentWPs[st.currentWaypointIndex].z.toFixed(1)}m)`);
        }
      }

      // Camera views
      if (droneGroupRef.current && cameraRef.current) {
        const dPos = droneGroupRef.current.position;

        if (st.cameraMode === 'orbit') {
          camera.position.x = dPos.x + cameraAngle.distance * Math.sin(cameraAngle.polar) * Math.sin(cameraAngle.azimuth);
          camera.position.y = dPos.y + cameraAngle.distance * Math.cos(cameraAngle.polar);
          camera.position.z = dPos.z + cameraAngle.distance * Math.sin(cameraAngle.polar) * Math.cos(cameraAngle.azimuth);
          camera.lookAt(dPos);
        } else if (st.cameraMode === 'follow') {
          const backOffset = new THREE.Vector3(0, 4.5, 10).applyAxisAngle(new THREE.Vector3(0, 1, 0), droneGroupRef.current.rotation.y);
          camera.position.copy(dPos).add(backOffset);
          camera.lookAt(dPos.x, dPos.y + 1, dPos.z);
        } else if (st.cameraMode === 'pov') {
          const frontOffset = new THREE.Vector3(0, 0.4, -0.6).applyAxisAngle(new THREE.Vector3(0, 1, 0), droneGroupRef.current.rotation.y);
          camera.position.copy(dPos).add(frontOffset);
          const targetAhead = new THREE.Vector3(0, 0, -10).applyAxisAngle(new THREE.Vector3(0, 1, 0), droneGroupRef.current.rotation.y);
          camera.lookAt(dPos.clone().add(targetAhead));
        } else if (st.cameraMode === 'top') {
          camera.position.set(dPos.x, dPos.y + 40, dPos.z + 0.1);
          camera.lookAt(dPos);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

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

  // Update 3D Field Perimeter Line & Beacons
  useEffect(() => {
    if (!boundaryGroupRef.current || !mission || !mission.localPolygon) return;
    const group = boundaryGroupRef.current;
    while (group.children.length > 0) { group.remove(group.children[0]); }
    const { localPolygon } = mission;

    const linePts = localPolygon.map(pt => new THREE.Vector3(pt.x, 0.05, pt.z));
    linePts.push(linePts[0]);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 2 });
    group.add(new THREE.Line(lineGeo, lineMat));

    localPolygon.forEach((pt) => {
      const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(pt.x, 0.9, pt.z);
      group.add(pole);

      const bulbGeo = new THREE.SphereGeometry(0.3, 12, 12);
      const bulbMat = new THREE.MeshStandardMaterial({ color: 0xeab308, emissive: 0xca8a04, emissiveIntensity: 0.8 });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(pt.x, 1.9, pt.z);
      group.add(bulb);
    });
  }, [mission]);

  const resetSimulation = () => {
    flightStateRef.current.currentWaypointIndex = 0;
    flightStateRef.current.distanceTraveled = 0;
    flightStateRef.current.lastSeedDistance = 0;
    flightStateRef.current.seedsDropped = 0;
    flightStateRef.current.plants = [];

    const startPos = dynamicWaypoints[0] || new THREE.Vector3(0, 3.5, 0);
    if (droneGroupRef.current) {
      droneGroupRef.current.position.copy(startPos);
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
    addLog('Simulation Reset: Drone returned to Waypoint #1.');
  };

  // Helper trigger for manual joystick buttons
  const triggerManualAction = (key, press = true) => {
    keysPressed.current[key.toLowerCase()] = press;
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-slate-950">
      
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Title & Field Badge Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2 pointer-events-none">
        <div className="gcs-panel px-4 py-2.5 rounded-xl border border-slate-800 flex items-center space-x-3 pointer-events-auto shadow-2xl">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="text-[10px] text-slate-400 font-mono font-medium uppercase">3D WebGL Viewport</div>
            <div className="text-xs font-bold text-white flex items-center space-x-2">
              <span>{activeField.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {activeField.crop}
              </span>
            </div>
          </div>
        </div>

        {/* Control Mode Switcher Pill */}
        <div className="gcs-panel p-1 rounded-xl border border-slate-800 flex items-center space-x-1 pointer-events-auto shadow-2xl">
          <button
            onClick={() => {
              setControlMode('auto');
              addLog('Flight Mode Switched: Autonomous GPS Waypoint Mode');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              controlMode === 'auto'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>GPS Auto</span>
          </button>

          <button
            onClick={() => {
              setControlMode('manual');
              addLog('Flight Mode Switched: Manual Pilot RC Joystick Mode (WASD / D-Pad Active)');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              controlMode === 'manual'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad className="w-3.5 h-3.5" />
            <span>Manual RC</span>
          </button>
        </div>
      </div>

      {/* Manual RC Pilot D-Pad & Keyboard Controls HUD (Shown in Manual Mode) */}
      {controlMode === 'manual' && (
        <div className="absolute top-20 left-4 z-20 gcs-panel p-3 rounded-2xl border border-amber-500/40 w-64 space-y-2 shadow-2xl text-xs">
          <div className="flex items-center justify-between text-amber-400 font-bold border-b border-slate-800 pb-1.5">
            <span className="flex items-center gap-1">
              <Gamepad className="w-4 h-4" />
              <span>Manual RC Controls</span>
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">WASD / D-Pad</span>
          </div>

          <div className="text-[11px] text-slate-300 leading-snug font-mono">
            <div>• <strong className="text-amber-300">W/S/A/D</strong>: Pitch &amp; Roll</div>
            <div>• <strong className="text-amber-300">Q/E</strong>: Yaw Rotate Left/Right</div>
            <div>• <strong className="text-amber-300">R/F</strong>: Throttle Altitude Up/Down</div>
          </div>

          {/* Interactive Touch/Mouse D-Pad Joystick Overlay */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <div />
            <button
              onMouseDown={() => triggerManualAction('w', true)}
              onMouseUp={() => triggerManualAction('w', false)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-amber-500/20 text-amber-400 font-bold text-center active:scale-95"
            >
              ▲ W
            </button>
            <div />
            <button
              onMouseDown={() => triggerManualAction('a', true)}
              onMouseUp={() => triggerManualAction('a', false)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-amber-500/20 text-amber-400 font-bold text-center active:scale-95"
            >
              ◀ A
            </button>
            <button
              onMouseDown={() => triggerManualAction('s', true)}
              onMouseUp={() => triggerManualAction('s', false)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-amber-500/20 text-amber-400 font-bold text-center active:scale-95"
            >
              ▼ S
            </button>
            <button
              onMouseDown={() => triggerManualAction('d', true)}
              onMouseUp={() => triggerManualAction('d', false)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-amber-500/20 text-amber-400 font-bold text-center active:scale-95"
            >
              D ▶
            </button>
          </div>
        </div>
      )}

      {/* Top Right Controls Overlay: Camera & Operations Selector */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end space-y-2.5">
        <div className="gcs-panel p-2 rounded-xl border border-slate-800 flex flex-col space-y-1 w-48 shadow-2xl">
          <div className="text-[10px] font-mono font-bold text-slate-400 px-2 py-0.5 uppercase tracking-wider">
            Flight Operation
          </div>

          <button
            onClick={() => { setOpMode('seeding'); addLog(`Switched to ${cropConfig.name} Seeding Mode`); }}
            className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              opMode === 'seeding' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Seeding</span>
          </button>

          <button
            onClick={() => { setOpMode('watering'); addLog('Switched to Water Irrigation Mist Mode'); }}
            className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              opMode === 'watering' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Water Irrigation</span>
          </button>

          <button
            onClick={() => { setOpMode('pesticide'); addLog('Switched to Pesticide Protection Spray Mode'); }}
            className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              opMode === 'pesticide' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Pesticide Spray</span>
          </button>

          <button
            onClick={() => { setOpMode('inspect'); addLog('Switched to LiDAR Field Inspection Mode'); }}
            className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              opMode === 'inspect' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>LiDAR Inspection</span>
          </button>
        </div>

        {/* Camera Views Bar */}
        <div className="gcs-panel p-1 rounded-xl border border-slate-800 flex items-center space-x-1 shadow-2xl">
          <span className="text-[10px] text-slate-400 font-mono font-bold px-1.5">CAM:</span>
          <button
            onClick={() => setCameraMode('orbit')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
              cameraMode === 'orbit' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            Orbit
          </button>
          <button
            onClick={() => setCameraMode('follow')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
              cameraMode === 'follow' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            Follow
          </button>
          <button
            onClick={() => setCameraMode('pov')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
              cameraMode === 'pov' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            POV
          </button>
          <button
            onClick={() => setCameraMode('top')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
              cameraMode === 'top' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            Top Grid
          </button>
        </div>
      </div>

      {/* Bottom Center Playback HUD */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center space-y-3 w-full max-w-2xl px-4">
        <div className="glass-panel w-full p-3.5 rounded-2xl border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <button
              onClick={() => {
                setIsPlaying(!isPlaying);
                addLog(isPlaying ? 'Simulation Paused' : 'Simulation Resumed');
              }}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1 font-bold text-xs shadow-lg transition-transform active:scale-95 ${
                isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Resume'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(true);
                flightStateRef.current.currentWaypointIndex = 0;
                addLog('Command Sent: Takeoff Initiated');
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-bold transition-all"
            >
              Takeoff
            </button>

            <button
              onClick={() => {
                setIsPlaying(true);
                flightStateRef.current.currentWaypointIndex = Math.max(0, dynamicWaypoints.length - 1);
                addLog('Command Sent: Return-To-Home (RTH) Triggered');
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30 text-xs font-bold transition-all"
            >
              Return Home
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                addLog('Command Sent: Landing Completed');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all"
            >
              Land
            </button>

            <button
              onClick={resetSimulation}
              className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-all"
              title="Reset Simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                const nextSpeed = speedMultiplier === 1 ? 2 : speedMultiplier === 2 ? 5 : 1;
                setSpeedMultiplier(nextSpeed);
                addLog(`Flight Speed set to ${nextSpeed}x`);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-emerald-400"
            >
              {speedMultiplier}x Speed
            </button>
          </div>

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
        <div className="glass-panel p-3 rounded-xl border border-slate-800/80 text-[11px] font-mono shadow-xl">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-slate-400 font-sans text-xs font-semibold">
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Telemetry Flight Log</span>
            </span>
            <span className="text-[10px] text-emerald-400 uppercase">{controlMode} MODE</span>
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
