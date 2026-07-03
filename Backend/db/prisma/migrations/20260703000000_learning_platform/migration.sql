-- Enums
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "SeriesVisibility" AS ENUM ('PUBLIC', 'PRIVATE');
CREATE TYPE "NotificationType" AS ENUM ('LIKE', 'BOOKMARK', 'COMMENT', 'FOLLOW', 'REVISION');

-- Existing table upgrades
ALTER TABLE "Users"
  ADD COLUMN "bio" TEXT,
  ADD COLUMN "avatarUrl" TEXT,
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
CREATE UNIQUE INDEX "Users_userName_key" ON "Users"("userName");
CREATE UNIQUE INDEX "Users_id_email_key" ON "Users"("id", "email");

ALTER TABLE "Posts"
  ADD COLUMN "slug" TEXT,
  ADD COLUMN "coverImageUrl" TEXT,
  ADD COLUMN "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "readingTime" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "publishedAt" TIMESTAMP(3),
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "Posts"
SET
  "slug" = LOWER(REGEXP_REPLACE(COALESCE(NULLIF("title", ''), 'post') || '-' || SUBSTRING("id", 1, 8), '[^a-zA-Z0-9]+', '-', 'g')),
  "status" = CASE WHEN "published" THEN 'PUBLISHED'::"PostStatus" ELSE 'DRAFT'::"PostStatus" END,
  "publishedAt" = CASE WHEN "published" THEN CURRENT_TIMESTAMP ELSE NULL END,
  "readingTime" = GREATEST(1, CEIL(LENGTH(COALESCE("content", '')) / 1200.0));

ALTER TABLE "Posts" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Posts_slug_key" ON "Posts"("slug");
CREATE UNIQUE INDEX "Posts_id_authorId_key" ON "Posts"("id", "authorId");
CREATE INDEX "Posts_status_publishedAt_idx" ON "Posts"("status", "publishedAt");
CREATE INDEX "Posts_authorId_status_idx" ON "Posts"("authorId", "status");

ALTER TABLE "Posts" DROP CONSTRAINT "Posts_authorId_fkey";
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Core publishing tables
CREATE TABLE "Tags" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Tags_name_key" ON "Tags"("name");
CREATE UNIQUE INDEX "Tags_slug_key" ON "Tags"("slug");

CREATE TABLE "PostTags" (
  "postId" TEXT NOT NULL,
  "tagId" TEXT NOT NULL,
  CONSTRAINT "PostTags_pkey" PRIMARY KEY ("postId", "tagId")
);

CREATE TABLE "Comments" (
  "id" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "postId" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "parentId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Comments_postId_createdAt_idx" ON "Comments"("postId", "createdAt");

CREATE TABLE "Likes" (
  "id" TEXT NOT NULL,
  "postId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Likes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Likes_postId_userId_key" ON "Likes"("postId", "userId");

CREATE TABLE "Bookmarks" (
  "id" TEXT NOT NULL,
  "postId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Bookmarks_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Bookmarks_postId_userId_key" ON "Bookmarks"("postId", "userId");

CREATE TABLE "Follows" (
  "id" TEXT NOT NULL,
  "followerId" TEXT NOT NULL,
  "followingId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Follows_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Follows_followerId_followingId_key" ON "Follows"("followerId", "followingId");

-- Living article tables
CREATE TABLE "PostRevisions" (
  "id" TEXT NOT NULL,
  "postId" TEXT NOT NULL,
  "version" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "subTitle" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "changeNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PostRevisions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PostRevisions_postId_version_key" ON "PostRevisions"("postId", "version");

CREATE TABLE "ReadingHistory" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "postId" TEXT NOT NULL,
  "lastReadRevisionId" TEXT,
  "progress" INTEGER NOT NULL DEFAULT 0,
  "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReadingHistory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ReadingHistory_userId_postId_key" ON "ReadingHistory"("userId", "postId");

-- Series and learning paths
CREATE TABLE "Series" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "slug" TEXT NOT NULL,
  "visibility" "SeriesVisibility" NOT NULL DEFAULT 'PUBLIC',
  "authorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Series_slug_key" ON "Series"("slug");
CREATE INDEX "Series_authorId_visibility_idx" ON "Series"("authorId", "visibility");

CREATE TABLE "SeriesPosts" (
  "seriesId" TEXT NOT NULL,
  "postId" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  CONSTRAINT "SeriesPosts_pkey" PRIMARY KEY ("seriesId", "postId")
);

CREATE UNIQUE INDEX "SeriesPosts_seriesId_order_key" ON "SeriesPosts"("seriesId", "order");

-- Reader knowledge tools
CREATE TABLE "Highlights" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "postId" TEXT NOT NULL,
  "selectedText" TEXT NOT NULL,
  "startOffset" INTEGER NOT NULL,
  "endOffset" INTEGER NOT NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Highlights_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Highlights_userId_postId_idx" ON "Highlights"("userId", "postId");

CREATE TABLE "PrivateNotes" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "postId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PrivateNotes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PrivateNotes_userId_postId_key" ON "PrivateNotes"("userId", "postId");

-- Discovery, retention, and future AI
CREATE TABLE "Notifications" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "actorId" TEXT,
  "postId" TEXT,
  "type" "NotificationType" NOT NULL,
  "message" TEXT NOT NULL,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Notifications_userId_read_createdAt_idx" ON "Notifications"("userId", "read", "createdAt");

CREATE TABLE "Reports" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "postId" TEXT,
  "commentId" TEXT,
  "reason" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Reports_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Challenges" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "durationDays" INTEGER NOT NULL,
  "promptTemplate" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Challenges_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Challenges_slug_key" ON "Challenges"("slug");

CREATE TABLE "ChallengeEntries" (
  "id" TEXT NOT NULL,
  "challengeId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "postId" TEXT,
  "dayNumber" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChallengeEntries_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ChallengeEntries_challengeId_userId_dayNumber_key" ON "ChallengeEntries"("challengeId", "userId", "dayNumber");

CREATE TABLE "AiSuggestions" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "postId" TEXT,
  "kind" TEXT NOT NULL,
  "prompt" TEXT NOT NULL,
  "output" TEXT NOT NULL,
  "accepted" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AiSuggestions_pkey" PRIMARY KEY ("id")
);

-- Foreign keys
ALTER TABLE "PostTags" ADD CONSTRAINT "PostTags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PostTags" ADD CONSTRAINT "PostTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Bookmarks" ADD CONSTRAINT "Bookmarks_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Bookmarks" ADD CONSTRAINT "Bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PostRevisions" ADD CONSTRAINT "PostRevisions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReadingHistory" ADD CONSTRAINT "ReadingHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReadingHistory" ADD CONSTRAINT "ReadingHistory_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Series" ADD CONSTRAINT "Series_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SeriesPosts" ADD CONSTRAINT "SeriesPosts_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SeriesPosts" ADD CONSTRAINT "SeriesPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Highlights" ADD CONSTRAINT "Highlights_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Highlights" ADD CONSTRAINT "Highlights_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PrivateNotes" ADD CONSTRAINT "PrivateNotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PrivateNotes" ADD CONSTRAINT "PrivateNotes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ChallengeEntries" ADD CONSTRAINT "ChallengeEntries_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChallengeEntries" ADD CONSTRAINT "ChallengeEntries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChallengeEntries" ADD CONSTRAINT "ChallengeEntries_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AiSuggestions" ADD CONSTRAINT "AiSuggestions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AiSuggestions" ADD CONSTRAINT "AiSuggestions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
