import { createReadOnlyBanner } from './features/banner';
import { initializeIssueControls, removeIssueControls } from './features/issue';

interface ReadonlyMessage {
  type: 'READONLY_CHANGED';
  payload: {
    enabled: boolean;
  };
}

let banner: HTMLElement | null = null;
let isReadonlyMode = false;

// Initialize based on stored state
function initialize(): void {
  chrome.storage.sync.get(['readonly'], (result) => {
    const enabled = result.readonly ?? false;
    isReadonlyMode = enabled;
    if (enabled) {
      enableReadonlyMode();
    } else {
      disableReadonlyMode();
    }
  });
}

// Message listener for state changes
chrome.runtime.onMessage.addListener((
  message: ReadonlyMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: {}) => void
) => {
  if (message.type === 'READONLY_CHANGED') {
    isReadonlyMode = message.payload.enabled;
    if (message.payload.enabled) {
      enableReadonlyMode();
    } else {
      disableReadonlyMode();
    }
  }

  sendResponse({});
  return true;
});

function enableReadonlyMode(): void {
  if (!banner) {
    banner = createReadOnlyBanner();
  }
  initializeIssueControls();
}

function disableReadonlyMode(): void {
  if (banner && banner.parentElement) {
    banner.parentElement.removeChild(banner);
    banner = null;
  }
  removeIssueControls();
}

// Start initialization
initialize(); 