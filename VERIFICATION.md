# Verification — 9 October 2026

## Production and code checks

- `npm run check`: 0 errors, 0 warnings, 0 hints.
- `npm run build`: successful fully static output in `dist/`.
- Generated pages: homepage, 11 public project detail pages, and 404; plus robots.txt and static assets.
- `npm audit`: 0 vulnerabilities after updating the image-processing dependency.
- Original portrait retained; public WebP is about 30 KB.
- PDF copied from the supplied CV; browser test verifies byte equality with the public download.

## Browser acceptance checks

All five Playwright test groups passed in installed Chrome:

1. Both themes at 320, 375, 768, 1024, and 1440px; no document overflow; portrait loads; no page exceptions.
2. Category filters, all-project reset, theme persistence, mobile menu opening/closing, Escape handling, section navigation, and actual CV response.
3. All 11 project routes and homepage local links; CMS editors reference existing files and folders.
4. Axe automated WCAG 2 A/AA and 2.1 AA checks pass on homepage and representative project page in both themes. Reduced motion is enabled while auditing to evaluate settled colors.
5. No-JavaScript content remains readable; all public projects remain accessible; reduced motion uses the CSS fallback without a WebGL canvas.

Desktop and mobile hero captures in both themes were visually inspected. Full-page captures were generated for all requested widths. A mobile decorative-ring overflow was corrected before the passing run. These captures and machine reports are in ignored `test-results/`.

## Mobile Lighthouse on the production preview

| Category | Score |
| --- | ---: |
| Performance | 95 |
| Accessibility | 100 |
| Best Practices | 81 |
| SEO | 100 |

The only failing scored Best Practices item was HTTPS: the local machine's Kaspersky integration injected an HTTP request to `gc.kis.v2.scr.kaspersky-labs.com`. That request is absent from this repository's source and assets. No antivirus setting was changed. The audit ran against the HTTP local preview, not deployed HTTPS hosting; rerun against the final hosted address. Scores are measured local results, not a guarantee for every device or network.

The previous WebGL scene and React portrait were replaced with native Astro markup, CSS transforms, and an SVG network illustration in the October 9 performance update. The homepage no longer downloads those animation bundles or runs a WebGL canvas; React remains on the contact page for form submission.

## Hosting and content-management limits

- No public hosting deployment or GitHub repository connection has been performed. The Netlify configuration, Cloudflare instructions, and Pages CMS configuration are included.
- Production canonical URLs and the sitemap activate when the actual `SITE_URL` or site settings URL is set. A production address was not invented.
- CMS configuration was checked locally against the current documentation; sign-in, repository authorization, commit, and hosting rebuild cannot be verified until the owner connects the real repository.
- Certificate URLs/images and application screenshots were not supplied. Optional actions are hidden and project artwork is labeled conceptual.
- `Dina-ai-chatbot` and `Thermo_Glow` could not be read through the public GitHub API. Hidden drafts retain their supplied URLs.
- All three alternate project repositories were readable through the public GitHub API.

See README.md for deployment, post-hosting editing, and troubleshooting instructions.

## Contact, education, and cover update

- Added `/contact/` with the supplied public Web3Forms access key, native form fallback, required-field validation, accessible feedback, duplicate-submit protection, timeout handling, and a honeypot.
- Contact tests pass for desktop/mobile navigation, both themes at all five widths, automated WCAG AA checks, required fields, pending state, mocked successful submission and reset, API/network failures, and retained input after failure. The test harness waits for hydration before exercising AJAX. No real email was sent.
- The education journey now contains G.C.E. Advanced Level — Technology stream and BSc (Hons) in Information Technology. Activities are outside the main timeline. Taekwondo is marked extracurricular; Ballerina is a brief secondary activity.
- Nine supplied WebP covers are matched to their project entries. All are labeled conceptual artwork, and nine local image responses were verified. PlateX and Online Book Store retain the original concepts.
- All five existing portfolio test groups passed on the revised site. All four new contact/content test groups passed after correcting a test hydration race.
- The production build now produces 14 static HTML pages, including the contact page. The last original mobile Lighthouse results above predate this update.

## Professional presentation refinement

The contact page now uses a direct Contact heading, professional enquiry copy, larger field labels and input text, a simple form panel, and a restrained submit button. Decorative slogans and the numbered greeting were removed. The “Beyond the classroom” block was removed entirely, and navigation now labels the timeline Education. Activity source files remain available but are not displayed.

## Generated project-cover set

Eleven distinct conceptual covers were generated with the built-in image-generation tool, one per public project. All were visually inspected as a contact sheet and saved in the workspace. The website uses optimized 1200×800 WebP versions (approximately 68–110 KB each); full-resolution original PNGs are retained separately. Every public project now has an image, including PlateX and Online Book Store. Cover references and conceptual labels are shared by the homepage and project detail pages. Existing supplied covers were preserved. Full prompts are documented in PROJECT_COVER_PROMPTS.md.

Both targeted browser checks passed: all eleven images load after scrolling, all image URLs respond successfully, all eleven project detail routes work, and the CMS content paths remain valid. Type checks report zero errors, warnings, or hints; the static production build succeeds with all new covers included.

## Reference-inspired motion and performance update — October 9, 2026

Added twelve local SVG technology logos with gentle floating motion, a single-pass typing introduction with a static accessible equivalent, native portrait badges, and a lightweight SVG network illustration. Profile and Skills expose the new content in Pages CMS. Motion pauses outside the viewport and in background tabs; reduced motion displays the message immediately and disables decoration. Content remains usable without JavaScript. Sticky-header and badge backdrop blurs were removed, scroll height is measured outside scroll callbacks, and supported browsers use a native CSS reading-progress animation.

Removed the unused Motion, Three.js, and React Three Fiber dependencies. In the production homepage comparison, external decoded script downloads fell from 1,194,113 bytes to zero; the new homepage uses 4,396 bytes of inline JavaScript. React hydration is retained only for the contact form. Technology marks are from the Simple Icons collection; attribution is kept alongside the assets.

Desktop five-second scrolling samples recorded a 7.1 ms 95th-percentile frame interval both before and after, with no long tasks in either sample. The final mobile sample with a simulated 4× CPU slowdown recorded a 13.9 ms interval and one 310 ms long task. These are local headless-browser observations, not a guarantee of lag-free scrolling on every device. The verified improvement is substantially less script loading and removal of continuous WebGL rendering.

The final production build passes all ten browser test groups, including responsive layouts at 320–1440 px, both themes, automated WCAG AA checks, all project routes, mocked contact success/error behavior, typing completion, loaded logos, offscreen animation pausing, reduced motion, and no-JavaScript content. The contact form hydrates in both production and the restarted development preview. Type checks report zero errors, warnings, or hints; all fourteen static pages build successfully. Package audit reports zero vulnerabilities. No real form submission was sent.

## Reference-style projects, contact, and cursor update

The project section now displays three full cards per page on desktop, with rounded cover artwork, category badges, technology pills, Details/Demo and Code actions, and four pages for the eleven public projects. A Demo button is rendered only when a verified demo URL exists in project content; other entries use Details. Category filtering resets pagination. All cards remain visible without JavaScript, and the layout adapts to two columns on tablets and one on mobile.

The contact page follows the supplied visual reference: centered Let's Connect heading, purple underline and submit button, rounded email card, social icons, and stacked name/email/message fields. The existing public Web3Forms access key and submission handler remain connected; the subject is supplied as a hidden default value. A small animated cursor ring follows mouse movement and expands over controls. It preserves the native cursor, never intercepts clicks, and is disabled for touch/coarse pointers and reduced motion.

All twelve browser test groups pass, including pagination across every public project, filter resets and navigation boundaries, mobile layouts, both themes, accessibility, loaded artwork, cursor movement/reduced motion, and mocked Web3Forms success/error handling. No real email was sent. Type checks report zero errors, warnings, or hints; the fourteen-page production build succeeds.

## Optional security terminal and mini CTF

Added a header Terminal mode switch and an accessible native dialog. The portfolio remains the default. The terminal UI, React runtime, stylesheet, and public portfolio data load only after opening it; browser tests verify that none are requested beforehand. The static data endpoint derives its content from existing portfolio content and excludes the Web3Forms access key. No dependencies were added.

Portfolio commands, keyboard history and autocomplete, theme changes, actual CV download, safe text output, three fictional investigation stages, evidence locks, hints, answer validation, locally saved progress, and confirmed reset were verified. Both themes pass automated WCAG AA checks at desktop and phone widths. A simulated reduced visual viewport verifies that the command input stays visible when the phone keyboard opens; this is browser simulation rather than physical-device testing.

The full sixteen-group portfolio/terminal suite passed. After the final mobile viewport refinement, all five terminal test groups passed again, including the new keyboard-viewport check. Type checks report zero errors, warnings, or hints, and the production build succeeds with fourteen HTML pages and the static terminal-data endpoint. The CTF is a browser-side practice puzzle whose answers can be inspected in source; it does not execute system commands, scan networks, or use a backend. See TERMINAL_GUIDE.md for commands, files, and challenge-editing instructions.

## Terminal development loading fix and Node.js stack

The terminal failed in Astro development because its lazy React component was imported before the React refresh preamble. Initialize the plugin's development preamble on launch before loading the component; the production branch omits it and all terminal assets remain on demand. All five terminal test groups now pass against the development server, including the previously failing launch, keyboard controls, CTF, and accessibility checks. The earlier production-only run did not cover this development-specific failure.

Replaced OpenCV with Node.js in the skills categories and animated technology stack, using the local green Devicon Node.js SVG. Historical PlateX project technology details retain their original OpenCV attribution. The existing motion and logo-loading test passes against the updated development site.
