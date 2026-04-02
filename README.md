# Medium_app_clone

Medium_app_clone is a three-part TypeScript codebase that recreates the core flow of a Medium-style blogging app:

- a React + Vite frontend for authentication, blog browsing, and drafting
- a Hono API intended to run on Cloudflare Workers
- a shared schema package used to keep frontend inputs and backend validation aligned

The project is organized as a simple multi-package repository, but it is not wired up as an npm workspace. Each package is installed and run independently.

## High-Level Architecture

```text
Frontend (React, Vite, Recoil, Tailwind, styled-components)
    -> calls
Backend (Hono on Cloudflare Workers, Prisma Accelerate, PostgreSQL)
    -> validates with
Common (shared Zod schemas and inferred TypeScript types)
```

Authentication is JWT-based. After signup or signin, the frontend stores the token in `localStorage` under `jwtToken` and mirrors it into Recoil state. Most of the app then uses that token to call protected blog routes.

## Repository Index

```text
.
|-- Backend/
|   |-- Routes/
|   |   |-- 1-main.tsx        # API sub-router composition
|   |   |-- 2-user.tsx        # signup, signin, token verification
|   |   `-- 3-blog.tsx        # create, publish, edit, fetch, delete blog routes
|   |-- db/prisma/
|   |   |-- schema.prisma     # PostgreSQL schema for users and posts
|   |   `-- migrations/       # initial schema migration
|   |-- hashPswdLogic.ts      # salted SHA-256 password hashing using Web Crypto
|   |-- src/index.ts          # Hono app entrypoint + CORS + /api/v1 router mount
|   `-- package.json          # Wrangler dev/deploy scripts
|-- Common/
|   |-- src/sharedZod.ts      # shared Zod schemas + inferred TS types
|   `-- package.json          # package metadata for @akshit_gangwar/medium-common-v2
|-- Frontend/
|   |-- src/App.tsx           # route table and lazy-loaded pages
|   |-- src/pages/            # route-level UI pages
|   |-- src/components/       # reusable UI pieces
|   |-- src/atoms/            # Recoil atoms/selectors for auth and blog data
|   |-- src/customHook/       # auth guard hooks
|   |-- tailwind.config.js    # custom colors and background image config
|   `-- package.json          # Vite dev/build/lint scripts
`-- README.md                 # this technical overview
```

## Backend

### Stack

- `hono` for HTTP routing and middleware
- `@prisma/client/edge` with `@prisma/extension-accelerate` for DB access on edge/runtime-friendly deployments
- Cloudflare Workers via `wrangler`
- PostgreSQL as the database
- `hono/jwt` for signing and verifying JWTs

### Entry Point

`Backend/src/index.ts` creates a Hono app, enables permissive CORS, and mounts the versioned router at `/api/v1`.

Important backend traits:

- CORS currently allows `origin: "*"`
- `Authorization` is accepted as a CORS header
- the code expects `DATABASE_URL` and `JWT_SECRET` bindings in the Worker environment
- comments refer to `wrangler.toml`, but that file is not present in the checked-in repo

### User Routes

Mounted at `/api/v1/user`:

- `POST /signup`
  - validates input with `userSchema`
  - checks if the email already exists
  - hashes the password
  - creates a `Users` row
  - returns a signed JWT
- `POST /signin`
  - validates input with `loginSchema`
  - looks up the user by email
  - verifies the stored salted hash
  - returns a signed JWT
- `GET /me`
  - expects `Authorization: Bearer <token>`
  - verifies the token
  - fetches the current user
  - returns user profile data excluding password hash

### Blog Routes

Mounted at `/api/v1/blog`.

Two middleware layers run on all blog endpoints:

- JWT auth middleware that extracts and verifies the bearer token, then stores `userId` in the Hono context
- Prisma middleware that instantiates a Prisma client and stores it in the Hono context

Implemented routes:

- `POST /`
  - creates a new draft post for the authenticated user
- `POST /:id`
  - marks the authenticated user's post as `published: true`
- `PUT /:id`
  - updates an existing unpublished post owned by the authenticated user
- `GET /?id=<postId>`
  - fetches a single post by id
- `GET /bulk`
  - fetches all published posts
- `DELETE /:id`
  - deletes a post owned by the authenticated user
- `GET /myPosts`
  - fetches the authenticated user's published posts
- `GET /mySavedPosts`
  - currently returns the same dataset as `myPosts`
- `GET /drafts`
  - fetches the authenticated user's unpublished posts

Important behavioral detail: because auth middleware is attached to `Blog.use('/*', ...)`, even read routes like `GET /bulk` and `GET /?id=` require a valid bearer token.

### Data Model

`Backend/db/prisma/schema.prisma` defines two models:

#### `Users`

- `id: String @id @default(uuid())`
- `email: String`
- `userName: String`
- `firstName: String`
- `hashPass: String`
- `posts: Posts[]`

#### `Posts`

- `id: String @id @default(uuid())`
- `title: String`
- `subTitle: String`
- `content: String`
- `published: Boolean @default(false)`
- `authorId: String`
- relation back to `Users`

Notable schema caveat: `email` is not marked `@unique` in Prisma, so uniqueness is enforced only in application logic during signup.

### Password Storage

`Backend/hashPswdLogic.ts` generates a random salt with Web Crypto and stores passwords as:

```text
<salt>:<sha256(password + salt)>
```

This is functional, but it is lighter than a purpose-built password hashing algorithm such as Argon2 or bcrypt.

## Common Package

`Common/src/sharedZod.ts` contains the shared schemas:

- `userSchema`
- `loginSchema`
- `blogSchema`
- `blogUPDschema`

It also exports inferred TypeScript types from those schemas. The package name is `@akshit_gangwar/medium-common-v2`.

One important repo detail: both frontend and backend import the published package name from `node_modules`, while this repository also includes a local `Common/` copy of the same package. That means the local folder documents the schema source, but the app is not currently using a formal workspace link.

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
- react-loading-skeleton

### Routing

`Frontend/src/App.tsx` lazy-loads all route pages:

- `/` -> landing page
- `/signup` -> standalone signup page
- `/signin` -> standalone signin page
- `/blogs` -> main blog feed
- `/dashboard` -> dashboard placeholder route
- `/draft` -> blog editor / draft composer
- `/blog/:blogId` -> single blog page
- `/membership` -> placeholder page
- `/aboutUs` -> placeholder page

### Page Responsibilities

- `FrontPage.tsx`
  - marketing-style landing page
  - opens auth modal
  - uses `useAuthCheckRev` to redirect already logged-in users to `/blogs`
- `Signup.tsx` and `Signin.tsx`
  - wrap the same `Onboarding` component in full-page form layouts
- `Blogs.tsx`
  - authenticated route
  - loads blog lists from Recoil async selectors
  - toggles between all blogs, drafts, and "my blogs" views
- `Blog.tsx`
  - authenticated route
  - fetches one blog by id
  - displays placeholder author/avatar/image data
- `Draft.tsx`
  - authenticated route
  - lets the user enter title, subtitle, and content
  - supports saving as draft and publishing
  - stores the active draft id in `localStorage` as `currentBlogId`
- `Dashboard.tsx`
  - fetches dashboard datasets but does not yet render a complete dashboard
- `Membership.tsx` and `AboutUs.tsx`
  - placeholder content pages

### State Management

The main Recoil atoms/selectors are:

- `tokenAtom`
  - initialized from `localStorage.getItem("jwtToken")`
- `loaderAtom`
  - controls the auth-loading overlay
- `blogsAtom`
  - async selector-backed atom that loads `/blog/bulk`
- `draftsAtom`
  - async selector-backed atom that loads `/blog/drafts`
- `myBlogsAtom`
  - async selector-backed atom that loads `/blog/myPosts`
- `viewDraftAtom`
  - toggles the feed into drafts mode
- `viewMyBlogsAtom`
  - toggles the feed into "my blogs" mode

### Auth Flow in the UI

`Frontend/src/components/Onboarding.tsx` handles both signup and signin.

- signup posts to `/api/v1/user/signup`
- signin posts to `/api/v1/user/signin`
- on success, the JWT is stored in Recoil and `localStorage`
- users are then navigated to `/Blogs`

Two custom hooks enforce auth behavior:

- `useAuthCheck`
  - for protected pages
  - redirects to `/` if the token is missing or invalid
- `useAuthCheckRev`
  - for public auth-entry pages
  - redirects authenticated users to `/blogs`
  - also writes `userName`, `firstName`, and `email` into `localStorage`

### Styling and UX

The frontend mixes utility classes and component-scoped CSS:

- Tailwind supplies layout and theming primitives
- `tailwind.config.js` defines:
  - `customColor: #F7F4ED`
  - `customYellow: #f9ebce`
  - `customGray`
  - `customGray2`
- `src/index.css` adds a `paper.png` background utility for the draft page
- styled-components powers animated buttons, loaders, dropdowns, like/bookmark controls, and other decorative UI pieces
- Framer Motion is used for page transitions, modal animation, and list entrance effects

### API Coupling

The frontend does not use environment variables for the API base URL. It directly calls:

```text
https://backend.akshitgangwar02.workers.dev/api/v1/...
```

This means local frontend development is currently coupled to that deployed backend unless the source is edited.

## Current Feature Coverage

### Working Core Flows

- user signup
- user signin
- JWT verification
- create draft
- update draft while unpublished
- publish draft
- list published posts
- list current user's published posts
- list current user's drafts
- open a post detail page
- logout / account switching UI

### Partially Implemented or Placeholder Areas

- dashboard UI is not finished
- membership/about pages are placeholders
- bookmark and like interactions are present as UI widgets only; there is no persistence in the backend schema
- `mySavedPosts` is not a real saved-posts feature yet
- blog author info and images are hardcoded placeholders in the feed/detail UI
- there is no uploaded media flow

## Local Development

Because this repo is not configured as a root workspace, install and run each app separately.

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Other scripts:

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

Deploy script:

```bash
npm run deploy
```

Expected backend environment/bindings:

- `DATABASE_URL`
- `JWT_SECRET`

### Common

```bash
cd Common
npm install
```

The `Common` package currently acts as the shared schema source/reference. It does not expose a real local build workflow in this repo.

## Verification Snapshot

I inspected the codebase and ran the available frontend verification commands.

- `Frontend: npm run build` fails
  - main causes: unused imports, implicit `any`, references to missing exports, invalid selector typing, and a hook used inside an async function
- `Frontend: npm run lint` fails
  - main causes: unused variables/imports and one hooks rule violation in `usePublish.tsx`
- `Backend: npm run deploy` could not be validated in this environment
  - `wrangler deploy` failed with `spawn EPERM` inside the sandbox

## Technical Debt and Risks Worth Knowing

- frontend type safety is incomplete in many files
- API base URL is hardcoded throughout the frontend
- backend read routes are authenticated, which may or may not match intended product behavior
- user email uniqueness should ideally be enforced at the database level
- password hashing should ideally use a dedicated password KDF
- several components and routes still contain placeholder UI or incomplete product logic

## Summary

This repository is a Medium-inspired full-stack TypeScript app with a React frontend, a Hono + Prisma edge backend, and a shared Zod schema package. The core auth, drafting, publishing, and feed flows exist, but the project is still in an in-progress state with several unfinished features, hardcoded infrastructure assumptions, and TypeScript/lint issues that currently prevent a clean frontend build.
