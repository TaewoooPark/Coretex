-- AlterEnum
ALTER TYPE "ActivityEventType" ADD VALUE 'FILE_IMPORTED';

-- CreateEnum
CREATE TYPE "FileAssetKind" AS ENUM ('FOLDER', 'FILE');

-- CreateTable
CREATE TABLE "FileAsset" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "parentId" TEXT,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "kind" "FileAssetKind" NOT NULL,
    "mimeType" TEXT,
    "sizeBytes" INTEGER NOT NULL DEFAULT 0,
    "checksum" TEXT,
    "importedNodeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FileAsset_projectId_path_key" ON "FileAsset"("projectId", "path");

-- CreateIndex
CREATE INDEX "FileAsset_projectId_idx" ON "FileAsset"("projectId");

-- CreateIndex
CREATE INDEX "FileAsset_parentId_idx" ON "FileAsset"("parentId");

-- CreateIndex
CREATE INDEX "FileAsset_importedNodeId_idx" ON "FileAsset"("importedNodeId");

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FileAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_importedNodeId_fkey" FOREIGN KEY ("importedNodeId") REFERENCES "ContextNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
