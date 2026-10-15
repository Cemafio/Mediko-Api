/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Pharmacy` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Pharmacy_email_key" ON "Pharmacy"("email");
