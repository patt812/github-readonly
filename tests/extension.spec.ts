import { test, expect } from '@playwright/test';

test.describe('GitHub Readonly Extension - Issues', () => {
  test.beforeEach(async ({ context }) => {
    // 拡張機能をONに設定
    await context.addInitScript(() => {
      window.localStorage.setItem('github-readonly-enabled', 'true');
    });

    // GitHub APIトークンを設定
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      await context.setExtraHTTPHeaders({
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      });
    }
  });

  test('should disable edit button on issue page', async ({ page }) => {
    // テスト用のIssueページにアクセス
    const testRepo = process.env.TEST_REPO || 'patt812/github-readonly-test';
    await page.goto(`https://github.com/${testRepo}/issues/1`);
    
    // ページの読み込みを待つ
    await page.waitForLoadState('networkidle');

    // Editボタンを探す
    const editButton = page.locator('button[aria-label="Edit Issue"]');
    await expect(editButton).toBeVisible();

    // ボタンが無効化されているか確認
    const isDisabled = await editButton.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.pointerEvents === 'none' || 
             el.getAttribute('aria-disabled') === 'true' ||
             style.opacity === '0.5';
    });

    expect(isDisabled).toBe(true);
  });
}); 