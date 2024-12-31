import { disableElement, disableElementBySelector } from '../utils/dom';
import { GitHubElement } from '../../types';

let observer: MutationObserver | null = null;

/**
 * Disable operations on the Issue page
 */
export function disableIssueControls(): void {
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

/**
 * Initialize controls for the Issue page
 */
export function initializeIssueControls(): void {
  if (window.location.pathname.includes('/issues/')) {
    disableIssueControls();
    
    // Observe DOM changes to handle dynamic content
    if (!observer) {
      observer = new MutationObserver(() => {
        disableIssueControls();
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }
}

/**
 * Remove controls from the Issue page
 */
export function removeIssueControls(): void {
  // Stop observing DOM changes
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // TODO: Restore disabled elements
  // This will require keeping track of which elements were disabled
  // For now, page refresh will restore the original state
} 