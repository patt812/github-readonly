import { disableElement, disableElementBySelector } from '../utils/dom';
import { GitHubElement } from '../../types';

/**
 * Issue page feature for readonly mode
 * Disables interactive elements on GitHub issue pages
 */

let observer: MutationObserver | null = null;

function disableControls(): void {
  // Disable all settings and configuration buttons
  const settingsSelectors = [
    '[data-testid="settings-button"]',
    '[aria-label*="settings"]',
    '.octicon-gear'  // Fallback for gear icons
  ];

  settingsSelectors.forEach(selector => {
    document.querySelectorAll<GitHubElement>(selector).forEach(element => {
      const button = element.closest<GitHubElement>('button, summary');
      if (button) {
        disableElement(button);
      }
    });
  });

  // Disable various interactive elements
  const controlSelectors = [
    // Assignees
    '[data-testid="assignees-menu"]',
    '[aria-label*="assign yourself"]',
    
    // Branch creation
    '[data-testid="create-branch"]',
    '[aria-label*="Create a branch"]',
    
    // Workspace
    '[data-testid="open-in-workspace"]',
    '[data-view-component="true"].Button--fullWidth',
    
    // Notifications
    '[data-testid="notifications-button"]',
    '[aria-label*="Subscribe"]',
    '[aria-label*="Unsubscribe"]',
    '[data-thread-subscribe-button]',
    
    // Labels and Projects
    '[data-testid="labels-menu"]',
    '[data-testid="projects-menu"]',

    // Development section
    '[data-testid="development"]',
    
    // Issue state changes
    '[data-testid="close-button"]',
    '[data-testid="reopen-button"]',
    '.select-menu-list',
    '.select-menu-item',
    'input[name="state_reason"]',
    'label[role="menuitemradio"]',

    // Issue management
    '.js-lock-issue',
    '.js-delete-issue',
    '.lock-toggle-link',
    'form[action*="/pin"]',
    'form[action*="/lock"]',
    'form.edit_issue',
    'button[type="submit"]',
    '.btn-link.text-bold',
    '.btn-danger'
  ];

  controlSelectors.forEach(disableElementBySelector);
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
  }
}; 