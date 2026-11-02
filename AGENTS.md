# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, Cursor, Copilot, …) working in this repo.
Humans are welcome to read it too. Detailed rules live in [`docs/rules/`](docs/rules/); this file is the entry point.

## What this repo is

Kiya Hsieh's personal site and portfolio, served by **GitHub Pages** from `main` at
<https://dtohuy.github.io/>. Plain HTML/CSS/JS — **no build step, no bundler, no npm dependencies**.
Whatever is committed to `main` is live within a minute, so every push is a release.

```
index.html              home page (hero, about, projects, skills, contact)
css/style.css           home page styles (design tokens on :root, dark theme via [data-theme])
js/main.js              home page logic: theme, nav, i18n, project cards + search/filters
assets/data/
  projects.json         the project list rendered on the home page (source of truth for versions)
  categories.json       project categories
  skills.json           skills section
projects/<id>/          one self-contained page (or mini app) per work
  english-toolbox/      large single-file app — read its own AGENTS.md before touching it
  chinese-toolbox/
  prompt-builder/
scripts/check-projects.mjs   validator for projects.json ↔ projects/ folders
scripts/toolbox-tools.py     extract/pack the tools embedded in english-toolbox/index.html
docs/rules/             detailed rules for agents (index at the bottom of this file)
AGENTS.md / CLAUDE.md   this file; CLAUDE.md just imports it for Claude Code
.nojekyll               keep: tells Pages to serve files as-is
```

## Commands

| Task | Command |
|---|---|
| Validate project data (run before every commit that touches `assets/data/` or `projects/`) | `node scripts/check-projects.mjs` |
| Preview locally (pages use `fetch`, so `file://` will not work) | `python3 -m http.server 8000` → <http://localhost:8000/> |
| Edit an embedded english-toolbox tool | `python3 scripts/toolbox-tools.py extract` … edit … `pack` (see its AGENTS.md) |
| Check JSON syntax quickly | `node -e "JSON.parse(require('fs').readFileSync('assets/data/projects.json','utf8'))"` |

There is no test suite, linter or CI. "Tested" means: the validator passes **and** you opened the
changed page in a browser (light + dark theme, phone width ~375px, no console errors).

## Hard rules

1. **No build tooling or dependencies.** Don't add `package.json`, bundlers, frameworks, TypeScript, or CDN
   scripts. Vanilla JS (ES2020+) and CSS only. Google Fonts is the one allowed external stylesheet.
2. **Each `projects/<id>/` page is self-contained.** It must not import `css/style.css` or `js/main.js`
   and must keep working if copied elsewhere. Shared look comes from copying tokens, not from linking.
3. **Never break users' saved data.** Pages keep progress in `localStorage`. Don't rename or reshape an
   existing key; add a new versioned key (`foo-v2`) and migrate from the old one. Wrap every
   `localStorage` access in `try/catch`.
4. **Keep versions in sync** when you change a project (see [versioning](docs/rules/versioning-and-release.md)).
5. **Home page text is trilingual** (`zh-Hant`, `zh-Hans`, `en`). Any new user-visible string on the home
   page or in `projects.json` needs all three (see [i18n](docs/rules/i18n.md)).
6. **No secrets, tracking, or analytics.** No API keys, tokens, personal emails or phone numbers in the
   repo. Nothing leaves the visitor's browser unless the user explicitly asks for it.
7. **Small, surgical edits.** Several files are huge (`english-toolbox/index.html` ≈ 0.8 MB,
   `oral30.html` ≈ 6.7 MB, `chunks*/audio/*.json` are base64 audio). Never `cat` or rewrite them whole;
   use `grep -n` + targeted edits. Never reformat or re-indent files you are not otherwise changing.
8. **Don't touch** `LICENSE`, `.nojekyll`, or the profile `README.md` unless asked.

## Standard workflows

### Change an existing project
1. Read `projects/<id>/AGENTS.md` if it exists.
2. Make the change; keep it minimal.
3. Bump the version (patch for fixes/tweaks, minor for a new tool/feature) in **every** place listed in
   the versioning rules, and update `date`/`time` in `projects.json` (Asia/Shanghai time).
4. `node scripts/check-projects.mjs`, then preview in a browser.
5. Commit: `<id> vX.Y.Z: <what changed>` (see [git rules](docs/rules/git.md)).

### Add a new project
1. Create `projects/<id>/index.html` (`<id>` = lowercase slug).
2. Add an entry to `assets/data/projects.json` (schema documented at the top of
   `scripts/check-projects.mjs`); start at `0.1.0` for an MVP or `1.0.0` if complete.
3. Validator → preview → commit `feat(<id>): …`.

### Change the home page
Edit `index.html` / `css/style.css` / `js/main.js`; add strings to the `I18N` table in `main.js`
for all three languages; bump the site version badge (`.site-ver` in `index.html`).

## Definition of done

- [ ] `node scripts/check-projects.mjs` prints ✓
- [ ] Page opened locally: works in light **and** dark theme, at phone width, no console errors
- [ ] Versions bumped and consistent; `date`/`time` updated
- [ ] No new external requests, dependencies, or secrets
- [ ] Commit message follows the convention; one logical change per commit

## Rule index

| File | Covers |
|---|---|
| [docs/rules/code-style.md](docs/rules/code-style.md) | HTML/CSS/JS conventions, theming, accessibility, mobile |
| [docs/rules/i18n.md](docs/rules/i18n.md) | Three-language strings, where they live, wording |
| [docs/rules/versioning-and-release.md](docs/rules/versioning-and-release.md) | SemVer, every place a version lives, tags |
| [docs/rules/git.md](docs/rules/git.md) | Branches, commit messages, what not to commit |
| [docs/rules/privacy-and-security.md](docs/rules/privacy-and-security.md) | Data, external links, embeds, secrets |
| [projects/english-toolbox/AGENTS.md](projects/english-toolbox/AGENTS.md) | Internals of the largest app |

## When unsure

Ask instead of guessing if a change would: delete or migrate user data, change a project's `id`/URL,
add an external service, or rewrite more than one tool at a time.
