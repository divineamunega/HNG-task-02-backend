-- DropForeignKey
ALTER TABLE "UserOrganization" DROP CONSTRAINT "UserOrganization_organisationId_fkey";

-- DropForeignKey
ALTER TABLE "UserOrganization" DROP CONSTRAINT "UserOrganization_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserOrganization" ADD CONSTRAINT "UserOrganization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganization" ADD CONSTRAINT "UserOrganization_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
