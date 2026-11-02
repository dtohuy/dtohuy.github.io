# Code style

Applies to everything under the repo. Project-specific overrides live in `projects/<id>/AGENTS.md`.

## General
- Vanilla HTML/CSS/JS only. No frameworks, bundlers, transpilers, npm packages, or CDN scripts.
- Match the surrounding file's style (indentation, quotes, minified vs. readable). Several project pages
  are intentionally dense one-liners — don't reformat them.
- Prefer small, readable functions; comment the *why*, not the *what*.
- UTF-8 everywhere. Keep Chinese text as real characters, not `\uXXXX` escapes (except inside the
  JSON-encoded `TOOLS` strings in `english-toolbox`, which a script encodes).

## HTML
- Every page: `<!doctype html>`, `lang` attribute, `<meta charset="utf-8">`,
  `<meta name="viewport" content="width=device-width, initial-scale=1">`, a meaningful `<title>`.
- Use semantic elements (`header`, `main`, `section`, `nav`, `button` for actions, `a` for navigation).
- Interactive controls need an accessible name (`aria-label` if there's no visible text).
- Links that open a new tab: `target="_blank" rel="noopener"`.

## CSS
- Colors, radii, spacing and fonts are **design tokens** (custom properties) on `:root`.
  Don't hard-code new colors in rules — add or reuse a token.
- Dark/light theming follows the existing pattern:
  `@media (prefers-color-scheme: …)` for the system default, plus `:root[data-theme="dark"|"light"]`
  for the manual toggle. Every new token needs a value in both themes.
- Mobile first: test at 375 px wide. No horizontal page scroll. Respect
  `env(safe-area-inset-*)` for fixed elements (see the recorder pill in `english-toolbox`).
- Honor `prefers-reduced-motion` for any animation.

## JavaScript
- Wrap page scripts in an IIFE or module scope; `"use strict"`. No globals besides what a page
  intentionally exposes.
- `const`/`let`, arrow functions, optional chaining are fine (evergreen browsers, incl. iOS Safari).
- Feature-detect browser APIs (`speechSynthesis`, `MediaRecorder`, `navigator.mediaDevices`) and show a
  friendly message when missing. iOS/WebKit is a primary target — e.g. record `audio/mp4` there.
- **Storage:** every `localStorage` read/write goes in `try/catch`; namespace keys per project
  (`ct_…`, `toolbox-…`) and suffix a schema version (`…-v1`). Never rename an existing key without a
  migration that reads the old one.
- Data fetched with `fetch()` uses relative paths and handles failure (see `loadData` in `js/main.js`).
- No `eval`, no `innerHTML` with user-provided text — use `textContent` or escape first.
- Leave no `console.log` debugging behind (warnings for real failures are OK).

## Files and size
- Large generated assets (audio JSON, embedded tool HTML) are edited with scripts, not by hand.
- Don't commit files > ~10 MB; split them like `chunks500/audio/cat*.json`.
- New images go in `assets/img/` (home page) or `projects/<id>/` (project-local). Prefer SVG/WebP.
