//src/deviceActionsConfig.ts

export interface DeviceConfig {
  actions: string[];
  defaultCommand: string | null;
}

// Define the type for the config object
export interface DeviceActionsConfig {
  [key: string]: DeviceConfig;
}

export const deviceActionsConfig: DeviceActionsConfig = {
  light: {
    actions: ['Turn On', 'Turn Off', 'Dim'],
    defaultCommand: null,
  },
  ac: {
    actions: ['Turn On', 'Turn Off', 'IncreaseTemp', 'DecreaseTemp', 'Fan'],
    defaultCommand: null,
  },
  moon_light: {
    actions: ['Turn On', 'Turn Off'],
    defaultCommand: 'moon_light',
  },
  refrigerator: {
    actions: ['Turn On', 'Turn Off'],
    defaultCommand: null,
  },
};

