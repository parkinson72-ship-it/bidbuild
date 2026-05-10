/*
  Warnings:

  - You are about to drop the column `userId` on the `Bid` table. All the data in the column will be lost.
  - Added the required column `builderId` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN "location" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bid" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jobId" TEXT NOT NULL,
    "builderId" TEXT NOT NULL,
    CONSTRAINT "Bid_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bid_builderId_fkey" FOREIGN KEY ("builderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bid" ("amount", "createdAt", "id", "jobId", "message") SELECT "amount", "createdAt", "id", "jobId", "message" FROM "Bid";
DROP TABLE "Bid";
ALTER TABLE "new_Bid" RENAME TO "Bid";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
