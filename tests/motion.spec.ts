import {test,expect} from '@playwright/test';

test('typing completes once, logos load, and offscreen motion pauses',async({page})=>{
 await page.goto('/');
 const typed=page.locator('[data-typewriter]');
 await expect(typed).toHaveText("Hi, I'm Dineth. Let's build something secure.");
 await expect(typed).not.toHaveClass(/is-typing/);
 await expect(page.locator('.portrait-scene')).toHaveClass(/motion-visible/);
 await page.locator('.tech-stack').scrollIntoViewIfNeeded();
 await expect(page.locator('.tech-stack')).toHaveClass(/motion-visible/);
 await expect(page.locator('.portrait-scene')).not.toHaveClass(/motion-visible/);
 expect(await page.locator('.orbit-badge').first().evaluate(el=>getComputedStyle(el).animationPlayState)).toBe('paused');
 await expect(page.locator('.stack-logo img')).toHaveCount(12);
 await expect.poll(()=>page.locator('.stack-logo img').evaluateAll(images=>images.every(img=>(img as HTMLImageElement).complete&&(img as HTMLImageElement).naturalWidth>0))).toBe(true);
 await expect(page.locator('canvas')).toHaveCount(0);
 await page.locator('#contact').scrollIntoViewIfNeeded();
 await expect(page.locator('.tech-stack')).not.toHaveClass(/motion-visible/);
 expect(await page.locator('.stack-logo').first().evaluate(el=>getComputedStyle(el).animationPlayState)).toBe('paused');
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await expect(typed).toHaveText("Hi, I'm Dineth. Let's build something secure.");
 await expect(typed).not.toHaveClass(/is-typing/);
 expect(await page.locator('.orbit-badge').first().evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
});
