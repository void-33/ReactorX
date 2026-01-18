import { Step } from "@/lib/types";

export const ammoniaProcedure: Step[] = [
  // Assembly of equipment
  { id: 1, task: 'create', execution: 'instant', labitem: 'tank', params: { subtype: 'N2_tank', name: 'N2' }, pre: [] },
  { id: 2, task: 'create', execution: 'instant', labitem: 'tank', params: { subtype: 'H2_tank', name: 'H2' }, pre: [] },
  { id: 3, task: 'create', execution: 'instant', labitem: 'compressor', params: { name: 'Compressor1' }, pre: [] },
  { id: 4, task: 'create', execution: 'instant', labitem: 'reactor', params: { name: 'Reactor1' }, pre: [] },
  { id: 5, task: 'create', execution: 'instant', labitem: 'condenser', params: { name: 'Condenser1' }, pre: [] },
  { id: 6, task: 'create', execution: 'instant', labitem: 'valve', params: { name: 'V_feed' }, pre: [] },
  { id: 7, task: 'create', execution: 'instant', labitem: 'valve', params: { name: 'V_recycle' }, pre: [] },

  // Connections
  { id: 8, task: 'connect', execution: 'instant', params: { from: 'N2', to: 'Compressor1', via: 'V_feed' }, pre: [1,3,6], 
    completionEvents: [{ type: 'set_color', labitem: 'pipe', color: '#0f0' }] },
  { id: 9, task: 'connect', execution: 'instant', params: { from: 'H2', to: 'Compressor1' }, pre: [2,3],
    completionEvents: [{ type: 'set_color', labitem: 'pipe', color: '#0ff' }] },
  { id: 10, task: 'connect', execution: 'instant', params: { from: 'Compressor1', to: 'Reactor1' }, pre: [3,4],
    completionEvents: [{ type: 'set_color', labitem: 'pipe', color: '#ff0' }] },
  { id: 11, task: 'connect', execution: 'instant', params: { from: 'Reactor1', to: 'Condenser1' }, pre: [4,5],
    completionEvents: [{ type: 'set_color', labitem: 'pipe', color: '#f90' }] },
  { id: 12, task: 'connect', execution: 'instant', params: { from: 'Condenser1', to: 'Recycle', via: 'V_recycle' }, pre: [5,7],
    completionEvents: [{ type: 'set_color', labitem: 'pipe', color: '#09f' }] },

  // Pre-commissioning: purge compressor
  { id: 13, task: 'purge', execution: 'duration', target: 'Compressor1', params: { duration: 5 }, pre: [8,9],
    completionEvents: [
      { type: 'emit_message', message: 'Purging compressor...' },
      { type: 'show_animation', target: 'Compressor1', animation: 'spin' }
    ]
  },

  // Start compressor
  { id: 14, task: 'start_equipment', execution: 'instant', target: 'Compressor1', pre: [13],
    completionEvents: [
      { type: 'emit_message', message: 'Compressor started' },
      { type: 'set_color', labitem: 'compressor', color: '#0f0' }
    ]
  },

  // Set reactor pressure
  { id: 15, task: 'set_pressure', execution: 'modal', target: 'Reactor1', params: { setpoint: 150 }, pre: [14],
    errorMessage: { type: 'emit_message', message: 'Set reactor pressure to 150 bar' },
    completionEvents: [
      { type: 'emit_message', message: 'Pressure set' },
      { type: 'set_volume', labitem: 'reactor', volume: 150 } // visualize pressure level
    ]
  },

  // Set reactor temperature
  { id: 16, task: 'set_temperature', execution: 'modal', target: 'Reactor1', startTemperature: 100, targetTemperature: 450, params: { setpoint: 450 }, pre: [15],
    completionEvents: [
      { type: 'emit_message', message: 'Heating reactor...' },
      { type: 'show_animation', target: 'Reactor1', animation: 'steam' }
    ]
  },

  // Monitor reaction conversion until target
  { id: 17, task: 'monitor_until', execution: 'duration', params: { sensor: 'conversion', threshold: 0.12, timeout: 300 }, pre: [16],
    completionEvents: [
      { type: 'emit_message', message: 'Monitoring reaction...' },
      { type: 'set_color', labitem: 'reactor', color: '#f0f' }
    ]
  },

  // Collect product in storage
  { id: 18, task: 'collect', execution: 'instant', target: 'Condenser1', params: { destination: 'product_tank' }, pre: [17],
    completionEvents: [
      { type: 'emit_message', message: 'Product collected' },
      { type: 'set_color', labitem: 'storagetank', color: '#ff0' }
    ]
  }
];
