/*
  Warnings:

  - You are about to drop the column `builderId` on the `Bid` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Bid` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Bid` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Bid` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to drop the column `budget` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Job` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Bid` table without a default value. This is not possible if the table is not empty.
  - Made the column `message` on table `Bid` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bid" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "message" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Bid_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bid" ("amount", "id", "jobId", "message") SELECT "amount", "id", "jobId", "message" FROM "Bid";
DROP TABLE "Bid";
ALTER TABLE "new_Bid" RENAME TO "Bid";
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "awardedBidId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Job_awardedBidId_fkey" FOREIGN KEY ("awardedBidId") REFERENCES "Bid" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Job" ("createdAt", "description", "id", "title", "userId") SELECT "createdAt", "description", "id", "title", "userId" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE UNIQUE INDEX "Job_awardedBidId_key" ON "Job"("awardedBidId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
