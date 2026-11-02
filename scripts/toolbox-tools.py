#!/usr/bin/env python3
"""Extract / pack the embedded tools of projects/english-toolbox/index.html.

The toolbox keeps 13 tools as complete HTML documents JSON-encoded on one line:
    const TOOLS = {"core800": "<!DOCTYPE html>...", ...};
Editing that escaped string by hand is error-prone, so:

    python3 scripts/toolbox-tools.py extract   # writes projects/english-toolbox/.tools/<id>.html
    python3 scripts/toolbox-tools.py pack      # encodes them back into index.html
    python3 scripts/toolbox-tools.py check     # verifies index.html round-trips unchanged

Encoding matches the existing file exactly: json.dumps(ensure_ascii=False) with "</" written as
"<\\/" so no "</script>" can end the surrounding <script> early.
Standard library only; run from anywhere.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "projects" / "english-toolbox" / "index.html"
OUT = INDEX.parent / ".tools"
PREFIX = "const TOOLS = "


def encode(tools: dict) -> str:
    return json.dumps(tools, ensure_ascii=False).replace("</", "<\\/")


def load():
    lines = INDEX.read_text(encoding="utf-8").split("\n")
    hits = [i for i, l in enumerate(lines) if l.startswith(PREFIX) and l.endswith(";")]
    if len(hits) != 1:
        sys.exit(f"✗ expected exactly one line starting with {PREFIX!r}, found {len(hits)}")
    i = hits[0]
    return lines, i, json.loads(lines[i][len(PREFIX):-1])


def extract():
    _, _, tools = load()
    OUT.mkdir(exist_ok=True)
    for tid, html in tools.items():
        (OUT / f"{tid}.html").write_text(html, encoding="utf-8", newline="\n")
    print(f"✓ extracted {len(tools)} tools to {OUT.relative_to(ROOT)}/")


def pack():
    lines, i, tools = load()
    files = {p.stem: p for p in OUT.glob("*.html")}
    if set(files) != set(tools):
        sys.exit(f"✗ tool ids differ — index.html: {sorted(tools)} vs .tools/: {sorted(files)}\n"
                 "  Adding/removing a tool also needs META and the picker updated; do it deliberately.")
    new = {tid: files[tid].read_text(encoding="utf-8") for tid in tools}  # keep original order
    changed = [t for t in tools if new[t] != tools[t]]
    if not changed:
        print("✓ nothing changed")
        return
    lines[i] = PREFIX + encode(new) + ";"
    INDEX.write_text("\n".join(lines), encoding="utf-8", newline="\n")
    print(f"✓ packed; changed: {', '.join(changed)}")


def check():
    lines, i, tools = load()
    if PREFIX + encode(tools) + ";" != lines[i]:
        sys.exit("✗ TOOLS line does not round-trip; the encoding rule in this script needs updating")
    print(f"✓ {len(tools)} tools round-trip cleanly")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    {"extract": extract, "pack": pack, "check": check}.get(cmd, lambda: sys.exit(__doc__))()
