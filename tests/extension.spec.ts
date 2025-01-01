import { test, expect } from '@playwright/test';

test.describe('GitHub Readonly Extension - Issues', () => {
  test.beforeEach(async ({ context }) => {
    // Check environment variables
    const token = process.env.GITHUB_TOKEN;
    const testRepo = 'patt812/github-readonly-test';
    
    if (!token) {
      console.error('GITHUB_TOKEN is not set');
      throw new Error('Missing required environment variable: GITHUB_TOKEN');
    }

    // Enable extension
    await context.addInitScript(() => {
      window.localStorage.setItem('github-readonly-enabled', 'true');
    });

    // Set GitHub API token
    await context.setExtraHTTPHeaders({
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    });
  });

  test('should disable edit button on issue page', async ({ page }) => {
    const testRepo = 'patt812/github-readonly-test';
    console.log('Using test repository:', testRepo);

    // Access fixed test issue
    const issueUrl = `https://github.com/${testRepo}/issues/1`;
    console.log('Accessing URL:', issueUrl);
    
    await page.goto(issueUrl);
    await page.waitForLoadState('networkidle');

    // Find edit button
    const editButton = page.locator([
      'button[aria-label="Edit Issue"]',
      'button:has-text("Edit")',
      '.js-comment-edit-button'
    ].join(','));

    await expect(editButton).toBeVisible({ timeout: 30000 });

    // Check if button is disabled
    const isDisabled = await editButton.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.pointerEvents === 'none' || 
             el.getAttribute('aria-disabled') === 'true' ||
             style.opacity === '0.5';
    });

    expect(isDisabled).toBe(true);
  });
}); 