/**
 * Utility for managing readonly state and features
 */

// Type for feature control functions
type FeatureControl = {
  enable: () => void;
  disable: () => void;
};

// Store for registered features
const features: FeatureControl[] = [];

/**
 * Register a feature to be controlled by readonly mode
 */
export function registerFeature(control: FeatureControl): void {
  features.push(control);
}

/**
 * Enable all registered features
 */
export function enableReadonlyMode(): void {
  features.forEach(feature => feature.enable());
}

/**
 * Disable all registered features
 */
export function disableReadonlyMode(): void {
  features.forEach(feature => feature.disable());
}

/**
 * Initialize readonly mode
 */
export function initialize(): void {
  chrome.storage.sync.get(['readonly'], (result) => {
    const enabled = result.readonly ?? false;
    if (enabled) {
      enableReadonlyMode();
    } else {
      disableReadonlyMode();
    }
  });

  // Listen for state changes
  chrome.runtime.onMessage.addListener((
    message: { type: string; payload?: { enabled: boolean } },
    sender,
    sendResponse
  ) => {
    if (message.type === 'READONLY_CHANGED' && message.payload) {
      if (message.payload.enabled) {
        enableReadonlyMode();
      } else {
        disableReadonlyMode();
      }
    }
    sendResponse({});
    return true;
  });
} 