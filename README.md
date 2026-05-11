<h1 align="center">CORETEX</h1>

<p align="center">
  <strong>Visual prototype for traceable collaborative documents.</strong><br />
  Documents, chats, versions, decisions, and local files rendered as a decision genealogy graph.
</p>

<p align="center">
  <img alt="License: Proprietary" src="https://img.shields.io/badge/license-proprietary-333333?style=flat-square&labelColor=000000" />
  <img alt="Top language" src="https://img.shields.io/github/languages/top/TaewoooPark/Coretex?style=flat-square&labelColor=000000&color=333333" />
  <img alt="Repository stars" src="https://img.shields.io/github/stars/TaewoooPark/Coretex?style=flat-square&labelColor=000000&color=333333" />
  <img alt="Last commit" src="https://img.shields.io/github/last-commit/TaewoooPark/Coretex?style=flat-square&labelColor=000000&color=333333" />
</p>

<p align="center">
  <a href="./docs/ko/README.md">한국어 README</a> ·
  <a href="https://github.com/TaewoooPark/NODEPROMPT">NODEPROMPT</a> ·
  <a href="https://github.com/TaewoooPark/PAIDEIA">PAIDEIA</a> ·
  <a href="https://taewoopark.com">taewoopark.com</a>
</p>

<p align="center">
  <img src="./docs/assets/coretex-hero.svg" alt="CORETEX visual prototype overview" width="100%" />
</p>

## Visual Prototype

CORETEX is a runnable visual prototype, not a production SaaS. It explores a product direction where project work is not buried in folders, detached chat logs, and isolated document versions. Instead, every meaningful unit of work becomes a **Traceable Work Node** inside a directed graph.

The prototype is built to test one product question:

> Can a team trace where a final output came from, which drafts and conversations shaped it, and what evidence still supports the decision?

The current demo makes that question concrete through a graph workspace, node inspector, document editor, scoped chat, version history, local file import, search, time travel, and archive generation.

## Topic Boxes

<p align="center">
  <img alt="#typescript" src="https://img.shields.io/badge/%23typescript-333333?style=flat-square&labelColor=000000" />
  <img alt="#react" src="https://img.shields.io/badge/%23react-333333?style=flat-square&labelColor=000000" />
  <img alt="#nextjs" src="https://img.shields.io/badge/%23nextjs-333333?style=flat-square&labelColor=000000" />
  <img alt="#knowledge-graph" src="https://img.shields.io/badge/%23knowledge--graph-333333?style=flat-square&labelColor=000000" />
  <img alt="#information-visualization" src="https://img.shields.io/badge/%23information--visualization-333333?style=flat-square&labelColor=000000" />
  <img alt="#local-first" src="https://img.shields.io/badge/%23local--first-333333?style=flat-square&labelColor=000000" />
  <img alt="#markdown" src="https://img.shields.io/badge/%23markdown-333333?style=flat-square&labelColor=000000" />
  <img alt="#llm" src="https://img.shields.io/badge/%23llm-333333?style=flat-square&labelColor=000000" />
  <img alt="#document-management" src="https://img.shields.io/badge/%23document--management-333333?style=flat-square&labelColor=000000" />
  <img alt="#collaboration" src="https://img.shields.io/badge/%23collaboration-333333?style=flat-square&labelColor=000000" />
  <img alt="#react-flow" src="https://img.shields.io/badge/%23react--flow-333333?style=flat-square&labelColor=000000" />
  <img alt="#zustand" src="https://img.shields.io/badge/%23zustand-333333?style=flat-square&labelColor=000000" />
</p>

The topic set follows the public taxonomy used across my graph and knowledge-tool repositories, especially NODEPROMPT and PAIDEIA: graph interfaces, local-first workflows, markdown systems, and AI-assisted context extraction.

## Demo Route

Start the dev server and open the flow workspace:

```bash
npm install
npm run dev -- --port 3000
```

```text
http://localhost:3000/app/w/workspace_demo/p/project_demo/flow
```

Archive route:

```text
http://localhost:3000/app/w/workspace_demo/p/project_demo/archive
```

## What The Demo Shows

| Surface | What you can verify |
| --- | --- |
| Graph workspace | Directed genealogy graph with `IDEA`, `BRIEF`, `RESEARCH`, `DRAFT`, `DECISION`, `ASSET`, and `FINAL` nodes. |
| Node inspector | Metadata, document content, chat, versions, genealogy, and AI suggestions stay attached to the selected node. |
| Edge model | Semantic relationships such as `SUPPORTS`, `REFINES`, `REFERENCES`, and `DECIDES`; cycle-creating edges are rejected. |
| Document editing | TipTap document editing with immutable saved versions and restore-as-new-version behavior. |
| Scoped chat | Project-level and node-level messages, manual message-node linking, and message-to-node promotion. |
| Fallback extraction | `#tags`, `@node-title` mentions, and decision phrases produce semantic suggestions without an API key. |
| Local files | Text and Markdown assets from `data/local-library/project_demo` can be imported as `ASSET` nodes. |
| Search | Node titles, summaries, document body text, messages, tags, and decisions are searchable. |
| Time travel | Bottom timeline reconstructs a past graph state in read-only mode. |
| Archive | Read-only project report with genealogy, decisions, final outputs, discarded alternatives, messages, tags, and source files. |

## Visual Tour

### Graph Workspace

The main canvas treats work as a directed decision graph. Nodes are traceable units of work, and edges preserve why one unit exists because of another.

<p align="center">
  <img src="./docs/assets/coretex-graph-workspace.svg" alt="CORETEX graph workspace" width="100%" />
</p>

### Message To Node

Chat is not disposable context. A project or node-scoped message can be linked to an existing node or promoted into a new Traceable Work Node.

<p align="center">
  <img src="./docs/assets/coretex-message-to-node.svg" alt="CORETEX message to node workflow" width="100%" />
</p>

### Local Files To Asset Nodes

The local file library is the prototype bridge for folder context. Supported text assets become `ASSET` nodes and keep source metadata.

<p align="center">
  <img src="./docs/assets/coretex-file-import.svg" alt="CORETEX local file import workflow" width="100%" />
</p>

### Time Travel And Archive

The timeline reconstructs historical graph states. The archive route turns the current graph into a structured project memory.

<p align="center">
  <img src="./docs/assets/coretex-time-archive.svg" alt="CORETEX time travel and archive workflow" width="100%" />
</p>

## Product Model

The core object is the **Traceable Work Node**. A node should answer:

| Question | Prototype support |
| --- | --- |
| Who created this unit of work? | Node metadata and message authorship. |
| What does it contain? | Title, summary, type, tags, document body, and linked files. |
| Where did it come from? | Incoming semantic edges and source chat/file references. |
| What did it cause? | Outgoing semantic edges and downstream final outputs. |
| Which evidence supports it? | Scoped messages, imported assets, and document versions. |
| How did it change? | Immutable document versions and restore flow. |
| Did it affect a decision? | `DECISION` nodes, `DECIDES` edges, and archive sections. |

This is why CORETEX is framed as a context graph rather than a file manager, whiteboard, or chat wrapper.

## Stack

| Layer | Tools |
| --- | --- |
| App | Next.js App Router, React, TypeScript |
| Interface | Tailwind CSS, React Flow, TipTap |
| State and data | Zustand, TanStack Query, Zod |
| Product schema | Prisma models and SQL migrations for PostgreSQL |
| Prototype runtime | In-memory local demo store in `lib/mock-db.ts` |

## Local File Library

The prototype reads from:

```text
data/local-library/<projectId>/
```

Demo files:

```text
data/local-library/project_demo/briefs/launch-brief.md
data/local-library/project_demo/research/context-loss-notes.txt
```

When a supported text asset is imported from the `Local Files` panel, CORETEX creates an `ASSET` node, stores source metadata, and includes the source file in the archive. If another graph node is selected during import, the app creates a `REFERENCES` edge from that node to the imported asset.

## Verify

```bash
npm run test
npx tsc --noEmit
npm run build
npx prisma validate
npm run prisma:generate
npm run seed
npm audit --json
```

`npm run build` uses `next build --webpack` because Next 16 Turbopack build attempts an internal port bind that is blocked in this sandbox.

## Current Boundaries

Implemented as prototype behavior:

| Implemented | Not production infrastructure yet |
| --- | --- |
| Graph workspace | Real NextAuth provider setup |
| Node and edge CRUD | Runtime PostgreSQL persistence |
| Document versions | Real-time collaborative editing |
| Scoped chat | Slack, Figma, Google Drive, or S3 sync |
| Message-node linking | pgvector search |
| Message-to-node creation | Stripe billing |
| Fallback semantic extraction | Organization SSO |
| Local file import | Production deployment hardening |
| Search, time travel, archive generation | Production observability and audit policy |

## License

This repository is public for visibility, but it is **not open source**.

Copyright (c) 2026 Taewoo Park. All rights reserved. See [LICENSE](./LICENSE).

## Connect

<p align="center">
  <a href="https://github.com/TaewoooPark"><img alt="GitHub" src="https://img.shields.io/badge/GitHub-000000?style=flat-square&logo=github&logoColor=white" /></a>
  <a href="https://x.com/theoverstrcture"><img alt="X" src="https://img.shields.io/badge/X-000000?style=flat-square&logo=x&logoColor=white" /></a>
  <a href="https://www.linkedin.com/in/taewoo-park-427a05352"><img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-000000?style=flat-square&logo=linkedin&logoColor=white" /></a>
  <a href="https://www.instagram.com/t.wo0_x/"><img alt="Instagram" src="https://img.shields.io/badge/Instagram-000000?style=flat-square&logo=instagram&logoColor=white" /></a>
  <a href="https://taewoopark.com"><img alt="Website" src="https://img.shields.io/badge/taewoopark.com-000000?style=flat-square" /></a>
  <a href="mailto:ptw151125@kaist.ac.kr"><img alt="Email" src="https://img.shields.io/badge/Email-000000?style=flat-square&logo=gmail&logoColor=white" /></a>
</p>
