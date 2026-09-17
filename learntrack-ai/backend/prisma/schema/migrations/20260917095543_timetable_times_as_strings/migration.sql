/*
  Warnings:

  - Changed the type of `start_time` on the `timetables` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `end_time` on the `timetables` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "timetables" DROP COLUMN "start_time",
ADD COLUMN     "start_time" VARCHAR(5) NOT NULL,
DROP COLUMN "end_time",
ADD COLUMN     "end_time" VARCHAR(5) NOT NULL;
