// This is the popup script that runs when you click on the extension icon.
// It can access the extension's UI elements and communicate with other parts of the extension.
// For more information on Popup Script, see:
// https://developer.chrome.com/extensions/browserAction

import './popup.css';

interface CounterStorage {
  get: (cb: (count: number) => void) => void;
  set: (value: number, cb: () => void) => void;
}

interface UpdateCounterAction {
  type: 'INCREMENT' | 'DECREMENT';
}

interface CountMessage {
  type: 'COUNT';
  payload: {
    count: number;
  };
}

interface GreetingsResponse {
  message: string;
}

// This is an IIFE (Immediately Invoked Function Expression)
// We use it to avoid polluting the global namespace
(function () {
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage
  const counterStorage: CounterStorage = {
    get: (cb) => {
      chrome.storage.sync.get(['count'], (result) => {
        cb(result.count);
      });
    },
    set: (value, cb) => {
      chrome.storage.sync.set(
        {
          count: value,
        },
        () => {
          cb();
        }
      );
    },
  };

  function setupCounter(initialValue: number = 0): void {
    const counterElement = document.getElementById('counter');
    const incrementBtn = document.getElementById('incrementBtn');
    const decrementBtn = document.getElementById('decrementBtn');

    if (!counterElement || !incrementBtn || !decrementBtn) {
      console.error('Required elements not found');
      return;
    }

    counterElement.innerHTML = initialValue.toString();

    incrementBtn.addEventListener('click', () => {
      updateCounter({
        type: 'INCREMENT',
      });
    });

    decrementBtn.addEventListener('click', () => {
      updateCounter({
        type: 'DECREMENT',
      });
    });
  }

  function updateCounter({ type }: UpdateCounterAction): void {
    counterStorage.get((count) => {
      let newCount: number;

      if (type === 'INCREMENT') {
        newCount = (count || 0) + 1;
      } else if (type === 'DECREMENT') {
        newCount = (count || 0) - 1;
      } else {
        newCount = count || 0;
      }

      counterStorage.set(newCount, () => {
        const counterElement = document.getElementById('counter');
        if (!counterElement) {
          console.error('Counter element not found');
          return;
        }

        counterElement.innerHTML = newCount.toString();

        // Communicate with content script of active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tab = tabs[0];
          if (!tab.id) {
            console.error('Tab ID not found');
            return;
          }

          chrome.tabs.sendMessage(
            tab.id,
            {
              type: 'COUNT',
              payload: {
                count: newCount,
              },
            },
            () => {
              console.log('Current count value passed to contentScript file');
            }
          );
        });
      });
    });
  }

  function restoreCounter(): void {
    counterStorage.get((count) => {
      if (typeof count === 'undefined') {
        counterStorage.set(0, () => {
          setupCounter(0);
        });
      } else {
        setupCounter(count);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', restoreCounter);

  // Communicate with background file by sending a message
  chrome.runtime.sendMessage(
    {
      type: 'GREETINGS',
      payload: {
        message: 'Hello, my name is Pop. I am from Popup.',
      },
    },
    (response: GreetingsResponse) => {
      console.log(response.message);
    }
  );
})(); 