# Versioning and release

`main` deploys to GitHub Pages automatically, so **every push to `main` is a release**.

## SemVer per project
Each project has its own version (`MAJOR.MINOR.PATCH`); the site itself has one too.

| Bump | When |
|---|---|
| PATCH `1.4.7 → 1.4.8` | bug fix, layout/style tweak, copy change |
| MINOR `1.4.x → 1.5.0` | new tool, new feature, new content set |
| MAJOR `1.x → 2.0.0` | breaking change: saved data reset/migrated, URLs or tool ids changed |
| `0.x` | MVP / still experimental |

## Where a version lives — update all of them together

| Project | Places |
|---|---|
| site (home page) | `.site-ver` badge in `index.html` |
| any project | `version` in `assets/data/projects.json` (+ `date`, and `time` if present, in Asia/Shanghai time) |
| `english-toolbox` | `projects.json`, the `<i class="ver">` badge in the header, **and** `const VERSION` in the inline script (it cache-busts the external tool pages `oral30.html`, `tts.html`, `chunks500/`). See its `AGENTS.md`. |
| other projects | any visible version string in the page itself |

Quick consistency check (should print one version per project):

```bash
grep -o '"version": *"[^"]*"' assets/data/projects.json
grep -on 'class="ver">v[0-9.]*\|const VERSION = "[0-9.]*"' projects/english-toolbox/index.html
```

## Tags
Release tags are `<id>-v<version>` (e.g. `english-toolbox-v1.4.8`, `prompt-builder-v1.0.0`).
Tag MINOR and MAJOR releases; tagging patches is optional. Only tag commits already on `main`:

```bash
git tag english-toolbox-v1.5.0 && git push origin english-toolbox-v1.5.0
```

## Before pushing to `main`
1. `node scripts/check-projects.mjs` passes.
2. Page previewed locally (light/dark, phone width, no console errors).
3. If saved-data format changed: a migration exists and was tested with old data in `localStorage`.
