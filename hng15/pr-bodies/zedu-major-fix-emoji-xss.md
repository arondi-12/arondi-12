# fix(security): render Apple emoji without raw HTML injection

**Closes #1058**

## What were you told to do?

Fix the stored XSS in `AppleEmojiText`: when user-controlled text contained an emoji, the component rendered the whole string through `dangerouslySetInnerHTML`, so HTML such as `<img src=x onerror=alert(1)>` executed for every viewer.

## What did you do?

- Added `tokenizeAppleEmoji(value)` to `src/lib/apple-emoji.ts`. It returns literal text tokens and emoji image tokens; it never returns HTML.
- Escaped `alt` and `src` in `emojiImageTag` so the legacy string helper cannot be broken out of its attributes.
- Rewrote `AppleEmojiText` to render text as React children and emoji as `<img>` elements. `dangerouslySetInnerHTML` is gone.
- Preserved the existing `apple-emoji-img` class, `alt`, `draggable={false}`, and the plain-text fast path.

## Why this fixes it

Before, the payload is injected as live HTML:

```html
<span>Hello <img src=x onerror="alert(1)"> <img class="apple-emoji-img" … /></span>
```

After, React escapes the text and only the real emoji becomes an image:

```html
<span>Hello &lt;img src=x onerror=&quot;alert(1)&quot;&gt; <img class="apple-emoji-img" … /></span>
```

## Verification

- `pnpm exec prettier --check` on both changed files — pass.
- `pnpm exec eslint` on both changed files — pass.
- Server-rendered proof at a temporary route, with `NEXT_PUBLIC_EMOJI_DATASOURCE_URL` set:
  - before: payload appears as live HTML;
  - after: payload is escaped, emoji still renders.
- `pnpm check-types`: the repo has two pre-existing errors in `src/app/(client)/[org]/home/agents/[id]/page.tsx`; neither is in the changed files. The changed files type-check.
- `pnpm build`: compilation succeeds. Page-data collection cannot complete in this environment because the app's required environment variables are not available (no `.env` is committed). This is unrelated to the change.

## Risk and rollback

Low. The change is limited to one component and one utility. No API, data, or schema changes. Rollback is a revert of the single commit; the tokenizer is additive.

## Checklist

- [x] My code follows the code style of this project.
- [x] This PR does not contain plagiarized content.
- [x] The title and description explain the approach.
- [x] I am targeting **`central-staging`** (the base used by current open PRs; the template still says `dev`).
- [x] My commit message follows the repository's conventional format.
- [x] The changed files pass Prettier and ESLint.
- [x] I am only changing the two files needed for this issue.

## Screenshots / recordings

No visual change. Before/after HTML is in the verification section and in `hng15/evidence/emoji-xss-before-after.md`.
