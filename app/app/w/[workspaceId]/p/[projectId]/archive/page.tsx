import { ArchivePageClient } from "@/components/archive/ArchivePageClient";

export default async function ArchivePage({ params }: { params: Promise<{ workspaceId: string; projectId: string }> }) {
  const resolvedParams = await params;
  return <ArchivePageClient workspaceId={resolvedParams.workspaceId} projectId={resolvedParams.projectId} />;
}
