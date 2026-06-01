/*
  Warnings:

  - You are about to drop the column `price` on the `Wisata` table. All the data in the column will be lost.
  - You are about to drop the column `quota` on the `Wisata` table. All the data in the column will be lost.
  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_wisataId_fkey";

-- AlterTable
ALTER TABLE "Wisata" DROP COLUMN "price",
DROP COLUMN "quota",
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactWa" TEXT;

-- DropTable
DROP TABLE "Booking";

-- DropEnum
DROP TYPE "BookingStatus";
