import { disableElement, disableElementBySelector } from '../utils/dom';
import { GitHubElement } from '../../types';

/**
 * Disable various operations on the Issue page
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
    const observer = new MutationObserver(() => {
      disableIssueControls();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
} 