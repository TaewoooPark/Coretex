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
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-000000?style=flat-square&logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-000000?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-000000?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-000000?style=flat-square&logo=prisma&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-000000?style=flat-square&logo=postgresql&logoColor=white" />
  <img alt="OpenAI-ready" src="https://img.shields.io/badge/OpenAI_ready-000000?style=flat-square&logo=openai&logoColor=white" />
  <img alt="Markdown" src="https://img.shields.io/badge/Markdown-000000?style=flat-square&logo=markdown&logoColor=white" />
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

<p align="center">
  <em>"Writing gives not memory, but only reminding."</em><br />
  — Plato, <i>Phaedrus</i> 275a
</p>

## Why CORETEX

Two and a half thousand years ago Plato already separated *mnēmē* — living memory — from *hypomnēsis*, the external reminder that writing leaves behind. The finished document is the reminder. The reasoning that produced it — the discarded drafts, the conversations that closed a branch, the argument that turned an idea into a decision — almost always disappears the moment the file is saved.

Most collaboration tools accept that loss as a fact of nature. They preserve artifacts, not reasoning. A file tree shows what exists. A chat transcript shows that people talked. A board shows that work moved. None of them reliably answer **why** a final output exists, **which** rejected path shaped it, or **where** a new teammate should start reading.

CORETEX treats the loss as an engineering problem rather than a metaphysical one. Project work is modelled as a directed lineage of assumptions, evidence, edits, arguments, decisions, and abandoned alternatives — a **decision genealogy graph** in which every meaningful unit of work becomes a *Traceable Work Node*. The final document is no longer the only artifact; it is the visible end of a chain the product keeps walkable.

This matters most where the discarded branch is still knowledge: startup pivots, research hypotheses, design feedback, strategy documents, product decisions, and handoffs between teams. In those settings, losing the *reason* behind a decision is often more expensive than losing the decision itself.

## Visual Prototype

CORETEX is a runnable visual prototype, not a production SaaS. The current demo makes the premise concrete through a graph workspace, node inspector, document editor, scoped chat, version history, local file import, search, time travel, and archive generation — built around one product question:

> Can a team trace where a final output came from, which drafts and conversations shaped it, and what evidence still supports the decision?

## What CORETEX Notices

| Observation | Product consequence |
| --- | --- |
| Context is causal, not decorative. | Work is modeled as directed node relationships rather than loose folders or isolated pages. |
| A final output has ancestry. | `IDEA`, `RESEARCH`, `DRAFT`, `FEEDBACK`, `DECISION`, `ASSET`, and `FINAL` nodes form a decision genealogy. |
| Conversations are evidence. | Chat messages can attach to nodes, generate suggestions, or become new nodes. |
| Versions are memory, not overwrite noise. | Document versions are immutable and can be restored as new versions. |
| Discarded alternatives still explain the final result. | Time travel and archive views preserve what existed before the current state. |
| AI should not decide for the team. | AI only extracts tags, related nodes, candidate edges, summaries, and explicit decision statements. |
| Visual shape changes thought. | The interface uses a dense brutalist monochrome system so structure, contrast, and lineage stay visible. |

The prototype keeps a blunt scope rule: if a feature helps track context, genealogy, decision reasons, or version flow, it belongs near the core. If it only makes CORETEX look like another file manager, whiteboard, or chat wrapper, it is secondary.

## Run The Demo

**Requirements**: Node.js 20 or newer (Next.js 16). No database is required — the prototype runs on an in-memory mock store that auto-seeds the demo workspace and project on first request.

```bash
git clone https://github.com/TaewoooPark/Coretex.git
cd Coretex
npm install
npm run dev
```

Open [`http://localhost:3000`](http://localhost:3000). The home route signs you in as the demo user and redirects to the workspace selector — pick the seeded **CORETEX Demo** workspace, then the **Project Demo** project, then the **Flow** tab.

Direct links once the dev server is running:

```text
http://localhost:3000/app/w/workspace_demo/p/project_demo/flow
http://localhost:3000/app/w/workspace_demo/p/project_demo/archive
```

### Optional configuration

Everything below is optional. The demo works without any of it.

| Variable | Effect when set |
| --- | --- |
| `OPENAI_API_KEY` | Enables the live OpenAI extraction path in `lib/ai/extractContext.ts`. Without it, CORETEX falls back to a deterministic local extractor (`#tags`, `@node-title` mentions, decision phrases). |
| `OPENAI_MODEL` | Overrides the default model (`gpt-4o-mini`) used by the extractor. |
| `CORETEX_LOCAL_LIBRARY_ROOT` | Overrides the directory scanned by the local file panel (default: `data/local-library`). |
| `DATABASE_URL` | Only consumed by `prisma` CLI commands (`npx prisma validate`, `npm run prisma:generate`, `npm run seed`). The running app does **not** read it. |

Copy `.env.example` to `.env` before touching anything Prisma-related:

```bash
cp .env.example .env
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

## Prototype Scope

CORETEX is a single-user visual prototype. Data lives in an in-memory demo store seeded from `data/local-library/project_demo`, so reloads reset to a known state and no external services are required. Authentication, real-time collaboration, external integrations (Slack, Figma, Drive, S3), vector search, and billing are intentionally out of scope. The product schema in `prisma/` is reference shape, not a live runtime.

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
