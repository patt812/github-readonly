import { disableElement, disableElementBySelector } from '../utils/dom';
import { GitHubElement } from '../../types';

/**
 * Issue page feature for readonly mode
 */

let observer: MutationObserver | null = null;

function disableControls(): void {
  // Disable settings icon
  document.querySelectorAll<GitHubElement>('.octicon-gear').forEach((element) => {
    const button = element.closest<GitHubElement>('button');
    if (button) {
      disableElement(button);
    }
  });

  // Disable various links and buttons
  const selectors = [
    'a[href*="assign yourself"]',
    'a[href*="Create a branch"]',
    'button[data-testid*="open-in-workspace"]',
    'button[aria-label*="Unsubscribe"]'
  ];

  selectors.forEach(disableElementBySelector);
}

export const issueFeature = {
  enable: () => {
    if (window.location.pathname.includes('/issues/')) {
      disableControls();
      
      // Observe DOM changes to handle dynamic content
      if (!observer) {
        observer = new MutationObserver(() => {
          disableControls();
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
    }
  },
  disable: () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    // TODO: Restore disabled elements
    // This will require keeping track of which elements were disabled
    // For now, page refresh will restore the original state
  }
}; 