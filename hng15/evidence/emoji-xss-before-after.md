# Evidence: Apple emoji stored XSS (major fix)

**Issue:** [zeduchat/zedu-fe#1058](https://github.com/zeduchat/zedu-fe/issues/1058)
**Branch:** `fix/apple-emoji-stored-xss`
**Commit:** `6a37b65` (`fix(security): render Apple emoji without raw HTML injection`)
**Base:** `central-staging` at `0f5008` (27 Oct 2026)

## Reproduction

A temporary App Router route rendered the real `AppleEmojiText` component with:

```tsx
const payload = 'Hello <img src=x onerror="alert(1)"> 🎉';
<AppleEmojiText text={payload} />
```

The app was run with `NEXT_PUBLIC_EMOJI_DATASOURCE_URL` set so the emoji resolved to an image.

### Before (central-staging)

```html
<div id="proof"><span>Hello <img src=x onerror="alert(1)"> <img class="apple-emoji-img" alt="🎉" src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/1f389.png" draggable="false" /></span></div>
```

The `<img onerror>` is live HTML. In a reaction, this executes in every viewer's browser.

### After (fix branch)

```html
<div id="proof"><span>Hello &lt;img src=x onerror=&quot;alert(1)&quot;&gt; <img class="apple-emoji-img" src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/1f389.png" alt="🎉" draggable="false"/></span></div>
```

The payload is escaped. The emoji still renders. `dangerouslySetInnerHTML` is removed from `apple-emoji-text.tsx`.

## Code-level proof

- `grep -c dangerouslySetInnerHTML src/app/.../apple-emoji-text.tsx` → `0`.
- `replaceEmojiWithImages` remains for the message renderer, but `emojiImageTag` now escapes `alt` and `src` attributes.
- `tokenizeAppleEmoji` is additive and exportable; AppleEmojiText is its only consumer.

## Patch apply check

A fresh clone of `central-staging` accepted the patch with `git am`:

```text
XSS_PATCH_APPLIED
69f6276 fix(security): render Apple emoji without raw HTML injection
0
```

## Checks

```text
$ pnpm exec prettier --check src/lib/apple-emoji.ts 'src/app/(client)/[org]/_components/apple-emoji/apple-emoji-text.tsx'
All matched files use Prettier code style!

$ pnpm exec eslint src/lib/apple-emoji.ts 'src/app/(client)/[org]/_components/apple-emoji/apple-emoji-text.tsx'
(no output; exit 0)

$ pnpm check-types
Found 2 errors in src/app/(client)/[org]/home/agents/[id]/page.tsx
(no errors in the changed files; pre-existing on central-staging)
```

## What is not verified

- A live click-through in the authenticated app (no test account in this environment).
- A full production build (page-data collection needs the project's private environment variables; compilation itself succeeds).
