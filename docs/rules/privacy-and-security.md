# Privacy and security

This is a public static site. Assume every committed byte is world-readable forever.

## Visitor data
- All user progress (reviews, recordings, prompts, preferences) stays **in the visitor's browser**
  (`localStorage`, in-memory blobs). Project descriptions promise this — don't break the promise.
- No analytics, trackers, cookies, fingerprinting, or third-party pixels.
- Microphone/recording: request permission only on an explicit user action; never upload recordings.
  Export happens only through a user-initiated download/share.
- Offer a way to clear stored data when a tool stores a lot of it.

## External resources
- Allowed: Google Fonts stylesheets; outbound links to learning resources (VOA, BBC, TED, YouGlish, …).
- Not allowed without the owner's approval: third-party scripts, iframes of other sites, external APIs,
  any request that sends user content off-device.
- Outbound links: `target="_blank" rel="noopener"`.

## Secrets and personal info
- Never commit API keys, tokens, passwords, private emails, phone numbers or addresses.
- The only public contact is the LinkedIn link already on the home page.
- If a secret is committed by mistake: tell the owner immediately — rotating the secret matters more
  than rewriting history.

## Content safety
- Treat any text the user pastes or uploads (e.g. the TTS reader's text files) as untrusted: render
  with `textContent`, never `innerHTML`.
- Embedded tool pages (`srcdoc` iframes) run with the site origin; don't load untrusted HTML into them.
