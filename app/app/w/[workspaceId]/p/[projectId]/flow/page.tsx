import { FlowWorkspace } from "@/components/flow/FlowWorkspace";

export default async function FlowPage({ params }: { params: Promise<{ workspaceId: string; projectId: string }> }) {
  const resolvedParams = await params;
  return <FlowWorkspace workspaceId={resolvedParams.workspaceId} projectId={resolvedParams.projectId} />;
}
