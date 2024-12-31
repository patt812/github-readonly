// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

interface MessageRequest {
  type: string;
  payload: {
    message: string;
  };
}

// Background script for managing extension state
// For more information, see:
// https://developer.chrome.com/extensions/background_pages

// Update icon based on readonly state
function updateIcon(enabled: boolean): void {
  const iconPath = enabled
    ? {
        16: 'icons/icon_16_active.png',
        48: 'icons/icon_48_active.png',
        128: 'icons/icon_128_active.png',
      }
    : {
        16: 'icons/icon_16.png',
        48: 'icons/icon_48.png',
        128: 'icons/icon_128.png',
      };

  chrome.action.setIcon({ path: iconPath });
}

// Initialize extension state for a tab
function initializeTab(tabId: number): void {
  chrome.storage.sync.get(['readonly'], (result) => {
    const enabled = result.readonly ?? false;
    updateIcon(enabled);

    // Notify content script of current state
    chrome.tabs.sendMessage(tabId, {
      type: 'READONLY_CHANGED',
      payload: {
        enabled,
      },
    });
  });
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('github.com')) {
    initializeTab(tabId);
  }
});

// Listen for readonly state changes
chrome.runtime.onMessage.addListener((
  message: { type: string; payload?: { enabled: boolean } },
  sender,
  sendResponse
) => {
  if (message.type === 'READONLY_CHANGED' && message.payload) {
    updateIcon(message.payload.enabled);
  }
  sendResponse({});
  return true;
}); 