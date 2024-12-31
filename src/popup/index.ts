// This is the popup script that runs when you click on the extension icon.
// It can access the extension's UI elements and communicate with other parts of the extension.
// For more information on Popup Script, see:
// https://developer.chrome.com/extensions/browserAction

import './styles/index.css';

interface ReadonlyStorage {
  get: (cb: (enabled: boolean) => void) => void;
  set: (value: boolean, cb: () => void) => void;
}

// Storage API wrapper
const readonlyStorage: ReadonlyStorage = {
  get: (cb) => {
    chrome.storage.sync.get(['readonly'], (result) => {
      cb(result.readonly ?? false);
    });
  },
  set: (value, cb) => {
    chrome.storage.sync.set(
      {
        readonly: value,
      },
      () => {
        cb();
      }
    );
  },
};

// Initialize toggle state
function initializeToggle(): void {
  const toggle = document.getElementById('readonlyToggle') as HTMLInputElement;
  if (!toggle) {
    console.error('Toggle element not found');
    return;
  }

  // Restore state
  readonlyStorage.get((enabled) => {
    toggle.checked = enabled;
  });

  // Handle toggle changes
  toggle.addEventListener('change', () => {
    const enabled = toggle.checked;
    readonlyStorage.set(enabled, () => {
      // Notify content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab.id) {
          console.error('Tab ID not found');
          return;
        }

        chrome.tabs.sendMessage(
          tab.id,
          {
            type: 'READONLY_CHANGED',
            payload: {
              enabled,
            },
          }
        );
      });
    });
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeToggle); 