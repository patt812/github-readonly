/**
 * Banner feature for readonly mode
 */

let banner: HTMLElement | null = null;

function createBanner(): HTMLElement {
  const element = document.createElement('div');
  element.style.cssText = `
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
  element.textContent = '🔒 Read Only Mode';
  return element;
}

export const bannerFeature = {
  enable: () => {
    if (!banner) {
      banner = createBanner();
      document.body.insertBefore(banner, document.body.firstChild);
    }
  },
  disable: () => {
    if (banner && banner.parentElement) {
      banner.parentElement.removeChild(banner);
      banner = null;
    }
  }
}; 