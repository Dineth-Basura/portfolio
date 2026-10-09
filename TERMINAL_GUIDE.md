# Dineth's Security Terminal

The existing portfolio remains the default. Click **Terminal mode** in the header to open the optional terminal. On small screens, the same button shows its terminal icon. Escape, Close, Minimize, or the `exit` command returns to the portfolio. Nothing opens automatically and the terminal never gates projects, contact details, or the CV.

The terminal UI, React runtime, styles, and public portfolio data load on demand. No new dependencies, backend, paid API, or account system were added. The static build still works with Netlify and Cloudflare Pages.

## Commands

| Command | Purpose |
| --- | --- |
| `help`, `help <command>`, `help challenge` | Command list and investigation guidance |
| `whoami`, `about` | Professional identity and biography |
| `skills`, `education`, `certifications` | Current published portfolio content |
| `projects`, `projects <slug>` | Project list, summary, and real links |
| `contact`, `socials` | Contact page, email, GitHub, and LinkedIn |
| `cv` | Download the existing PDF, with a fallback link |
| `date` | Visitor's local date and time |
| `theme`, `theme dark`, `theme light`, `theme auto` | Read or change the existing portfolio theme |
| `history`, `clear`, `exit` | Session history, clear output, or close |
| `challenge` | Start or resume the fictional investigation |
| `pwd`, `ls [directory]`, `cd <directory>`, `cat <file>` | Explore predefined virtual evidence |
| `decode base64 <text>` | Decode Base64 evidence as UTF-8 text |
| `hint`, `hint 2`, `status` | Stage-specific hints and progress |
| `submit <answer>` | Validate the current stage and unlock the next |
| `reset`, `reset confirm`, `reset cancel` | Restart only after explicit confirmation |

Use Enter to execute, Arrow Up/Down for history, and Tab to complete a partially typed command. Empty-input Tab and Shift+Tab retain normal keyboard navigation. Suggested commands are clickable. Ctrl+L clears output. The native dialog handles focus containment and Escape; closing restores focus to the launcher.

## Mini CTF

**Meridian Transfer — The Hidden Incident** is a fictional promotional puzzle, separate from the full Meridian Transfer project.

1. **The Suspicious Handover:** compare a memo with transfer notices and identify an unsigned handover outside the approved window.
2. **Encoded Evidence:** decode a synthetic Base64 dispatch message and identify its correlation token. This demonstrates encoding rather than encryption.
3. **Final Investigation:** correlate the handover, token, destination, event type, and result in an audit log. Decoys include blocked attempts and verification events.

Each stage has two hints and one intended answer. Completion shows a portfolio-specific fictional flag, the skills explored, restart controls, and a link to the real Meridian Transfer case study. No original project flags, credentials, or exploit details were used.

Progress is stored in `db-security-terminal-progress-v1` on the visitor's device when local storage is available. Closing or refreshing does not clear completed stages. No visitor identity or scoreboard is collected. History and output stay in memory, with a maximum of 80 entries each. Commands are capped at 256 characters.

This is a browser-side educational simulation: answers and validation can be inspected or modified. It is not a secure competition or independently verified result. The parser executes no shell commands or arbitrary JavaScript, accesses no real files, and performs no scanning. Output is rendered as plain React text. The only terminal data request is the predefined local `/terminal-data.json` asset, which contains public portfolio content and no Web3Forms key.

## Files and editing

| File | Responsibility |
| --- | --- |
| `src/layouts/Layout.astro` | Small header launcher and terminal gate |
| `src/components/terminal/TerminalGate.astro` | Native dialog, on-demand imports, loading feedback, focus restoration |
| `src/components/terminal/SecurityTerminal.tsx` | Output, input, history, suggestions, progress, completion |
| `public/styles/security-terminal.css` | Scoped terminal themes and responsive styling, loaded only on launch |
| `src/pages/terminal-data.json.ts` | Static data derived from existing JSON and Astro Content Collections |
| `src/lib/terminal/terminalCommands.ts` | Registry for help and autocomplete |
| `src/lib/terminal/commandParser.ts` | Bounded parser with simple quoted arguments |
| `src/lib/terminal/executeCommand.ts` | Pure command execution and state transitions |
| `src/lib/terminal/virtualFileSystem.ts` | Synthetic files, directory locks, virtual path resolution |
| `src/lib/terminal/ctfChallenges.ts` | Stage titles, answers, hints, learning objectives, final flag |
| `src/lib/terminal/ctfValidator.ts` | Exact, case-insensitive current-stage answer validation |
| `src/lib/terminal/terminalStorage.ts` | Versioned local progress persistence |
| `src/lib/terminal/types.ts` | Shared strict types |
| `tests/terminal.spec.ts` | Logic and browser regression checks |

Edit ordinary profile, skills, education, certifications, and project information through their existing Pages CMS entries. The terminal automatically uses that content; it maintains no separate biography or project list.

For a replacement three-stage puzzle, edit `ctfChallenges.ts` and `virtualFileSystem.ts` together, keeping clues, answer IDs, stage numbers, and learning objectives consistent. Update `tests/terminal.spec.ts` with the intended solutions and decoys. To add more than three stages, also extend the `Stage` type, validator bounds, progress UI, transition logic, and storage version so old saved progress does not conflict. Add commands through the registry and execution module together.

## Local development and validation

From the repository folder:

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:4321/` and choose Terminal mode.

```sh
npm run check
npm run build
npm test
```

The project has no lint script. Type checks and browser tests cover the existing portfolio alongside the terminal. For production browser verification, use `npm run preview -- --port 4322` and set `TEST_URL=http://127.0.0.1:4322` before running tests. Stop development previews before rebuilding to avoid stale Vite dependency URLs; restart the development server after a build if necessary.

Validation results and any remaining limitations are recorded in `VERIFICATION.md`.
