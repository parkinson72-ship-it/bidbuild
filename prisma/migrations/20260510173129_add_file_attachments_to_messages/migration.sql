/*
  Warnings:

  - You are about to drop the `Bid` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `awardedBidId` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Job` table. All the data in the column will be lost.
  - Added the required column `budget` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Bid";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Job" ("createdAt", "description", "id", "title", "userId") SELECT "createdAt", "description", "id", "title", "userId" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "content" TEXT,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "fileType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" DATETIME,
    "clientId" TEXT,
    CONSTRAINT "Message_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("clientId", "content", "createdAt", "fileName", "fileType", "fileUrl", "id", "jobId", "readAt", "recipientId", "senderId") SELECT "clientId", "content", "createdAt", "fileName", "fileType", "fileUrl", "id", "jobId", "readAt", "recipientId", "senderId" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE UNIQUE INDEX "Message_clientId_key" ON "Message"("clientId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
