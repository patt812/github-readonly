import { GitHubElement } from '../../types';

/**
 * Disable an element by applying visual and functional restrictions
 * Prevents all interactions including clicks, focus, and keyboard events
 */
export function disableElement(element: GitHubElement): void {
  // Visual feedback
  element.style.opacity = '0.5';
  element.style.cursor = 'not-allowed';
  element.style.pointerEvents = 'auto';
  
  // Prevent focus
  element.setAttribute('tabindex', '-1');
  
  // Prevent default actions
  const preventDefaultAndStop = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Add event listeners to prevent all interactions
  element.addEventListener('click', preventDefaultAndStop, true);
  element.addEventListener('mousedown', preventDefaultAndStop, true);
  element.addEventListener('mouseup', preventDefaultAndStop, true);
  element.addEventListener('keydown', preventDefaultAndStop, true);
  element.addEventListener('keyup', preventDefaultAndStop, true);
  
  // Disable form elements
  if (element instanceof HTMLButtonElement || element instanceof HTMLInputElement) {
    element.disabled = true;
  }
  
  // Disable links
  if (element instanceof HTMLAnchorElement) {
    // Remove link functionality
    element.href = 'javascript:void(0)';
  }

  // Disable summary elements (dropdowns)
  if (element instanceof HTMLElement && element.tagName.toLowerCase() === 'summary') {
    const details = element.closest('details');
    if (details) {
      details.open = false;
      details.style.pointerEvents = 'auto';
    }
  }
}

/**
 * Find and disable elements that match the given selector
 */
export function disableElementBySelector(selector: string): void {
  document.querySelectorAll<GitHubElement>(selector).forEach(disableElement);
} 