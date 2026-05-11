import { seedDemoData } from "../lib/mock-db";

const db = seedDemoData();

console.log(
  JSON.stringify(
    {
      users: db.users.length,
      workspaces: db.workspaces.length,
      projects: db.projects.length,
      nodes: db.nodes.length,
      edges: db.edges.length,
      versions: db.versions.length,
      messages: db.messages.length,
      tags: db.tags.length
    },
    null,
    2
  )
);
