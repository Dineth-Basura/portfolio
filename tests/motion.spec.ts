import {test,expect} from '@playwright/test';

test('technology ticker can pause and respects reduced motion', async ({page}) => {
  await page.goto('/');
  const ticker = page.locator('.signal-track');
  const toggle = page.getByRole('button', {name:'Pause motion'});
  await toggle.scrollIntoViewIfNeeded();
  await expect(ticker).toHaveCSS('animation-play-state', 'running');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(ticker).toHaveCSS('animation-play-state', 'paused');
  await toggle.click();
  await expect(ticker).toHaveCSS('animation-play-state', 'running');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(ticker).toHaveCSS('animation-play-state', 'paused');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(toggle).toBeHidden();
  await expect(ticker).toHaveCSS('animation-name', 'none');
});
