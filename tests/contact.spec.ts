import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('contact page navigation, responsive layouts, and accessible form',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.locator('.desktop-nav').getByRole('link',{name:'Contact',exact:true}).click();await expect(page).toHaveURL(/\/contact\/$/);
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const theme of ['dark','light']){
  for(const width of [320,375,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto('/contact/');await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);await page.evaluate(()=>document.fonts.ready);
   await expect(page.getByLabel('Your name')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   if(width===375||width===1440)await page.screenshot({path:`test-results/contact-${theme}-${width}.png`,fullPage:true});
  }
  const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 }
 await page.setViewportSize({width:375,height:800});await page.goto('/');await page.locator('.menu-toggle').click();await page.locator('#mobile-nav').getByRole('link',{name:'Contact',exact:true}).click();await expect(page).toHaveURL(/\/contact\/$/);
 expect(errors).toEqual([]);
});
test('required fields, sending state, one request, success, and reset',async({page})=>{
 let requests=0;let payload='';let release:()=>void=()=>{};const gate=new Promise<void>(resolve=>release=resolve);
 await page.route('https://api.web3forms.com/submit',async route=>{requests++;payload=route.request().postData()||'';await gate;await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:true})});});
 await page.goto('/contact/');await expect(page.locator('astro-island[ssr]')).toHaveCount(0);await page.getByRole('button',{name:'Send message',exact:true}).click();expect(requests).toBe(0);
 await page.getByLabel('Your name').fill('Portfolio browser test');await page.getByLabel('Email address').fill('browser-test@example.com');await page.getByLabel('Your message').fill('This is a mocked UI test. No email is sent.');
 await page.getByRole('button',{name:'Send message',exact:true}).click();await expect(page.getByRole('button',{name:'Sending…',exact:true})).toBeDisabled();await expect.poll(()=>requests).toBe(1);expect(payload).toContain('name="access_key"');expect(payload).toContain('New portfolio enquiry');expect(payload).not.toContain('name="redirect"');
 release();await expect(page.getByRole('status')).toContainText('Your message has been sent');await expect(page.getByLabel('Your name')).toHaveValue('');await expect(page.getByRole('button',{name:'Send message',exact:true})).toBeEnabled();
});
test('API and network errors retain the message for retry',async({page})=>{
 await page.route('https://api.web3forms.com/submit',route=>route.fulfill({status:400,contentType:'application/json',body:JSON.stringify({success:false})}));
 await page.goto('/contact/');await expect(page.locator('astro-island[ssr]')).toHaveCount(0);await page.getByLabel('Your name').fill('Test');await page.getByLabel('Email address').fill('browser-test@example.com');await page.getByLabel('Your message').fill('Keep this message.');await page.getByRole('button',{name:'Send message',exact:true}).click();await expect(page.getByRole('status')).toContainText("couldn't be sent");await expect(page.getByLabel('Your message')).toHaveValue('Keep this message.');
 await page.unroute('https://api.web3forms.com/submit');await page.route('https://api.web3forms.com/submit',route=>route.abort('failed'));await page.getByRole('button',{name:'Send message',exact:true}).click();await expect(page.getByRole('status')).toContainText("couldn't be sent");await expect(page.getByRole('button',{name:'Send message',exact:true})).toBeEnabled();await expect(page.getByLabel('Your message')).toHaveValue('Keep this message.');
});
test('education ordering, supplied covers, and conceptual labels',async({page,request})=>{
 await page.goto('/');const entries=page.locator('#experience .timeline-item');await expect(entries).toHaveCount(2);await expect(entries.nth(0)).toContainText('G.C.E. Advanced Level');await expect(entries.nth(0)).toContainText('Technology stream');await expect(entries.nth(1)).toContainText('BSc (Hons) in Information Technology');await expect(page.locator('#about .education-note')).toContainText('Sri Lanka Institute');await expect(page.locator('.activities-block')).toHaveCount(0);
 const images=page.locator('.project-image-link img');await expect(images).toHaveCount(11);for(const src of await images.evaluateAll(es=>es.map(e=>e.getAttribute('src')!))){expect(src).toMatch(/-v2\.webp$/);expect((await request.get(src)).ok()).toBe(true);}for(let pageIndex=0;pageIndex<4;pageIndex++){for(const image of await page.locator('.project-card:visible .project-image-link img').all()){await image.scrollIntoViewIfNeeded();await expect.poll(()=>image.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);}if(pageIndex<3)await page.getByRole('button',{name:'Next project page',exact:true}).click();}
 await expect(page.locator('.project-image-label').filter({hasText:'CONCEPT VISUAL'})).toHaveCount(11);await expect(page.locator('#experience .timeline')).not.toContainText('Ballerina');
 await page.goto('/projects/network-port-scanner/');await expect(page.locator('.detail-visual img')).toHaveAttribute('src',/network-port-scanner-v2.webp$/);await expect(page.locator('.concept-note')).toBeVisible();
});
