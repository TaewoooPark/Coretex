import { redirect } from "next/navigation";

export default async function ProjectHome({ params }: { params: Promise<{ workspaceId: string; projectId: string }> }) {
  const resolvedParams = await params;
  redirect(`/app/w/${resolvedParams.workspaceId}/p/${resolvedParams.projectId}/flow`);
}
