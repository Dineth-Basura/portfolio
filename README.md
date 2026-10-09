# Dineth Basura — personal portfolio

A fully static portfolio with an editorial dark/light design, the original portrait, interactive technology badges, project filters, 11 public project detail pages with individually generated covers, three certifications, an education timeline, a downloadable CV, and a dedicated Web3Forms contact page.

## Stack

Astro 7 static output; React 19 for the contact form and optional on-demand Security Terminal; strict TypeScript; Tailwind CSS 4 with custom CSS tokens; native CSS animations and an SVG About graphic; local technology logos; Lucide icons; Astro Content Collections; JSON profile/settings/skills; Markdown case studies; Pages CMS. Fonts are hosted locally. No database, runtime server, or public admin route. The default homepage does not load React or a WebGL renderer. The terminal loads only when its header switch is opened. See [TERMINAL_GUIDE.md](TERMINAL_GUIDE.md) for commands, the fictional Mini CTF, implementation files, and editing instructions.

GSAP and Drei are intentionally omitted because these interactions do not require them. The actual portrait remains intact. Project artwork is conceptual, clearly labeled, and never presented as an application screenshot.

## Run locally

Install Node.js 24 LTS. In PowerShell:

```powershell
cd D:\portfolio
npm.cmd ci
npm.cmd run dev
```

Open the URL printed by Astro, normally `http://127.0.0.1:4321/`. Stop with Ctrl+C.

```powershell
npm.cmd run check
npm.cmd run build
npm.cmd run preview
```

`dist/` is the complete deployable site. Project paths have their own generated HTML. Do not add a catch-all SPA redirect: it would hide real 404 errors. No continuously running server is required after deployment.

## Browser checks

With the preview or development server running in another terminal:

```powershell
npm.cmd run test
```

The test configuration uses installed Google Chrome. To use Playwright's own Chromium instead, remove `channel: 'chrome'` in `playwright.config.ts` and run `npx.cmd playwright install chromium`. `TEST_URL` can point the tests at another running preview; the no-JavaScript test currently uses the default local URL.

Tests cover 320, 375, 768, 1024, and 1440px, both themes, overflow, portrait assets, filters, mobile navigation, theme persistence, PDF byte equality, all project routes, local links, CMS content paths, reduced motion, no-JavaScript usability, and automated WCAG AA checks. Screenshots and results are written to ignored `test-results/`. Automated accessibility checks do not replace human review.

## Create and connect your GitHub repository

1. Sign in to GitHub and create an empty repository, for example `dineth-portfolio`. Do not initialize it with a README because this folder already contains one.
2. In this folder, initialize and push. Replace the remote below with the repository URL you actually created:

```powershell
git init
git add .
git commit -m "Build Dineth Basura portfolio"
git branch -M main
git remote add origin https://github.com/Dineth-Basura/dineth-portfolio.git
git push -u origin main
```

The example remote is documentation only; it is not configured or shown as a working website link. `node_modules`, temporary files, build output, and test output are ignored. Commit `package-lock.json` and `.pages.yml`.

## Deploy to Netlify

1. Sign in to Netlify; choose Add new project / Import an existing project and connect GitHub.
2. Authorize access to the portfolio repository and choose the `main` branch.
3. Use the root directory, build command `npm run build`, and publish directory `dist`. The included `netlify.toml` supplies these values and Node 24.
4. Deploy. Netlify supplies an HTTPS address.
5. Add a build environment variable `SITE_URL` equal to that full HTTPS address, or set `url` in `src/data/site.json`. Trigger another deployment. Canonical URLs, absolute sharing-image URLs, sitemap, and the robots sitemap directive now use the real address.
6. Optionally add your custom domain in Netlify's domain settings and update `SITE_URL` to the primary address.

Every commit to `main`, including a Pages CMS edit, triggers a new static build when Git integration is enabled. No Astro server adapter is needed for this static output. See [Astro on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/astro/).

## Deploy to Cloudflare Pages

1. In Cloudflare's Workers & Pages dashboard, create a Pages project and connect GitHub.
2. Select the portfolio repository and production branch `main`.
3. Set build command `npm run build`, output directory `dist`, and root directory to the repository root.
4. Set `NODE_VERSION` to `24`; deploy.
5. Set `SITE_URL` to the assigned HTTPS address (or your custom domain), then rebuild.
6. Add a custom domain through the project's domain settings when ready, and update `SITE_URL`.

Cloudflare serves the generated files, including nested project pages and `404.html`. `_headers` provides caching and basic response headers. See [Cloudflare's Astro deployment guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/).

## Edit after hosting with Pages CMS

1. Open [Pages CMS](https://app.pagescms.org/) and sign in with your authorized GitHub account.
2. Authorize the Pages CMS GitHub integration for your portfolio repository and select the repository and deployed branch, usually `main`.
3. The root `.pages.yml` exposes seven editors: Projects, Certifications, Education/experience/activities, Profile, Skills, Site settings, and Contact page & Web3Forms.
4. Edit an entry and save. Pages CMS commits the changes to GitHub; Netlify or Cloudflare Pages rebuilds. Wait for the successful deployment before refreshing the public site.

This repository includes the real configuration. Account authorization, choosing the remote repository, and enabling the hosting connection still happen in your accounts. There is no `/admin` route on the public website. Configuration is based on the [Pages CMS content documentation](https://pagescms.org/docs/configuration/content/) and [media documentation](https://pagescms.org/docs/configuration/media/).

### Projects

Use the Projects editor to add, edit, delete, or feature entries. Change `order` to reorder (lower numbers first); featured entries appear first on the homepage. Set `visible: false` to hide an entry and prevent its detail route from being generated.

Edit title, category, summary, date, technologies, repository, optional demo, artwork style, cover image and alt text, cover image type, additional repositories, screenshots and captions. Set cover image type to `concept` for illustrations or `screenshot` only for actual application captures. All eleven generated covers are labeled conceptual artwork. The rich-text body becomes the case study. Add headings such as Objective, Architecture, Challenges, or Lessons learned only when you have real information. New Markdown filenames determine the URL, so keep published filenames stable.

### Certifications

Change title, issuer, ordering, visibility, optional issue date, credential ID, real HTTPS verification URL, image, description, and skills. Verification buttons appear only when a URL is present. Upload an image to enable a certificate preview; do not invent URLs or dates. Remove entries through the CMS or set visibility false. Featured status is stored for future presentation choices; ordering controls the current gallery.

### Profile and skills

The Profile editor controls the name, professional role, status, headline, introductory text, biography, email, location, social URLs, portrait path/alt text, and up to six orbit labels. Line breaks in the headline create separate lines. Skills controls category cards, descriptive text, icons, and lists; there are no fabricated proficiency percentages.

The Education/activities editor supports additional entries or genuine future internships using `kind: Experience`. The main journey shows Education and Experience entries. It currently shows G.C.E. Advanced Level in the Technology stream, followed by the BSc (Hons) in Information Technology. No school or Advanced Level dates were invented. The extracurricular display has been removed at the owner's request; the Taekwondo and Ballerina content files are retained for optional future use and are not rendered. The About education block uses the last Education entry by display order. The Site settings editor controls SEO text, section titles, navigation labels, the public URL, section visibility, sharing image, and CV path.

### Contact page and form

The dedicated `/contact/` page is linked from the desktop/mobile navigation and homepage contact section. Its form posts directly to `https://api.web3forms.com/submit`, using the owner's provided access key in `src/data/contact.json`. Use Contact page & Web3Forms in Pages CMS to change the key, headings, field labels, messages, and other contact-page copy. The [Web3Forms documentation](https://docs.web3forms.com/getting-started/faq) identifies this access key as public and suitable for client-side forms.

The form validates required fields, disables the send button during submission, includes a honeypot, handles API/network errors and a 15-second timeout, clears fields only after success, and retains entered text after failure. Email remains available as a direct alternative. Without JavaScript, the native HTML form posts to Web3Forms and uses its confirmation page. There is no custom server or database; submissions are handled by the third-party email service.

Automated tests intercept the endpoint and exercise success and failure without sending real emails. Live delivery and the receiving inbox must be checked with a genuine message after hosting; no test email was sent during implementation.

### Replace the portrait

Upload an image through the Profile portrait field (Images media source) and select it. Use a portrait with a similar 5:6 aspect ratio for the best framing, preferably WebP around 760px wide. Keep the real photo intact. Alt text should describe the photo. Saving the profile triggers redeployment; React code does not need editing. The supplied original PNG is retained in `public/images/portrait-original.png`.

### Replace the CV

Use Site settings → CV to upload/select a PDF from the Documents media source. The resulting public path is written to the settings file, and every download link follows it automatically. To retain the existing URL, replace `public/cv/Dineth_Basura_CV.pdf` with the new PDF using GitHub's file upload interface. Commit and wait for redeployment. The CV can contain a phone number even though the website contact section does not display it.

### Edit directly on GitHub

Open the file, choose Edit, make changes, and commit to `main`. Projects, certifications, and timeline entries are under `src/content/`. Profile, skills, and site settings are under `src/data/`. Upload images to `public/images/` and PDFs to `public/cv/`, referencing paths without `public` (e.g. `/images/example.webp`). Preserve valid JSON or Markdown frontmatter syntax. No React edits are required.

## Content accuracy and current limits

The provided CV supplies education, the six core case studies, skills, contact information, three certifications, and extracurricular activities. Additional repository descriptions use public GitHub metadata or the supplied repository names without claiming unverified features. The site describes an undergraduate seeking internship opportunities; it does not treat the CV's target-role header as employment history.

No credential URLs or certificate images were supplied, so their optional actions are hidden. There are no verified application screenshots or live demo URLs. Every public project now uses a newly generated conceptual cover. Original generated PNGs are in `artwork/project-covers/`, and 1200×800 optimized WebP files are in `public/images/projects/` with `-v2.webp` filenames. The supplied ZIP covers are retained but no longer used. See `PROJECT_COVER_PROMPTS.md` for the complete prompt set and generation provenance. The supplied `Dina-ai-chatbot` and `Thermo_Glow` repositories were absent from the public repository listing during the build; both are retained as hidden drafts. The `Dineth-Basura` profile repository is represented by the GitHub profile link. Gym, RailLink, and RescuePulse alternate repositories are available on their case-study pages.

The public site is not deployed or connected to GitHub/Pages CMS yet. Sitemap and canonical metadata deliberately require your real `SITE_URL`, avoiding a fictional production address. Lighthouse scores vary by device and hosting; see `VERIFICATION.md` for actual local checks.

## Troubleshooting

- **Build rejects a content file:** read the file and field named in the log. Required project fields are title, category, description, and HTTPS repository URL. Categories must match the CMS options. Optional URLs can be omitted or empty. Keep dates as text, and use a numeric order.
- **Image/PDF missing:** confirm the file is committed and the path begins with `/images/` or `/cv/`, not `public/`. Paths and filenames are case-sensitive after deployment.
- **Content hasn't updated:** confirm Pages CMS saved to the production branch, then check hosting build logs. A failed build keeps the previous deployment live.
- **Sitemap missing:** set a real HTTPS `SITE_URL` and rebuild. The sitemap is omitted before a production address is available.
- **CMS doesn't show editors:** ensure `.pages.yml` is at the repository root on the selected branch and the GitHub integration can access that repository.
- **Build tool fails:** use Node 24 and `npm ci` with the committed lockfile. Run `npm run check` before the build.
- **Reduced motion:** typing displays immediately and decorative animations stop. All content, technology logos, and the SVG graphic remain available without JavaScript. The introduction is editable in Profile; technology names and logos are editable in Skills.

To rebuild after any local edit, run `npm run check` and `npm run build`. Commit the updated content, not the generated `dist` folder, when using Git-connected hosting.
