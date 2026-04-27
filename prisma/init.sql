PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS "Campaign" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "campaignName" TEXT NOT NULL,
  "openingMessage" TEXT,
  "positioningAngle" TEXT,
  "targetCity" TEXT,
  "targetCategory" TEXT,
  "betaPrice" INTEGER NOT NULL DEFAULT 499,
  "startedAt" DATETIME,
  "endedAt" DATETIME,
  "notes" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Prospect" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "instagramUsername" TEXT NOT NULL,
  "profileUrl" TEXT,
  "artistName" TEXT,
  "city" TEXT,
  "state" TEXT,
  "followersCount" INTEGER,
  "followingCount" INTEGER,
  "bioText" TEXT,
  "category" TEXT NOT NULL DEFAULT 'unknown',
  "servicesDetected" TEXT,
  "hasWebsite" BOOLEAN NOT NULL DEFAULT false,
  "websiteUrl" TEXT,
  "websiteQualityScore" INTEGER NOT NULL DEFAULT 0,
  "profileQualityScore" INTEGER NOT NULL DEFAULT 0,
  "source" TEXT,
  "status" TEXT NOT NULL DEFAULT 'not_contacted',
  "interestScore" INTEGER NOT NULL DEFAULT 0,
  "notes" TEXT,
  "firstMessageSentAt" DATETIME,
  "firstReplyAt" DATETIME,
  "replyDelayMinutes" INTEGER,
  "lastMessageAt" DATETIME,
  "lastSeenAt" DATETIME,
  "seenWithoutReplyCount" INTEGER NOT NULL DEFAULT 0,
  "followupAttempts" INTEGER NOT NULL DEFAULT 0,
  "lastWebhookEventAt" DATETIME,
  "nextFollowupAt" DATETIME,
  "instagramUserId" TEXT,
  "instagramPageId" TEXT,
  "externalThreadId" TEXT,
  "archivedAt" DATETIME,
  "campaignId" INTEGER,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Prospect_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Prospect_instagramUsername_key" ON "Prospect"("instagramUsername");

CREATE TABLE IF NOT EXISTS "OutreachMessage" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "prospectId" INTEGER NOT NULL,
  "direction" TEXT NOT NULL,
  "channel" TEXT NOT NULL DEFAULT 'instagram',
  "messageText" TEXT NOT NULL,
  "sentOrReceivedAt" DATETIME NOT NULL,
  "isFirstMessage" BOOLEAN NOT NULL DEFAULT false,
  "isFirstReply" BOOLEAN NOT NULL DEFAULT false,
  "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
  "externalMessageId" TEXT,
  "seenAt" DATETIME,
  "rawPayload" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OutreachMessage_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "WebhookEvent" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "eventType" TEXT NOT NULL,
  "field" TEXT,
  "senderId" TEXT,
  "recipientId" TEXT,
  "externalMessageId" TEXT,
  "processedStatus" TEXT NOT NULL DEFAULT 'received',
  "payload" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ConversationAnalysis" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "prospectId" INTEGER NOT NULL,
  "stage" TEXT,
  "prospectMood" TEXT,
  "painConfirmed" BOOLEAN NOT NULL DEFAULT false,
  "painType" TEXT,
  "interestScore" INTEGER NOT NULL DEFAULT 0,
  "objection" TEXT,
  "askedPrice" BOOLEAN NOT NULL DEFAULT false,
  "askedDemo" BOOLEAN NOT NULL DEFAULT false,
  "shouldUseReplyDelayHook" BOOLEAN NOT NULL DEFAULT false,
  "suggestedReply" TEXT,
  "alternativeReply" TEXT,
  "nextAction" TEXT,
  "marketInsight" TEXT,
  "rawJson" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ConversationAnalysis_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Followup" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "prospectId" INTEGER NOT NULL,
  "followupAt" DATETIME NOT NULL,
  "followupReason" TEXT,
  "suggestedMessage" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "completedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Followup_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
