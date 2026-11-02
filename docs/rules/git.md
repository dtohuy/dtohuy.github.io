# Git conventions

## Branches
- `main` is production (GitHub Pages). Small, verified changes may go straight to `main`.
- Use a branch + PR for anything risky: data migrations, large refactors, new projects, or changes an
  agent made without the owner watching. Agents name branches `<agent>/<short-topic>`
  (e.g. `claude/agents-rules`).
- Never force-push `main`, never rewrite published history, never delete tags.

## Commit messages
English, imperative mood, ≤ 72 chars in the subject. Two accepted forms (both already in history):

```
<project> vX.Y.Z: <what changed>          # a versioned project release
<type>(<scope>): <what changed>          # everything else
```

`type` ∈ `feat` · `fix` · `refactor` · `style` · `docs` · `chore` · `revert`;
`scope` = project id, `site`, or `rules`. Examples:

```
english-toolbox v1.4.8: recorder time in header row, pin takes (max 4)
fix(english-toolbox): tts de-duplicates repeated system voices; v1.4.4
docs(rules): add AGENTS.md and agent rules
```

- One logical change per commit; don't mix unrelated projects.
- Add a body when the *why* isn't obvious (bug cause, trade-off, migration notes).

## Never commit
- Secrets, tokens, `.env`, personal contact details beyond what the page already shows.
- Local agent/IDE state: `CLAUDE.local.md`, `.claude/settings.json`, `.vscode/`, `.idea/`, worktrees
  (already in `.gitignore` — keep it that way).
- Build output, `node_modules/`, OS junk (`.DS_Store`).
- Scratch files or generation scripts' temp output. If a generator script is worth keeping, put it in
  `scripts/` with a header comment explaining inputs and outputs.
