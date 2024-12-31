// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

interface CountRequest {
  type: 'COUNT';
  payload: {
    count: number;
  };
}

interface GreetingsResponse {
  message: string;
}

// Create and insert readonly banner
function createReadOnlyBanner(): void {
  const banner = document.createElement('div');
  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #ff5252;
    color: white;
    text-align: center;
    padding: 8px;
    font-weight: bold;
    z-index: 9999;
  `;
  banner.textContent = '🔒 Read Only Mode';
  document.body.insertBefore(banner, document.body.firstChild);
}

// Add banner when page loads
createReadOnlyBanner();

// Log `title` of current active web page
const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(
  `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
);

// Communicate with background file by sending a message
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

// Listen for message
chrome.runtime.onMessage.addListener((
  request: CountRequest,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: {}) => void
) => {
  if (request.type === 'COUNT') {
    console.log(`Current count is ${request.payload.count}`);
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});