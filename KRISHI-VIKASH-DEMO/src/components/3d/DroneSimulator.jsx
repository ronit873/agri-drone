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
  MapPin
} from 'lucide-react';
import { getCropConfig } from '../../data/cropConfig';
import { generateMissionPlan, MISSION_TYPES } from '../../utils/missionPlanner';

export default function DroneSimulator({ 
  droneState, 
  setDroneState, 
  activeField,
  activeMission,
  demoStep,
  addLog
}) {
  const containerRef = useRef(null);
  
  // Map demo steps to simulation state
  const isPlaying = demoStep !== 'IDLE' && demoStep !== 'LANDED' && demoStep !== 'TAKEOFF';
  const speedMultiplier = demoStep === 'RETURN' ? 1.5 : 1;
  const [cameraMode, setCameraMode] = useState('orbit');
  
  let opMode = 'inspect';
  if (demoStep === 'SEEDING') opMode = 'seeding';
  if (demoStep === 'WATER') opMode = 'watering';
  if (demoStep === 'PESTICIDE') opMode = 'pesticide';
  if (demoStep === 'IDLE') opMode = 'idle';

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
      // Fallback 4 corner circuit
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
    plants: [], // array of planted coordinate keys
    opMode: 'seeding',
    isPlaying: true,
    speedMultiplier: 1,
    cameraMode: 'orbit',
    waypoints: dynamicWaypoints,
    cropConfig: cropConfig
  });

  // Keep ref synchronized with React state
  useEffect(() => {
    flightStateRef.current.opMode = opMode;
    flightStateRef.current.isPlaying = isPlaying;
    flightStateRef.current.speedMultiplier = speedMultiplier;
    flightStateRef.current.cameraMode = cameraMode;
    flightStateRef.current.waypoints = dynamicWaypoints;
    flightStateRef.current.cropConfig = cropConfig;
  }, [opMode, isPlaying, speedMultiplier, cameraMode, dynamicWaypoints, cropConfig]);

  // Setup Three.js WebGL Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a1120);
    scene.fog = new THREE.FogExp2(0x0a1120, 0.012);

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5ea, 1.4);
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

    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x2d4a20, 0.4);
    scene.add(hemiLight);

    // 5. Ground Soil Bed
    const terrainGeo = new THREE.PlaneGeometry(120, 120, 40, 40);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x241a12,
      roughness: 0.95,
      metalness: 0.05
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Grid lines overlay
    const gridHelper = new THREE.GridHelper(100, 20, 0x10b981, 0x1e293b);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // Boundary Group (Field perimeter and beacons)
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

    // Top Cover Shell (Carbon fiber look)
    const topShellGeo = new THREE.CylinderGeometry(0.7, 0.9, 0.3, 8);
    const topShellMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.1 });
    const topShell = new THREE.Mesh(topShellGeo, topShellMat);
    topShell.position.y = 0.3;
    topShell.castShadow = true;
    droneGroup.add(topShell);

    // Triple Payloads (Seeds hopper, Water tank, Pesticide tank)
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

    // Downward LiDAR Scanning Cone
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

      const ledGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const ledColor = idx < 2 ? 0x10b981 : 0xef4444;
      const ledMat = new THREE.MeshBasicMaterial({ color: ledColor });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(pos.x * 1.1, 0.1, pos.z * 1.1);
      droneGroup.add(led);
    });

    rotorsRef.current = rotorArray;

    // 7. Particle Systems for Water Mist & Pesticide Spray
    const waterPartCount = 180;
    const waterGeo = new THREE.BufferGeometry();
    const waterPos = new Float32Array(waterPartCount * 3);
    for (let i = 0; i < waterPartCount; i++) {
      waterPos[i * 3] = (Math.random() - 0.5) * 1.2;
      waterPos[i * 3 + 1] = -Math.random() * 3.5;
      waterPos[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
    }
    waterGeo.setAttribute('position', new THREE.BufferAttribute(waterPos, 3));
    const waterMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.15,
      transparent: true,
      opacity: 0.75
    });
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
    const pestMat = new THREE.PointsMaterial({
      color: 0xfacc15,
      size: 0.18,
      transparent: true,
      opacity: 0.65
    });
    const pesticideParticles = new THREE.Points(pestGeo, pestMat);
    pesticideParticles.visible = false;
    droneGroup.add(pesticideParticles);
    pesticideParticlesRef.current = pesticideParticles;

    // 8. Orbit Drag / Mouse Interaction
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

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      cameraAngle.distance = Math.max(10, Math.min(120, cameraAngle.distance + e.deltaY * 0.04));
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
      const currentWPs = st.waypoints;

      // Rotate rotor blades
      rotorsRef.current.forEach(r => {
        r.rotation.y += st.isPlaying ? 0.45 * st.speedMultiplier : 0.05;
      });

      // Subtle drone hover wobble
      if (droneGroupRef.current) {
        const time = clock.getElapsedTime();
        const baseAltitude = currentWPs[st.currentWaypointIndex]?.y || 3.5;
        droneGroupRef.current.position.y = THREE.MathUtils.lerp(
          droneGroupRef.current.position.y,
          baseAltitude + Math.sin(time * 3) * 0.1,
          0.05
        );
      }

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

      // Autonomous Flight along Dynamic GPS Mission Waypoints
      if (st.isPlaying && currentWPs.length > 0 && droneGroupRef.current) {
        const targetWP = currentWPs[st.currentWaypointIndex];
        const dronePos = droneGroupRef.current.position;

        const dir = new THREE.Vector3().subVectors(targetWP, dronePos);
        dir.y = 0; // maintain level horizontal vector
        const dist = dir.length();

        if (dist > 0.3) {
          dir.normalize();
          const speed = (st.cropConfig?.flightSpeed || 4.0) * st.speedMultiplier * delta;
          droneGroupRef.current.position.x += dir.x * speed;
          droneGroupRef.current.position.z += dir.z * speed;

          // Face movement heading
          const targetAngle = Math.atan2(dir.x, dir.z);
          droneGroupRef.current.rotation.y = THREE.MathUtils.lerp(droneGroupRef.current.rotation.y, targetAngle, 0.1);

          // Distance tracking
          st.distanceTraveled += speed;

          // Crop-Specific Seeding Interval Trigger (in meters)
          const seedSpacingStep = Math.max(0.5, (st.cropConfig?.plantSpacing || 0.2) * 3.5);
          if (st.opMode === 'seeding' && st.distanceTraveled - st.lastSeedDistance >= seedSpacingStep) {
            st.lastSeedDistance = st.distanceTraveled;
            st.seedsDropped += 1;

            // Spawn 3D Crop Plant at ground coordinate
            const plantX = Number(dronePos.x.toFixed(1));
            const plantZ = Number(dronePos.z.toFixed(1));
            const plantKey = `${plantX}_${plantZ}`;

            if (!st.plants.includes(plantKey)) {
              st.plants.push(plantKey);

              const plantGroup = new THREE.Group();
              plantGroup.position.set(plantX, 0, plantZ);

              // Soil mound
              const moundGeo = new THREE.ConeGeometry(0.4, 0.2, 8);
              const moundMat = new THREE.MeshStandardMaterial({ color: 0x3d1a04 });
              const mound = new THREE.Mesh(moundGeo, moundMat);
              mound.position.y = 0.08;
              plantGroup.add(mound);

              // Stem & Sprout
              const stemGeo = new THREE.CylinderGeometry(0.03, 0.05, 0.5, 6);
              const stemMat = new THREE.MeshStandardMaterial({ 
                color: st.cropConfig?.stemColor || 0x22c55e 
              });
              const stem = new THREE.Mesh(stemGeo, stemMat);
              stem.position.y = 0.35;
              plantGroup.add(stem);

              const leafGeo = new THREE.SphereGeometry(0.2, 8, 8);
              leafGeo.scale(1.4, 0.3, 0.7);
              const leafMat = new THREE.MeshStandardMaterial({ 
                color: st.cropConfig?.leafColor || 0x4ade80 
              });
              const leaf1 = new THREE.Mesh(leafGeo, leafMat);
              leaf1.position.set(0.12, 0.5, 0);
              leaf1.rotation.z = -0.4;
              const leaf2 = new THREE.Mesh(leafGeo, leafMat);
              leaf2.position.set(-0.12, 0.5, 0);
              leaf2.rotation.z = 0.4;
              plantGroup.add(leaf1);
              plantGroup.add(leaf2);

              if (plantsGroupRef.current) {
                plantsGroupRef.current.add(plantGroup);
              }
            }

            // Sync with React parent telemetry
            setDroneState(prev => ({
              ...prev,
              seedsCount: prev.seedsCount + 1,
              seedsTank: Math.max(0, prev.seedsTank - 0.15),
              distanceCovered: Math.round(st.distanceTraveled),
              battery: Math.max(10, prev.battery - 0.05)
            }));
          }

          // Resource consumption for water / pesticide
          if (st.opMode === 'watering') {
            setDroneState(prev => ({
              ...prev,
              waterLevel: Math.max(0, prev.waterLevel - 0.04),
              battery: Math.max(10, prev.battery - 0.06)
            }));
          } else if (st.opMode === 'pesticide') {
            setDroneState(prev => ({
              ...prev,
              pesticideLevel: Math.max(0, prev.pesticideLevel - 0.03),
              battery: Math.max(10, prev.battery - 0.06)
            }));
          }

        } else {
          // Reached waypoint, advance sequence
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

  // Update Dynamic 3D Field Perimeter & Boundary Markers when active field / mission changes
  useEffect(() => {
    if (!boundaryGroupRef.current || !mission || !mission.localPolygon) return;
    const group = boundaryGroupRef.current;

    // Clear previous boundary markers
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    const { localPolygon } = mission;

    // 1. Draw 3D Boundary Perimeter Line
    const linePts = localPolygon.map(pt => new THREE.Vector3(pt.x, 0.05, pt.z));
    linePts.push(linePts[0]); // close loop
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 2 });
    const perimeterLine = new THREE.Line(lineGeo, lineMat);
    group.add(perimeterLine);

    // 2. Draw GPS Vertex Flagpoles & Glowing Beacons at Polygon Corners
    localPolygon.forEach((pt, idx) => {
      const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(pt.x, 0.9, pt.z);
      pole.castShadow = true;

      const bulbGeo = new THREE.SphereGeometry(0.3, 12, 12);
      const bulbMat = new THREE.MeshStandardMaterial({
        color: 0xeab308,
        emissive: 0xca8a04,
        emissiveIntensity: 0.8
      });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(pt.x, 1.9, pt.z);

      group.add(pole);
      group.add(bulb);
    });

  }, [mission]);

  useEffect(() => {
    if (demoStep === 'IDLE') {
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
    }
  }, [demoStep, dynamicWaypoints]);

  return (
    <div className="relative w-full h-[calc(100vh)] overflow-hidden bg-slate-950">
      
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
    </div>
  );
}
