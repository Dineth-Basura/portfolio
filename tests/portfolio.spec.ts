import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import YAML from 'yaml';

test('responsive layouts, assets, and both themes',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const theme of ['dark','light']){
  await page.goto('/');await page.evaluate(t=>{localStorage.setItem('db-theme',t);document.documentElement.dataset.theme=t;},theme);
  for(const width of [320,375,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
   await expect(page.locator('h1')).toContainText('DINETH');
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   expect(await page.locator('.portrait-frame img').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
   await page.screenshot({path:`test-results/home-${theme}-${width}.png`,fullPage:true});
   if(width===375||width===1440)await page.screenshot({path:`test-results/hero-${theme}-${width}.png`});
  }
 }
 expect(errors).toEqual([]);
});
test('filters, navigation, theme persistence, and actual CV',async({page,request})=>{
 await page.goto('/');await page.getByRole('button',{name:'Cybersecurity',exact:true}).click();
 await expect(page.locator('.project-card:visible')).toHaveCount(3);await expect(page.locator('.project-count')).toHaveText('4 projects');await expect(page.locator('.project-page-status')).toHaveText('Page 1 of 2');
 await page.getByRole('button',{name:'AI / Computer Vision',exact:true}).click();
 await expect(page.locator('.project-card:visible')).toHaveCount(1);
 await page.getByRole('button',{name:'All',exact:true}).click();await expect(page.locator('.project-card:visible')).toHaveCount(3);await expect(page.locator('.project-count')).toHaveText('11 projects');await expect(page.locator('.project-page-status')).toHaveText('Page 1 of 4');
 const original=await page.locator('html').getAttribute('data-theme');await page.locator('.theme-toggle').click();await page.reload();expect(await page.locator('html').getAttribute('data-theme')).not.toBe(original);
 await page.setViewportSize({width:375,height:800});await page.locator('.menu-toggle').click();await expect(page.locator('#mobile-nav')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('#mobile-nav')).toBeHidden();
 await page.locator('.menu-toggle').click();await page.locator('#mobile-nav').getByRole('link',{name:'Projects',exact:true}).click();await expect(page.locator('#mobile-nav')).toBeHidden();expect(page.url()).toContain('#projects');
 const cv=await request.get('/cv/Dineth_Basura_CV.pdf');expect(cv.ok()).toBe(true);expect((await cv.body()).subarray(0,5).toString()).toBe('%PDF-');
 const file=fs.readFileSync('public/cv/Dineth_Basura_CV.pdf');expect(Buffer.compare(file,await cv.body())).toBe(0);
});
test('all project routes, internal links, CMS and draft controls',async({page,request})=>{
 await page.goto('/');const links=await page.locator('a[href^="/projects/"]').evaluateAll(as=>[...new Set(as.map(a=>a.getAttribute('href')!))]);expect(links).toHaveLength(11);
 for(const link of links){await page.goto(link);await expect(page.locator('h1')).toBeVisible();await expect(page.locator('.prose h2').first()).toHaveText('Overview');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.goto('/');const assets=await page.locator('a[href^="/"],img[src^="/"]').evaluateAll(es=>[...new Set(es.map(e=>e.getAttribute('href')||e.getAttribute('src')!))]);for(const url of assets){const r=await request.get(url);expect(r.ok(),url).toBe(true);}
 const cms=YAML.parse(fs.readFileSync('.pages.yml','utf8'));expect(cms.content.map((c:{name:string})=>c.name)).toEqual(['projects','certifications','experience','profile','skills','site','contact']);
 for(const c of cms.content){expect(fs.existsSync(c.path)).toBe(true);}
});
test('WCAG AA automated checks in both themes',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const theme of ['dark','light']){
  await page.goto('/');await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  await page.goto('/projects/network-port-scanner/');await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
  const detail=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(detail.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 }
});
test('no JavaScript and reduced motion remain usable',async({browser})=>{
 const ctx=await browser.newContext({javaScriptEnabled:false,viewport:{width:375,height:800}});const page=await ctx.newPage();await page.goto('http://127.0.0.1:4321/');await expect(page.locator('h1')).toBeVisible();await expect(page.locator('.project-card')).toHaveCount(11);await expect(page.locator('.project-filters')).toBeHidden();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await ctx.close();
 const reduced=await browser.newContext({reducedMotion:'reduce'});const reducedPage=await reduced.newPage();await reducedPage.goto('http://127.0.0.1:4321/');await reducedPage.locator('#about').scrollIntoViewIfNeeded();await expect(reducedPage.locator('.webgl-fallback')).toBeVisible();await expect(reducedPage.locator('.network-scene canvas')).toHaveCount(0);await reduced.close();
});
