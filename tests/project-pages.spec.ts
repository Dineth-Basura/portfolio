import {test,expect} from '@playwright/test';

test('pagination exposes every project and filters reset the page',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 const seen=new Set<string>();
 await expect(page.getByRole('button',{name:'Previous project page'})).toBeDisabled();
 for(let index=0;index<4;index++){
  await expect(page.locator('.project-page-status')).toHaveText(`Page ${index+1} of 4`);
  for(const title of await page.locator('.project-card:visible h3').allTextContents()){expect(seen.has(title)).toBe(false);seen.add(title);}
  if(index<3)await page.getByRole('button',{name:'Next project page'}).click();
 }
 expect(seen.size).toBe(11);await expect(page.getByRole('button',{name:'Next project page'})).toBeDisabled();
 await page.getByRole('button',{name:'Cybersecurity',exact:true}).click();await expect(page.locator('.project-page-status')).toHaveText('Page 1 of 2');
 await page.getByRole('button',{name:'Next project page'}).click();await expect(page.locator('.project-card:visible')).toHaveCount(1);
 await page.getByRole('button',{name:'AI / Computer Vision',exact:true}).click();await expect(page.locator('.project-page-status')).toHaveText('Page 1 of 1');await expect(page.getByRole('button',{name:'Next project page'})).toBeDisabled();
});

test('cursor responds to a mouse and respects reduced motion',async({page})=>{
 await page.goto('/');await page.mouse.move(250,300);await expect(page.locator('.cursor-accent')).toHaveClass(/cursor-visible/);
 await page.mouse.move(350,400);await expect.poll(()=>page.locator('.cursor-accent').evaluate(el=>getComputedStyle(el).transform)).toBe('matrix(1, 0, 0, 1, 350, 400)');
 expect(await page.locator('.cursor-accent').evaluate(el=>getComputedStyle(el).pointerEvents)).toBe('none');
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.cursor-accent')).toBeHidden();
});
