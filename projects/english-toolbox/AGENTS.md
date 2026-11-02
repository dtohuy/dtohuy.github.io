# english-toolbox — agent notes

Read the root [`AGENTS.md`](../../AGENTS.md) first. This file adds what is specific to this app.

## Architecture
`index.html` (~0.8 MB, ~820 lines) is a shell plus 13 embedded tools:

| Part | Where | How it loads |
|---|---|---|
| Shell: header, tool picker, home/path view, recorder, scroll buttons, theme sync | `index.html` | — |
| Embedded tools `core800 polysemy skeleton chunks map questions story slang pron fluency culture input review` | **one line**: `const TOOLS = {…}` (line ~248), each value is a complete HTML document JSON-encoded as a string | `iframe.srcdoc` |
| External tools `oral30`, `chunks500`, `tts` | `oral30.html` (6.7 MB), `chunks500/index.html`, `tts.html` | `iframe.src = file + "?v=" + VERSION` (listed in `const EXTERNAL`) |
| `chunks300/index.html` | own page, opened from the `chunks` tool as `chunks300/index.html?embed=1` | iframe |
| Audio | `chunks300/audio/cat*.json`, `chunks500/audio/cat*.json` — `{"c": [...], "s": [...]}` base64 MP3, fetched per category | `fetch` on demand |

Tool metadata (name, layer, description) is the `META` array right after `EXTERNAL`.
The shell pushes its `data-theme` into every same-origin iframe (`syncTheme`), so each tool must
support both themes via `:root[data-theme=…]`.

## Editing embedded tools — never edit the escaped string by hand
Use the helper, which decodes `TOOLS` into files and re-encodes them byte-for-byte safely:

```bash
python3 scripts/toolbox-tools.py extract   # → projects/english-toolbox/.tools/<id>.html
# edit .tools/<id>.html with normal tools
python3 scripts/toolbox-tools.py pack      # writes them back into index.html
```

`.tools/` is git-ignored scratch space. `pack` refuses to run if a tool id was added or removed —
change `TOOLS`, `META` and the picker together, deliberately.

## Large files
- `oral30.html` (6.7 MB) and `audio/*.json` contain base64 audio. Never `cat`/Read them whole;
  `grep -n` for the region you need and edit there.
- Don't regenerate audio unless asked; if you do, keep the `{"c","s"}` shape and per-category split,
  and keep each file well under 10 MB.

## Version & timestamp — four places, keep them identical
1. `assets/data/projects.json` → `version`, `date`, `time` (Asia/Shanghai)
2. Header badge: `<i class="ver">vX.Y.Z</i>`
3. Script: `const VERSION = "X.Y.Z";` — this cache-busts the external tools; if it lags, phones keep
   serving stale `oral30.html`/`tts.html`/`chunks500`.
4. Update time: `<span class="upd" id="updAt">更新 YYYY-MM-DD HH:mm</span>` and the footer
   `更新時間 YYYY-MM-DD HH:mm`

`tts.html` also shows its own `文字朗讀 vX.Y.Z` note — bump it only when `tts.html` itself changes.

## Saved data (localStorage) — do not break
Known keys include `daily-review-v1`, `input-log-v1`, `toolbox-recorder-ui`, `chunks300-v1`, plus
keys inside each embedded tool. Renaming/reshaping any of them wipes a learner's progress: add a new
`-v2` key with a migration instead, and call it out in the commit body.

## Recorder (shared by the shell and several tools)
- Must work on iOS Safari/WebKit: record `audio/mp4` where `audio/webm` isn't supported, drop
  empty takes, re-create object URLs for repeat playback.
- Floating UI must clear the bottom safe area and not overlap a tool's own player bar
  (see the 語塊 500 history in `git log`).
- Recordings never leave the device.

## UI language
Shell and tool UI are zh-Hant (some embedded tools are zh-CN — keep each tool consistent with
itself). Learning content is English.

## Checklist for a toolbox change
- [ ] Edited via `toolbox-tools.py` if an embedded tool changed
- [ ] All four version/timestamp places updated
- [ ] Tested the changed tool inside the shell (not only standalone), light + dark, iPhone width
- [ ] Recorder still opens/records/plays on the changed tool, if it uses one
