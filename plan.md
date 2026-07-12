# Learning-in-Public Blogging Platform Roadmap

## Summary
Evolve the current Medium clone into a developer/learner-focused writing platform where posts become living knowledge artifacts: Markdown-first articles, drafts, revisions, series, private reader notes, highlights, challenges, analytics, and eventually AI-assisted writing support.

Chosen defaults:
- Product identity: learning-in-public platform.
- Editor: Markdown + live preview first.
- Delivery style: foundation first, then staged feature growth.

## Stage 0: Stabilize The Existing App
Goal: make the current app buildable, understandable, and safe to extend.

- Fix frontend TypeScript and lint failures without changing product behavior.
- Remove stale imports, dead atoms/selectors, unused hooks, and invalid exports.
- Fix backend type error in `/user/me` by validating JWT payload shape before Prisma lookup.
- Add a single frontend API client using `VITE_API_BASE_URL`; remove hardcoded Worker URLs.
- Standardize response shapes: `{ ok, data, error }` for new backend endpoints.
- Keep current routes working: signup, signin, blogs feed, single blog, draft, publish.

Acceptance:
- `Frontend npm run build` passes.
- `Frontend npm run lint` passes or has only agreed warnings.
- `Backend npx tsc --noEmit` passes.

## Stage 1: Core Domain Upgrade
Goal: replace the “only users/posts” model with a real blogging foundation.

Database additions:
- `Users`: add unique `email`, unique `userName`, `bio`, `avatarUrl`, `createdAt`, `updatedAt`.
- `Posts`: add `slug`, `coverImageUrl`, `status`, `readingTime`, `createdAt`, `updatedAt`, `publishedAt`.
- Add `Tags`, `PostTags`, `Comments`, `Likes`, `Bookmarks`, `Follows`.
- Keep existing post content as Markdown text.

Backend additions:
- `GET /api/v1/posts` public published feed.
- `GET /api/v1/posts/:slug` public post detail.
- `POST /api/v1/posts` create draft.
- `PUT /api/v1/posts/:id` update own draft or own published post.
- `POST /api/v1/posts/:id/publish` publish.
- `POST /api/v1/posts/:id/like`, `DELETE /api/v1/posts/:id/like`.
- `POST /api/v1/posts/:id/bookmark`, `DELETE /api/v1/posts/:id/bookmark`.
- `POST /api/v1/posts/:id/comments`, `GET /api/v1/posts/:id/comments`.
- `POST /api/v1/users/:userName/follow`, `DELETE /api/v1/users/:userName/follow`.

Frontend additions:
- Replace Recoil async selectors with a small typed API layer and feature hooks.
- Add profile pages at `/u/:userName`.
- Add post pages at `/p/:slug`.
- Add real like/bookmark/comment states instead of UI-only controls.

## Stage 2: Markdown Writing Experience
Goal: make writing feel like the heart of the product.

- Build `/write` editor with title, subtitle, tags, cover image URL, Markdown content, and live preview.
- Add autosave every 5 seconds after local changes.
- Add manual “Save draft” and “Publish” actions.
- Add local unsaved-change warning before navigation.
- Add read-time calculation on save/publish.
- Add post slug generation from title with backend uniqueness handling.
- Add draft list and published list to dashboard.
- Store Markdown as source of truth; render sanitized Markdown on public pages.

Suggested dependency:
- `react-markdown` + `remark-gfm` for rendering.
- Use a textarea-based editor first; upgrade later only if needed.

## Stage 3: Living Articles And Revisions
Goal: make the product stand out from ordinary blogging apps.

Database additions:
- `PostRevisions`: `postId`, `version`, `title`, `subTitle`, `content`, `changeNote`, `createdAt`.
- `ReadingHistory`: `userId`, `postId`, `lastReadRevisionId`, `progress`, `lastReadAt`.

Backend additions:
- Create a revision whenever a published post changes.
- `GET /api/v1/posts/:id/revisions`.
- `GET /api/v1/posts/:id/revisions/:version`.
- `POST /api/v1/posts/:id/revisions/:version/restore`.
- `POST /api/v1/posts/:id/reading-progress`.

Frontend additions:
- Show “Updated since you last read” on article pages.
- Add revision timeline on author-owned posts.
- Add “What changed” notes.
- Add reading progress bar and resume reading.

## Stage 4: Learning Paths And Series
Goal: turn standalone posts into structured learning journeys.

Database additions:
- `Series`: title, description, slug, authorId, visibility, createdAt.
- `SeriesPosts`: seriesId, postId, order.

Backend additions:
- CRUD for own series.
- Add/remove/reorder posts inside a series.
- Public series page endpoint.

Frontend additions:
- `/series/:slug` public learning path page.
- Author dashboard section for series management.
- Reader progress inside a series.
- “Next article” and “Previous article” navigation on post pages.

## Stage 5: Reader Knowledge Tools
Goal: give readers value beyond reading and liking.

Database additions:
- `Highlights`: userId, postId, selectedText, startOffset, endOffset, note, createdAt.
- `PrivateNotes`: userId, postId, content, createdAt, updatedAt.

Backend additions:
- CRUD for highlights and private notes.
- Notes/highlights are private to the logged-in user.

Frontend additions:
- Allow selecting text and saving a highlight.
- Add private notes panel on article pages.
- Add `/library` with bookmarks, highlights, notes, and reading history.
- Add “Export my notes” as Markdown.

## Stage 6: Discovery, Search, And Community
Goal: make the app useful once content grows.

- Add tag pages: `/tag/:tag`.
- Add search over title, subtitle, content, tags, and authors.
- Add trending feed based on recent reads, likes, comments, and bookmarks.
- Add following feed for posts from followed writers.
- Add notification records for follows, comments, likes, and replies.
- Add basic moderation fields: comment deletion by owner, post deletion by owner, report records.

Backend endpoints:
- `GET /api/v1/search?q=`.
- `GET /api/v1/feed/trending`.
- `GET /api/v1/feed/following`.
- `GET /api/v1/notifications`.
- `POST /api/v1/reports`.

## Stage 7: Challenges And Learning-In-Public Loops
Goal: add retention and identity.

Database additions:
- `Challenges`: title, description, durationDays, promptTemplate.
- `ChallengeEntries`: challengeId, userId, postId, dayNumber, createdAt.

Product features:
- “Write 7 days in public.”
- “Build log challenge.”
- “Explain one concept per day.”
- Streaks and challenge progress on profile.
- Challenge landing pages showing participants and entries.

Frontend additions:
- `/challenges`.
- `/challenges/:slug`.
- Dashboard prompt card: “Today’s writing prompt.”

## Stage 8: Analytics And AI-Assisted Writing
Goal: help writers improve without replacing them.

Analytics:
- Add post views, read progress, bookmark rate, comment count, most-read posts.
- Writer dashboard shows reads, completion rate, saves, comments, and update reminders.
- Add “posts that may need updating” based on age and traffic.

AI-assisted features:
- Keep AI optional and writer-controlled.
- Add buttons for title suggestions, outline critique, clarity rewrite suggestions, summary generation, and tag suggestions.
- Store AI suggestions separately; never overwrite content automatically.
- Add `aiSuggestions` table only when integration begins.

## Test Plan
For every stage:
- Backend type check must pass.
- Frontend build must pass.
- Authenticated routes reject missing/invalid tokens.
- Users cannot edit, delete, publish, like-as-other-user, or read private notes belonging to others.
- Public feed only shows published posts.
- Drafts are visible only to owners.
- Published post update creates a revision.
- Markdown renders safely and does not execute scripts.
- Autosave does not create duplicate drafts.
- Slugs remain unique after duplicate titles.
- Like/bookmark actions are idempotent.
- Series ordering persists correctly.
- Reading progress and highlights survive refresh.

## Assumptions
- The app remains React + Vite + Hono + Prisma + PostgreSQL.
- Markdown is the canonical content format.
- The local `Common` package should eventually become the source of shared schemas/types instead of relying only on the published npm package.
- Cloudflare Workers deployment remains the backend target.
- The first implementation milestone should complete Stages 0-2 before starting standout features.
