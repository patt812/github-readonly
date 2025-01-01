import { disableElement, disableElementBySelector } from '../utils/dom';
import { GitHubElement } from '../../types';

/**
 * Pull request page feature for readonly mode
 * Disables interactive elements on GitHub pull request pages
 */

let observer: MutationObserver | null = null;

function disableControls(): void {
  // Add direct element handling for popovertarget buttons
  document.querySelectorAll<GitHubElement>('button[popovertarget]').forEach(button => {
    disableElement(button);
    // Remove popovertarget to prevent the popup from showing
    button.removeAttribute('popovertarget');
    button.removeAttribute('aria-haspopup');
  });

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

  // Disable various interactive elements except CI details links
  const controlSelectors = [
    // Title edit
    '.js-title-edit-button',
    'button[aria-label="Edit Pull Request title"]',
    
    // Reviewers
    '[data-testid="reviewers-menu"]',
    '[aria-label*="request review"]',
    
    // Assignees
    '[data-testid="assignees-menu"]',
    '[aria-label*="assign yourself"]',
    'button.js-issue-assign-self',  // Assign yourself button
    'button[name="issue[user_assignee_ids][]"]',  // Assign button by name attribute
    '.Link--muted.Link--inTextBlock.js-issue-assign-self',  // Assign link with specific classes
    
    // Branch management
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
    
    // Draft PR upgrade
    'a[data-test-selector="upgrade_cta_move_work"]',  // Upgrade button in draft PR
    'a[href*="/move_work/new?feature=draft_prs"]',  // Alternative upgrade link
    '.Button--secondary[aria-label*="Upgrade your GitHub membership"]',  // Upgrade button by aria-label
    
    // Pull request state changes
    '[data-testid="close-button"]',
    '[data-testid="reopen-button"]',
    'input[name="state_reason"]',
    'label[role="menuitemradio"]',
    'button[name="comment_and_close"]',  // Close PR button
    '.js-comment-and-button',  // Alternative close button

    // Pull request management
    '.js-lock-issue',
    '.js-delete-issue',
    '.lock-toggle-link',
    'form[action*="/pin"]',
    'form[action*="/lock"]',
    'form.edit_issue',
    
    // Merge related controls
    '.merge-pr button',
    '.js-merge-commit-button',
    '.js-merge-box button',
    '.js-merge-box input',
    '.js-merge-box textarea',
    '.js-merge-method-menu',
    '.js-update-branch-button',

    // Review management
    'form[action*="/re-request-review"]',
    '.js-details-target[role="menuitem"]',  // Dismiss review button
    'button[name="re_request_reviewer_id"]',  // Re-request review button in sidebar
    'button[id^="re-request-review-"]',  // Re-request review button by ID
    'a[href*="/codespaces/new"][target="_blank"][data-view-component="true"].Button--secondary',  // Review in codespace button
    'a[href*="/codespaces/new"][aria-label="Review this pull request in a codespace"]',  // Alternative codespace button
    '.diffbar-item.dropdown a[href*="/codespaces/new"]',  // Another codespace button variant
    'button[data-test-selector="create-codespace-plus-in-header"]',  // Create codespace plus button
    'button.js-toggle-hidden[data-hydro-click*="codespace_create.click"]',  // Alternative plus button selector

    // Comment actions (except copy and view)
    '.js-comment-edit-button',
    '.js-comment-hide-button',
    '.js-comment-delete',
    '.js-comment-quote-reply',
    'button[type="submit"].menu-item-danger',  // Delete button
    '.dropdown-item:not([href*="pullrequestreview"]):not(clipboard-copy)',  // All dropdown items except "See review" and copy
    '.js-add-file-comment',  // Add review comment button
    'button.Button--iconOnly.js-add-file-comment',  // Alternative add review comment button
    '.Button--invisible.js-add-file-comment',  // Another variant of add review comment button
    
    // Reference in new issue
    'details-dialog[aria-label="Reference in new issue"] button',
    'details-dialog[aria-label="Reference in new issue"] input',
    'details-dialog[aria-label="Reference in new issue"] textarea',

    // Conversation actions
    'button[data-hydro-click*="resolvable_threads.resolve"]',  // Resolve conversation button
    'button[data-hydro-click*="resolvable_threads.unresolve"]',  // Unresolve conversation button
    '.Button--secondary[data-disable-with*="Resolving"]',  // Alternative resolve button
    '.Button--secondary[data-disable-with*="Unresolving"]',  // Alternative unresolve button

    // Comment submit buttons
    '.btn-primary[type="submit"]',  // Comment submit button
    'button[data-disable-invalid]',  // Alternative submit button
    'file-attachment input[type="file"]'  // File upload input
  ];

  // First, disable all interactive elements
  controlSelectors.forEach(disableElementBySelector);

  // Then, re-enable specific elements
  const enableSelectors = [
    // CI details links
    '.merge-status-item .status-actions',
    // Toggle buttons for checks and reviewers
    '.js-details-target:has(.statuses-toggle-opened)',
    // See review links
    '.dropdown-item[href*="pullrequestreview"]',
    // Copy link buttons
    'clipboard-copy.dropdown-item'
  ];

  enableSelectors.forEach(selector => {
    document.querySelectorAll<GitHubElement>(selector).forEach(element => {
      if (element.style) {
        element.style.pointerEvents = 'auto';
        element.style.opacity = '1';
        element.style.cursor = 'pointer';
      }
      element.removeAttribute('disabled');
      element.removeAttribute('aria-disabled');
    });
  });

  // Disable specific action buttons in the timeline
  const actionButtons = document.querySelectorAll<GitHubElement>(
    '.timeline-comment-actions button, .timeline-comment-actions a'
  );
  actionButtons.forEach(button => {
    if (!button.closest('.merge-status-item')) {
      disableElement(button);
    }
  });
}

export const pullRequestFeature = {
  enable: () => {
    if (window.location.pathname.includes('/pull/')) {
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