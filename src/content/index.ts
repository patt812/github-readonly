import { createReadOnlyBanner } from './features/banner';
import { initializeIssueControls } from './features/issue';
import { CountRequest, GreetingsResponse } from '../types';

createReadOnlyBanner();
initializeIssueControls();

// Communication with background script
chrome.runtime.sendMessage(
  {
    type: 'GREETINGS',
    payload: {
      message: 'Hello, my name is Con. I am from ContentScript.',
    },
  },
  (response: GreetingsResponse) => {
    console.log(response.message);
  }
);

// Message listener
chrome.runtime.onMessage.addListener((
  request: CountRequest,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: {}) => void
) => {
  if (request.type === 'COUNT') {
    console.log(`Current count is ${request.payload.count}`);
  }

  sendResponse({});
  return true;
}); 