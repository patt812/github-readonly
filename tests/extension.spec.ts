import { test, expect } from '@playwright/test';

test.describe('GitHub Readonly Extension', () => {
  test('should load GitHub homepage', async ({ page }) => {
    // GitHub APIトークンを設定
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      await page.setExtraHTTPHeaders({
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      });
    }

    // GitHubのホームページに移動
    await page.goto('https://github.com');
    
    // ページタイトルを確認
    const title = await page.title();
    expect(title).toContain('GitHub');
  });
}); 