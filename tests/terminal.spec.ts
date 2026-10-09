import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {parseCommand} from '../src/lib/terminal/commandParser';
import {executeCommand,autocomplete} from '../src/lib/terminal/executeCommand';
import {validateAnswer} from '../src/lib/terminal/ctfValidator';
import {completionFlag} from '../src/lib/terminal/ctfChallenges';
import type {TerminalData,Session} from '../src/lib/terminal/types';

async function openTerminal(page:Page){await page.getByRole('button',{name:'Switch to terminal mode'}).click();await expect(page.getByRole('textbox',{name:'Terminal command'})).toBeFocused();}
async function run(page:Page,command:string){const input=page.getByRole('textbox',{name:'Terminal command'});await input.fill(command);await input.press('Enter');}
const encoded='aGFuZG92ZXI9TVQtMDQyOyBkZXN0aW5hdGlvbj1yZWxheS1ub3J0aDsgY29ycmVsYXRpb249UjdONA==';

test('parser, command registry, evidence locking, validation, and all three stages',async({request})=>{
 expect(parseCommand('   ')).toBeNull();expect(parseCommand('PrOjEcTs "network-port-scanner"')).toEqual({name:'projects',args:['network-port-scanner']});expect(()=>parseCommand('cat "open')).toThrow();expect(()=>parseCommand('a'.repeat(257))).toThrow();
 const response=await request.get('/terminal-data.json');expect(response.ok()).toBe(true);const data=await response.json() as TerminalData;expect(data.projects).toHaveLength(11);expect(JSON.stringify(data)).not.toContain('accessKey');
 let session:Session={stage:0,cwd:'/investigation',resetPending:false};let history:string[]=[];
 const exec=(command:string)=>{history.push(command);const result=executeCommand(command,{data,session,history,theme:'dark',now:new Date('2026-10-09T10:00:00Z')})!;if(result.session)session=result.session;return result;};
 expect(exec('whoami').text).toContain(data.profile.name);expect(exec('about').text).toContain(data.profile.bio);expect(exec('skills').text).toContain('Python');expect(exec('projects').text).toContain('meridian-transfer');expect(exec('projects platex').links?.[0].href).toBe('/projects/platex/');expect(exec('projects nonexistent').text).toContain('Unknown project');
 expect(exec('education').text).toContain('2024');expect(exec('certifications').text).toContain(data.certifications[0].title);expect(exec('contact').links?.[0].href).toBe('/contact/');expect(exec('socials').links?.[0].href).toBe(data.profile.github);expect(exec('cv').action).toBe('cv');expect(exec('date').text).toContain('2026');expect(exec('history').text).toContain('whoami');expect(exec('theme light').theme).toBe('light');expect(exec('theme nonsense').text).toContain('Usage');expect(exec('theme').text).toContain('dark');expect(exec('clear').action).toBe('clear');expect(exec('exit').action).toBe('close');expect(exec('help').text).toContain('challenge');expect(exec('help challenge').text).toContain('fictional');expect(exec('help cat').text).toContain('cat <file>');expect(exec('rm -rf /').text).toContain('Command not found');
 expect(exec('submit TX-204').text).toContain('No investigation');expect(validateAnswer(0,'MT-042')).toBe(false);expect(validateAnswer(4,'TX-204')).toBe(false);
 exec('challenge');expect(session.stage).toBe(1);expect(exec('pwd').text).toBe('/investigation');expect(exec('ls').text).toContain('memo.txt');expect(exec('cat memo.txt').text).toContain('09:00');expect(exec('cat evidence/dispatch.b64').text).toContain('locked');expect(exec('cd archive').text).toContain('locked');expect(exec('cd /etc').text).toContain('predefined');expect(exec('cat ../../etc/passwd').text).toContain('not found');expect(exec('hint').text).toContain('Hint 1');expect(exec('hint 2').text).toContain('Hint 2');expect(exec('submit wrong').text).toContain('does not match');expect(session.stage).toBe(1);
 expect(exec('submit mt-042').text).toContain('Stage 1 complete');expect(session.stage).toBe(2);exec('cd evidence');expect(exec('pwd').text).toBe('/investigation/evidence');expect(exec('ls').text).toContain('dispatch.b64');expect(exec('cat dispatch.b64').text).toBe(encoded);expect(exec('decode base64 %bad').text).toContain('not valid');expect(exec(`decode base64 ${encoded}`).text).toContain('correlation=R7N4');exec('cd ..');expect(exec('pwd').text).toBe('/investigation');expect(exec('submit R7N4').text).toContain('Stage 2 complete');expect(session.stage).toBe(3);
 expect(exec('cat archive/audit.log').text).toContain('TX-204');expect(exec('submit TX-201').text).toContain('does not match');expect(exec('submit TX-206').text).toContain('does not match');expect(exec('submit TX-204').text).toContain(completionFlag);expect(session.stage).toBe(4);expect(exec('status').text).toContain('Completed');expect(exec('submit TX-204').text).toContain('already complete');
 expect(autocomplete('who',{data,session})).toEqual(['whoami']);expect(autocomplete('projects pla',{data,session})).toEqual(['projects platex']);expect(exec('reset confirm').text).toContain('Run reset first');exec('reset');expect(session.stage).toBe(4);exec('reset cancel');expect(session.stage).toBe(4);exec('reset');exec('reset confirm');expect(session.stage).toBe(0);
});

test('terminal is optional, loads on demand, supports keyboard, themes, CV and safe text',async({page})=>{
 const requests:string[]=[];page.on('request',request=>requests.push(request.url()));const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/');await expect(page.locator('.security-terminal-dialog')).not.toBeVisible();expect(requests.some(url=>url.includes('/terminal-data.json')||url.includes('/SecurityTerminal')||url.includes('/styles/security-terminal.css')||/\/react\.[^/]+\.js/.test(url))).toBe(false);
 await openTerminal(page);expect(requests.some(url=>url.includes('/terminal-data.json'))).toBe(true);
 const input=page.getByRole('textbox',{name:'Terminal command'});await input.fill('who');await input.press('Tab');await expect(input).toHaveValue('whoami ');await input.press('Enter');await expect(page.getByRole('log')).toContainText('Dineth Basura');await input.press('ArrowUp');await expect(input).toHaveValue('whoami ');await input.press('ArrowDown');await expect(input).toHaveValue('');
 await run(page,'about');await run(page,'skills');await run(page,'projects platex');await expect(page.getByRole('log').getByRole('link',{name:'View case study'})).toHaveAttribute('href','/projects/platex/');await run(page,'education');await expect(page.getByRole('log')).toContainText('2024');await run(page,'certifications');await run(page,'contact');await run(page,'socials');await run(page,'date');await run(page,'history');
 await run(page,'theme light');await expect(page.locator('html')).toHaveAttribute('data-theme','light');await run(page,'theme dark');await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await run(page,'theme auto');
 const downloadPromise=page.waitForEvent('download');await run(page,'cv');const download=await downloadPromise;expect(download.suggestedFilename()).toBe('Dineth_Basura_CV.pdf');
 await run(page,'<img src=x onerror=alert(1)>');await expect(page.getByRole('log')).toContainText('Command not found');await expect(page.getByRole('log').locator('img')).toHaveCount(0);
 await run(page,'clear');await expect(page.locator('.terminal-entry')).toHaveCount(0);await run(page,'exit');await expect(page.locator('.security-terminal-dialog')).not.toBeVisible();await expect(page.getByRole('button',{name:'Switch to terminal mode'})).toBeFocused();
 await openTerminal(page);await page.getByRole('button',{name:'Minimize terminal'}).click();await expect(page.locator('.security-terminal-dialog')).not.toBeVisible();await openTerminal(page);await input.press('Escape');await expect(page.locator('.security-terminal-dialog')).not.toBeVisible();expect(errors).toEqual([]);
});

test('CTF solves, survives refresh, resets only with confirmation, and links to the real project',async({page})=>{
 await page.goto('/');await openTerminal(page);await run(page,'challenge');await run(page,'cat evidence/dispatch.b64');await expect(page.getByRole('log')).toContainText('locked until stage 2');await run(page,'submit MT-042');await page.reload();await openTerminal(page);
 await expect(page.getByRole('region',{name:'Investigation progress'})).toContainText('1 / 3 complete');await run(page,'challenge');await run(page,'cat evidence/dispatch.b64');await run(page,`decode base64 ${encoded}`);await expect(page.getByRole('log')).toContainText('correlation=R7N4');await run(page,'submit R7N4');await run(page,'cat archive/audit.log');await run(page,'submit TX-204');
 await expect(page.getByRole('region',{name:'Investigation complete'})).toContainText(completionFlag);await page.reload();await openTerminal(page);await expect(page.getByRole('region',{name:'Investigation complete'})).toBeVisible();
 await page.getByRole('button',{name:'Restart challenge'}).click();await page.getByRole('button',{name:'Keep progress',exact:true}).click();await expect(page.getByRole('region',{name:'Investigation complete'})).toBeVisible();await page.getByRole('button',{name:'Restart challenge'}).click();await page.getByRole('button',{name:'Confirm restart',exact:true}).click();await expect(page.getByRole('region',{name:'Investigation progress'})).toHaveCount(0);await page.reload();await openTerminal(page);await expect(page.getByRole('region',{name:'Investigation progress'})).toHaveCount(0);
 await run(page,'challenge');await run(page,'submit MT-042');await run(page,'submit R7N4');await run(page,'submit TX-204');await page.getByRole('link',{name:'View Meridian Transfer project'}).click();await expect(page).toHaveURL(/\/projects\/meridian-transfer\//);
});

test('terminal fits mobile, traps focus only while open, and passes accessibility in both themes',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const theme of ['light','dark']){
  for(const width of [320,375,1440]){
   await page.setViewportSize({width,height:850});await page.goto('/');await page.evaluate(t=>{document.documentElement.dataset.theme=t;localStorage.setItem('db-theme',t);},theme);await openTerminal(page);
   const dialog=page.locator('.security-terminal-dialog');const bounds=await dialog.boundingBox();expect(bounds!.x).toBeGreaterThanOrEqual(0);expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(width);expect(Math.abs(bounds!.x-(width-bounds!.width)/2)).toBeLessThan(2);if(width<520)expect(bounds!.height).toBeGreaterThan(800);expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
   await run(page,'challenge');await run(page,'cat transfer.log');expect(await page.locator('.terminal-output').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
   await page.getByRole('button',{name:'Close terminal'}).focus();await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.querySelector('#security-terminal-dialog')?.contains(document.activeElement))).toBe(true);
   if(width===375||width===1440)await page.screenshot({path:`test-results/terminal-${theme}-${width}.png`});
   const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
   await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();await expect(page.getByRole('button',{name:'Switch to terminal mode'})).toBeFocused();
  }
 }
});

test('terminal stays inside a reduced visual viewport with the command input visible',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:375,height:850});await page.goto('/');await openTerminal(page);await run(page,'challenge');
 await page.evaluate(()=>{Object.defineProperty(window,'visualViewport',{configurable:true,value:{height:350,offsetTop:120}});window.dispatchEvent(new Event('resize'));});
 const bounds=await page.locator('.security-terminal-dialog').boundingBox();expect(bounds!.y).toBeGreaterThanOrEqual(120);expect(bounds!.y+bounds!.height).toBeLessThanOrEqual(470);const input=await page.getByRole('textbox',{name:'Terminal command'}).boundingBox();expect(input!.y+input!.height).toBeLessThanOrEqual(bounds!.y+bounds!.height);
 await run(page,'whoami');await expect(page.getByRole('log')).toContainText('Dineth Basura');await page.getByRole('button',{name:'Close terminal'}).click();await expect(page.locator('.security-terminal-dialog')).not.toBeVisible();
});
