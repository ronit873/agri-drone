/**
 * KRISHI VIKAS — MAVLink Physical Hardware Bridge & Telemetry Gateway
 * Enables real-world communication with Pixhawk, ArduPilot, PX4 & MAVLink flight controllers
 * Supports WebSerial API (USB/UART Telemetry Radios) & WebSocket MAVLink streams.
 */

// Standard MAVLink Command IDs
export className MAVLinkCommands {
  static NAV_WAYPOINT = 16;
  static NAV_TAKEOFF = 22;
  static NAV_LAND = 21;
  static NAV_RETURN_TO_LAUNCH = 20;
  static DO_SET_SERVO = 183;
  static DO_SPRAY = 216;
}

export className MavlinkHardwareBridge {
  constructor() {
    this.isConnected = false;
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.connectionType = 'none'; // 'webserial', 'websocket', 'simulator'
    this.listeners = [];
  }

  // Check WebSerial browser API support
  static isWebSerialSupported() {
    return 'serial' in navigator;
  }

  // Request & Open physical USB / Telemetry Radio Serial Port (e.g. 915MHz / 433MHz SiK Radios @ 57600 baud)
  async connectSerial(baudRate = 57600) {
    if (!MavlinkHardwareBridge.isWebSerialSupported()) {
      throw new Error('WebSerial API is not supported in this browser. Use Chrome, Edge, or Opera.');
    }

    try {
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate });
      this.isConnected = true;
      this.connectionType = 'webserial';

      this.startReadingSerial();
      this.notifyListeners({ type: 'STATUS', message: `Connected to Physical Telemetry Radio @ ${baudRate} baud` });
      return true;
    } catch (err) {
      console.error('WebSerial connection error:', err);
      this.isConnected = false;
      throw err;
    }
  }

  // Connect via WebSocket Telemetry Gateway (e.g. mavproxy.py / MAVRouter)
  connectWebSocket(url = 'ws://localhost:8088') {
    try {
      const ws = new WebSocket(url);
      ws.onopen = () => {
        this.isConnected = true;
        this.connectionType = 'websocket';
        this.notifyListeners({ type: 'STATUS', message: `Connected to MAVLink WebSocket Gateway (${url})` });
      };

      ws.onmessage = (evt) => {
        this.parseMavlinkPacket(evt.data);
      };

      ws.onerror = (err) => {
        console.error('WebSocket MAVLink error:', err);
        this.isConnected = false;
      };

      ws.onclose = () => {
        this.isConnected = false;
        this.notifyListeners({ type: 'STATUS', message: 'MAVLink Gateway Disconnected' });
      };
    } catch (e) {
      console.error('WebSocket connection failed', e);
    }
  }

  // Listen to incoming serial stream
  async startReadingSerial() {
    while (this.port && this.port.readable && this.isConnected) {
      this.reader = this.port.readable.getReader();
      try {
        while (true) {
          const { value, done } = await this.reader.read();
          if (done) break;
          if (value) {
            this.parseRawSerialBytes(value);
          }
        }
      } catch (err) {
        console.error('Serial read error:', err);
      } finally {
        this.reader.releaseLock();
      }
    }
  }

  // Parse raw MAVLink packet bytes
  parseRawSerialBytes(uint8Array) {
    // Process MAVLink v1 / v2 frame headers (0xFE / 0xFD)
    if (uint8Array.length > 0 && (uint8Array[0] === 0xFE || uint8Array[0] === 0xFD)) {
      this.notifyListeners({
        type: 'TELEMETRY',
        rawBytes: uint8Array.length,
        timestamp: Date.now()
      });
    }
  }

  // Disconnect physical hardware
  async disconnect() {
    this.isConnected = false;
    if (this.reader) {
      await this.reader.cancel();
    }
    if (this.port) {
      await this.port.close();
    }
    this.notifyListeners({ type: 'STATUS', message: 'Hardware Telemetry Radio Disconnected' });
  }

  // Export Standard QGroundControl WPL 110 Waypoint File format (.waypoints)
  exportQgcWpl110(missionPlan) {
    if (!missionPlan || !missionPlan.waypoints) return '';

    let wpl = 'QGC WPL 110\n';
    missionPlan.waypoints.forEach((wp, index) => {
      const isHome = index === 0 ? 1 : 0;
      const cmd = wp.type === 'TAKEOFF' ? 22 : wp.type === 'RTH' ? 20 : wp.type === 'LAND' ? 21 : 16;
      // Format: INDEX CURRENT_WP COORD_FRAME COMMAND PARAM1 PARAM2 PARAM3 PARAM4 LATITUDE LONGITUDE ALTITUDE AUTOCONTINUE
      wpl += `${index}\t${isHome}\t3\t${cmd}\t0.000000\t0.000000\t0.000000\t0.000000\t${wp.latitude.toFixed(7)}\t${wp.longitude.toFixed(7)}\t${wp.altitude.toFixed(2)}\t1\n`;
    });
    return wpl;
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners(data) {
    this.listeners.forEach(cb => cb(data));
  }
}

export const mavlinkBridge = new MavlinkHardwareBridge();
