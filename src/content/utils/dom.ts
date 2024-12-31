import { GitHubElement } from '../../types';

/**
 * Disable an element by applying visual and functional restrictions
 */
export function disableElement(element: GitHubElement): void {
  element.style.opacity = '0.5';
  element.style.cursor = 'not-allowed';
  
  if (element instanceof HTMLButtonElement || element instanceof HTMLInputElement) {
    element.setAttribute('disabled', 'true');
  } else if (element instanceof HTMLAnchorElement) {
    element.style.pointerEvents = 'none';
  }
}

/**
 * Find and disable elements that match the given selector
 */
export function disableElementBySelector(selector: string): void {
  const element = document.querySelector<GitHubElement>(selector);
  if (element) {
    disableElement(element);
  }
} 