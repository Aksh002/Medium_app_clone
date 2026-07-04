# Learning-in-Public Serverless Blogging Platform

This project started as a Medium-style blogging clone and is evolving into a learning-in-public writing platform. The goal is to make articles more than static posts: writers can publish Markdown-first learning artifacts, organize them into series, keep drafts alive through revisions, and give readers tools such as bookmarks, comments, highlights, private notes, reading history, and discovery feeds.

The app is built as a TypeScript multi-package repository with a React frontend, a Hono API deployed to Cloudflare Workers, Prisma-backed PostgreSQL storage, and shared Zod schemas for request validation.

## Product Direction

The platform is designed for developers, students, and builders who want to document what they are learning in public.

Core ideas:

- Markdown-first writing with live preview
- drafts, publishing, and author-owned post updates
- public post pages with unique slugs
- tags, comments, likes, bookmarks, follows, and profile pages
- series and learning paths instead of only standalone posts
- revision history so posts can become living knowledge artifacts
- reader library with bookmarks, highlights, private notes, and reading history
- discovery through search, tags, trending feed, following feed, and challenges
- future optional AI writing support that suggests improvements without overwriting author content

## Architecture

```text
Frontend (React, Vite, TypeScript, Tailwind, Recoil)
    -> typed API client using VITE_API_BASE_URL
Backend (Hono on Cloudflare Workers, Prisma Accelerate, PostgreSQL)
    -> validates requests with shared schemas
Common (Zod schemas and inferred TypeScript types)
```

Authentication is JWT-based. After signup or signin, the frontend stores the token in `localStorage` as `jwtToken` and uses it for protected API calls. The backend validates JWTs at the edge and resolves the current user before allowing private operations.

## Repository Layout

```text
.
|-- Backend/
|   |-- Routes/
|   |   |-- 1-main.tsx       # API router composition
|   |   |-- 2-user.tsx       # signup, signin, /me
|   |   |-- 3-blog.tsx       # legacy blog routes kept for compatibility
|   |   |-- 4-posts.tsx      # modern posts, drafts, comments, likes, notes
|   |   |-- 5-users.tsx      # profiles and follows
|   |   |-- 6-series.tsx     # learning series APIs
|   |   |-- 7-platform.tsx   # search, feeds, library, challenges
|   |   `-- utils.ts         # auth, Prisma, response helpers
|   |-- db/prisma/
|   |   |-- schema.prisma    # PostgreSQL domain model
|   |   `-- migrations/      # Prisma migrations
|   |-- hashPswdLogic.ts     # salted SHA-256 password hashing
|   |-- src/index.ts         # Worker entrypoint, CORS, /api/v1 mount
|   `-- package.json
|-- Common/
|   |-- src/sharedZod.ts     # shared Zod schemas and TS types
|   `-- package.json
|-- Frontend/
|   |-- src/App.tsx          # route table
|   |-- src/lib/api.ts       # frontend API client
|   |-- src/hooks.ts         # feature data hooks
|   |-- src/types.ts         # frontend domain types
|   |-- src/pages/           # route-level pages
|   |-- src/components/      # reusable UI components
|   `-- package.json
`-- README.md
```

## Backend

### Stack

- Hono for routing and middleware
- Cloudflare Workers via Wrangler
- Prisma Client Edge with Prisma Accelerate
- PostgreSQL
- JWT authentication through `hono/jwt`
- Zod validation through the shared Common package

### API Surface

Base path: `/api/v1`

User routes:

- `POST /user/signup`
- `POST /user/signin`
- `GET /user/me`

Modern post routes:

- `GET /posts` - public published feed
- `GET /posts/:slug` - public post detail
- `GET /posts/drafts` - authenticated draft list
- `GET /posts/mine` - authenticated author posts
- `POST /posts` - create draft
- `PUT /posts/:id` - update own post
- `POST /posts/:id/publish` - publish own post
- `POST /posts/:id/like` and `DELETE /posts/:id/like`
- `POST /posts/:id/bookmark` and `DELETE /posts/:id/bookmark`
- `GET /posts/:id/comments` and `POST /posts/:id/comments`
- `GET /posts/:id/revisions`
- `POST /posts/:id/reading-progress`
- `GET /posts/:id/highlights`, `POST /posts/:id/highlights`, `DELETE /posts/:id/highlights/:highlightId`
- `GET /posts/:id/private-note`, `PUT /posts/:id/private-note`

User and community routes:

- `GET /users/:userName`
- `PUT /users/me/profile`
- `POST /users/:userName/follow`
- `DELETE /users/:userName/follow`
- `GET /search?q=`
- `GET /feed/trending`
- `GET /feed/following`
- `GET /notifications`
- `POST /reports`

Series, library, and challenge routes:

- `GET /series`
- `POST /series`
- `PUT /series/:id`
- `POST /series/:id/posts`
- `DELETE /series/:id/posts/:postId`
- `GET /series/:slug`
- `GET /library`
- `GET /library/export`
- `GET /challenges`
- `GET /challenges/:slug`
- `POST /challenges/:slug/entries`
- `GET /tag/:tag`

Legacy `/blog` routes are still present so older frontend flows and URLs can keep working while the app moves to the richer `/posts` model.

### Data Model

The Prisma schema now models a fuller blogging and learning platform:

- `Users` with unique email and username, profile fields, timestamps, and relations
- `Posts` with slug, cover image, status, reading time, timestamps, and Markdown content
- `Tags` and `PostTags`
- `Comments`, including reply support
- `Likes`, `Bookmarks`, and `Follows`
- `PostRevisions` for living article history
- `ReadingHistory` for progress and resume-reading features
- `Series` and `SeriesPosts`
- `Highlights` and `PrivateNotes`
- `Notifications`, `Reports`, `Challenges`, `ChallengeEntries`, and `AiSuggestions`

## Frontend

### Stack

- React 18
- Vite 6
- TypeScript
- React Router
- Recoil
- Axios
- Tailwind CSS
- styled-components
- Framer Motion
- react-markdown and remark-gfm for Markdown rendering

### Main Routes

- `/` - landing page
- `/signup` and `/signin` - authentication
- `/blogs` - published feed
- `/dashboard` - author dashboard
- `/draft` and `/write` - Markdown writing flow
- `/blog/:blogId` - legacy post detail route
- `/p/:slug` - public slug-based post page
- `/u/:userName` - public profile page
- `/library` - reader library
- `/series/:slug` - learning path page
- `/challenges` and `/challenges/:slug`
- `/tag/:tag`

The frontend now uses a central API client in `Frontend/src/lib/api.ts`, which reads the backend URL from `VITE_API_BASE_URL`. This avoids scattering hardcoded Worker URLs throughout the UI.

## Current Feature Coverage

Implemented or scaffolded:

- signup, signin, and authenticated `/me` checks
- draft creation, draft updates, publishing, and public post feeds
- Markdown editor flow with preview-oriented dependencies
- slug-based posts and profile routes
- likes, bookmarks, comments, follows, tags, and series APIs
- revision, reading progress, highlights, private notes, library, search, feeds, notifications, reports, and challenge APIs
- Cloudflare Worker deployment configuration with secrets kept outside Git

Still early-stage:

- some advanced product surfaces are scaffolded and need deeper UI polish
- analytics and AI-assisted writing are represented in the model/roadmap but not yet a finished user-facing workflow
- media upload/storage is not implemented yet
- the Common package exists locally but the apps still import the published package rather than a formal workspace link

## Local Development

This repository is not configured as a root npm workspace. Install dependencies inside each package.

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Create `Frontend/.env` if you need to point the UI at a specific backend:

```env
VITE_API_BASE_URL=http://127.0.0.1:8787/api/v1
```

Useful scripts:

```bash
npm run build
npm run lint
npm run preview
```

### Backend

```bash
cd Backend
npm install
npm run dev
```

Required Worker secrets:

- `DATABASE_URL`
- `JWT_SECRET`

Set production secrets with Wrangler:

```bash
npx wrangler secret put DATABASE_URL
npx wrangler secret put JWT_SECRET
```

Deploy:

```bash
npm run deploy
```

`Backend/wrangler.toml` is intentionally ignored because deployment secrets must not be committed.

### Database

Prisma schema lives at `Backend/db/prisma/schema.prisma`.

Generate Prisma client:

```bash
cd Backend
npx prisma generate --schema db/prisma/schema.prisma
```

Apply migrations:

```bash
cd Backend
npx prisma migrate deploy --schema db/prisma/schema.prisma
```

For local development, make sure the process has `DATABASE_URL` available before running Prisma commands.

### Common

```bash
cd Common
npm install
```

The Common package contains shared Zod schemas and inferred TypeScript types. A future improvement is to wire this repository as a real workspace so frontend and backend consume the local package directly.

## Verification

Use these checks before pushing changes:

```bash
cd Backend
npx tsc --noEmit
```

```bash
cd Frontend
npm run build
npm run lint
```

The latest stabilization pass fixed TypeScript and lint issues across the app, added the central API client, validated JWT payloads before Prisma lookups, and kept the existing signup, signin, feed, draft, publish, and post routes working.

## Security Notes

- Do not commit `.env`, `.dev.vars`, database URLs, JWT secrets, or `wrangler.toml`.
- Store Cloudflare production secrets with `wrangler secret put`.
- The current password hashing implementation uses salted SHA-256 through Web Crypto. It works for the current learning project, but a production-grade app should move to a dedicated password hashing strategy such as Argon2 or bcrypt through a deployment-compatible service or runtime.

## Roadmap

Near-term focus:

- finish and polish the Markdown writing experience
- make dashboard, library, profile, series, and challenge pages feel complete
- improve tests around auth, ownership, private notes, idempotent likes/bookmarks, and slug uniqueness
- add safer Markdown sanitization and richer revision comparison UI
- introduce analytics and optional AI suggestions after the core product is stable

## Summary

This project is now moving from a basic Medium clone into a developer-focused learning-in-public platform. It keeps the original serverless architecture, edge JWT auth, Prisma/PostgreSQL persistence, and React/Vite frontend, while expanding the product into living articles, structured learning paths, reader knowledge tools, and community discovery.
