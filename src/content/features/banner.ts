/**
 * Create and insert a banner for read-only mode
 */
export function createReadOnlyBanner(): void {
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