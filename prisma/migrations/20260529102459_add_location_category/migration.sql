/*
  Warnings:

  - The values [ACTIVE] on the enum `JobStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `category` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "JobStatus_new" AS ENUM ('OPEN', 'AWARDED', 'IN_PROGRESS', 'COMPLETED_PENDING', 'COMPLETED');
ALTER TABLE "Job" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Job" ALTER COLUMN "status" TYPE "JobStatus_new" USING ("status"::text::"JobStatus_new");
ALTER TYPE "JobStatus" RENAME TO "JobStatus_old";
ALTER TYPE "JobStatus_new" RENAME TO "JobStatus";
DROP TYPE "JobStatus_old";
ALTER TABLE "Job" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'OPEN';
