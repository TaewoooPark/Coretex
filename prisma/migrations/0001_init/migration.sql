-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('IDEA', 'BRIEF', 'RESEARCH', 'DRAFT', 'EXPERIMENT', 'FEEDBACK', 'DECISION', 'TASK', 'ASSET', 'FINAL', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "NodeStatus" AS ENUM ('RAW', 'IN_PROGRESS', 'REVIEW', 'DECIDED', 'DISCARDED', 'FINALIZED');

-- CreateEnum
CREATE TYPE "EdgeType" AS ENUM ('DERIVES_FROM', 'SUPPORTS', 'CONTRADICTS', 'REFINES', 'REPLACES', 'REFERENCES', 'DECIDES', 'BLOCKS');

-- CreateEnum
CREATE TYPE "LinkSource" AS ENUM ('MANUAL', 'AI', 'RULE');

-- CreateEnum
CREATE TYPE "ActivityEventType" AS ENUM ('NODE_CREATED', 'NODE_UPDATED', 'NODE_DELETED', 'EDGE_CREATED', 'EDGE_DELETED', 'VERSION_CREATED', 'MESSAGE_CREATED', 'MESSAGE_LINKED', 'TAG_CREATED', 'TAG_LINKED', 'DECISION_CREATED', 'ARCHIVE_CREATED');

-- CreateEnum
CREATE TYPE "BillingPlan" AS ENUM ('FREE', 'TEAM', 'BUSINESS', 'ENTERPRISE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceMember" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "WorkspaceRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContextNode" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "NodeType" NOT NULL,
    "status" "NodeStatus" NOT NULL DEFAULT 'RAW',
    "summary" TEXT,
    "content" JSONB,
    "positionX" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "positionY" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "currentVersionNo" INTEGER NOT NULL DEFAULT 1,
    "metadata" JSONB,
    "aiSummary" TEXT,
    "confidence" DOUBLE PRECISION,

    CONSTRAINT "ContextNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NodeEdge" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "fromNodeId" TEXT NOT NULL,
    "toNodeId" TEXT NOT NULL,
    "type" "EdgeType" NOT NULL,
    "label" TEXT,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "confidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "NodeEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentVersion" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "versionNo" INTEGER NOT NULL,
    "title" TEXT,
    "content" JSONB NOT NULL,
    "plainText" TEXT,
    "changeSummary" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "scopeNodeId" TEXT,
    "aiProcessed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageNodeLink" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "source" "LinkSource" NOT NULL DEFAULT 'MANUAL',
    "confidence" DOUBLE PRECISION,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageNodeLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SemanticTag" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalized" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SemanticTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NodeTag" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "source" "LinkSource" NOT NULL DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NodeTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageTag" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "source" "LinkSource" NOT NULL DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Decision" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "rationale" TEXT,
    "outcome" TEXT,
    "decidedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityEvent" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "nodeId" TEXT,
    "actorId" TEXT,
    "type" "ActivityEventType" NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectArchive" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectArchive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingAccount" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "plan" "BillingPlan" NOT NULL DEFAULT 'FREE',
    "nodeLimit" INTEGER NOT NULL DEFAULT 100,
    "storageLimitMb" INTEGER NOT NULL DEFAULT 500,
    "aiExtractionLimit" INTEGER NOT NULL DEFAULT 100,
    "aiExtractionCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_slug_key" ON "Workspace"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceMember_workspaceId_userId_key" ON "WorkspaceMember"("workspaceId", "userId");

-- CreateIndex
CREATE INDEX "ContextNode_projectId_idx" ON "ContextNode"("projectId");

-- CreateIndex
CREATE INDEX "ContextNode_type_idx" ON "ContextNode"("type");

-- CreateIndex
CREATE INDEX "ContextNode_status_idx" ON "ContextNode"("status");

-- CreateIndex
CREATE INDEX "ContextNode_createdAt_idx" ON "ContextNode"("createdAt");

-- CreateIndex
CREATE INDEX "NodeEdge_projectId_idx" ON "NodeEdge"("projectId");

-- CreateIndex
CREATE INDEX "NodeEdge_fromNodeId_idx" ON "NodeEdge"("fromNodeId");

-- CreateIndex
CREATE INDEX "NodeEdge_toNodeId_idx" ON "NodeEdge"("toNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "NodeEdge_fromNodeId_toNodeId_type_key" ON "NodeEdge"("fromNodeId", "toNodeId", "type");

-- CreateIndex
CREATE INDEX "DocumentVersion_nodeId_idx" ON "DocumentVersion"("nodeId");

-- CreateIndex
CREATE INDEX "DocumentVersion_createdAt_idx" ON "DocumentVersion"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentVersion_nodeId_versionNo_key" ON "DocumentVersion"("nodeId", "versionNo");

-- CreateIndex
CREATE INDEX "Message_projectId_idx" ON "Message"("projectId");

-- CreateIndex
CREATE INDEX "Message_scopeNodeId_idx" ON "Message"("scopeNodeId");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MessageNodeLink_messageId_nodeId_key" ON "MessageNodeLink"("messageId", "nodeId");

-- CreateIndex
CREATE UNIQUE INDEX "SemanticTag_projectId_normalized_key" ON "SemanticTag"("projectId", "normalized");

-- CreateIndex
CREATE UNIQUE INDEX "NodeTag_nodeId_tagId_key" ON "NodeTag"("nodeId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageTag_messageId_tagId_key" ON "MessageTag"("messageId", "tagId");

-- CreateIndex
CREATE INDEX "ActivityEvent_projectId_idx" ON "ActivityEvent"("projectId");

-- CreateIndex
CREATE INDEX "ActivityEvent_nodeId_idx" ON "ActivityEvent"("nodeId");

-- CreateIndex
CREATE INDEX "ActivityEvent_createdAt_idx" ON "ActivityEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BillingAccount_workspaceId_key" ON "BillingAccount"("workspaceId");

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextNode" ADD CONSTRAINT "ContextNode_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextNode" ADD CONSTRAINT "ContextNode_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeEdge" ADD CONSTRAINT "NodeEdge_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeEdge" ADD CONSTRAINT "NodeEdge_fromNodeId_fkey" FOREIGN KEY ("fromNodeId") REFERENCES "ContextNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeEdge" ADD CONSTRAINT "NodeEdge_toNodeId_fkey" FOREIGN KEY ("toNodeId") REFERENCES "ContextNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentVersion" ADD CONSTRAINT "DocumentVersion_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "ContextNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentVersion" ADD CONSTRAINT "DocumentVersion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageNodeLink" ADD CONSTRAINT "MessageNodeLink_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageNodeLink" ADD CONSTRAINT "MessageNodeLink_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "ContextNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SemanticTag" ADD CONSTRAINT "SemanticTag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeTag" ADD CONSTRAINT "NodeTag_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "ContextNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeTag" ADD CONSTRAINT "NodeTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "SemanticTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageTag" ADD CONSTRAINT "MessageTag_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageTag" ADD CONSTRAINT "MessageTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "SemanticTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "ContextNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "ContextNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectArchive" ADD CONSTRAINT "ProjectArchive_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingAccount" ADD CONSTRAINT "BillingAccount_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
