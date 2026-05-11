# CORETEX

**CORETEX는 노드 기반 협업 문서 시스템을 검증하기 위한 비주얼 프로토타입입니다.**

이 프로젝트는 업무를 폴더, 단일 문서, 분리된 채팅 로그로 관리하는 대신 문서, 메시지, 버전, 의사결정, 태그, 로컬 파일 자료를 **Traceable Work Node**로 만들고, 이 노드들을 방향성 의사결정 그래프로 연결하는 제품 방향을 실험합니다.

[English README](../../README.md)

![CORETEX visual prototype](../assets/coretex-hero.png)

## 이 프로젝트의 성격

CORETEX는 현재 production SaaS가 아니라 실행 가능한 상호작용 프로토타입입니다.

검증하려는 핵심 질문은 다음입니다.

> 최종 결과물이 어디서 시작됐고, 어떤 초안과 대화와 근거를 거쳐 지금 상태가 됐는지 팀이 빠르게 추적할 수 있는가?

현재 데모에서는 브루탈리즘 모노톤 UI 안에서 그래프 캔버스, 노드 인스펙터, 문서 편집기, 채팅, 타임트래블 바, 아카이브 리포트, 로컬 파일 import 흐름을 확인할 수 있습니다.

## 태그

`typescript` · `react` · `nextjs` · `knowledge-graph` · `information-visualization` · `local-first` · `markdown` · `llm` · `document-management` · `collaboration` · `react-flow` · `zustand`

태그는 공개 레포들에서 반복적으로 쓰인 방향성, 즉 그래프 인터페이스, local-first 워크플로, 지식 도구, markdown 기반 시스템, AI 보조 맥락 추출 계열을 CORETEX에 맞춰 조정했습니다.

## 데모에서 확인 가능한 것

개발 서버 실행 후 아래 주소를 엽니다.

```text
http://localhost:3000/app/w/workspace_demo/p/project_demo/flow
```

데모에서 확인할 수 있는 항목:

- **Graph workspace**: Context Node들이 방향성 계보 그래프로 표시됩니다.
- **Node selection**: 노드를 클릭하면 메타데이터, 문서, 채팅, 버전, 계보, AI 제안을 볼 수 있습니다.
- **Node creation**: `IDEA`, `BRIEF`, `RESEARCH`, `DRAFT`, `DECISION`, `ASSET`, `FINAL` 노드를 만들 수 있습니다.
- **Edge creation**: `SUPPORTS`, `REFINES`, `REFERENCES`, `DECIDES` 같은 의미 관계로 노드를 연결할 수 있습니다.
- **Cycle rejection**: DAG를 깨는 순환 edge는 API에서 거부됩니다.
- **Document editing**: TipTap editor에서 노드 문서를 편집하고 immutable version으로 저장할 수 있습니다.
- **Version restore**: 예전 버전을 열고 새 버전으로 복원할 수 있습니다.
- **Project chat**: 프로젝트 전체 채팅을 작성할 수 있습니다.
- **Node chat**: 선택한 노드에 scoped된 채팅을 작성할 수 있습니다.
- **Message-to-node**: 채팅 메시지를 새 Traceable Work Node로 만들 수 있습니다.
- **Manual linking**: 메시지를 활성 노드에 수동 연결할 수 있습니다.
- **Fallback AI extraction**: API key 없이도 `#tag`, `@node-title`, 결정 문장 패턴으로 태그와 링크 제안이 생성됩니다.
- **Document extraction**: 문서 저장 시 본문에서 태그와 관계 제안을 만들 수 있습니다.
- **Local file import**: `data/local-library/project_demo` 아래의 텍스트/Markdown 파일을 `ASSET` 노드로 가져올 수 있습니다.
- **Document search**: 노드 제목, 요약, 문서 본문, 메시지, 태그, 의사결정을 검색할 수 있습니다.
- **Time travel**: 하단 타임라인을 움직여 과거 그래프 상태를 읽기 전용으로 볼 수 있습니다.
- **Archive report**: 계보, 결정, 최종 산출물, 메시지, 태그, 소스 파일을 포함한 읽기 전용 아카이브를 생성할 수 있습니다.

아카이브 화면:

```text
http://localhost:3000/app/w/workspace_demo/p/project_demo/archive
```

## 비주얼 프로토타입 둘러보기

### 1. Graph Workspace

메인 화면은 의사결정 계보 그래프를 중심으로 구성됩니다. 노드는 추적 가능한 업무 단위이고, edge는 의미 관계이며, inspector에는 문서, 채팅, 버전, 계보, AI 맥락이 함께 모입니다.

![CORETEX graph workspace](../assets/coretex-graph-workspace.png)

### 2. Message To Node

채팅은 사라지는 보조 채널이 아니라 맥락의 근거입니다. 데모에서는 프로젝트 또는 노드 scoped 메시지를 기존 노드에 연결하거나 새 Traceable Work Node로 승격할 수 있습니다.

![CORETEX message to node workflow](../assets/coretex-message-to-node.png)

### 3. Local Files To Asset Nodes

로컬 파일 라이브러리는 파일/폴더 맥락을 데모 안으로 가져오는 프로토타입 브릿지입니다. 지원되는 텍스트 자료는 `ASSET` 노드로 import되고 그래프에 연결됩니다.

![CORETEX local file import workflow](../assets/coretex-file-import.png)

### 4. Time Travel And Archive

타임트래블 바는 특정 과거 시점의 그래프 상태를 읽기 전용으로 복원합니다. 아카이브 화면은 현재 프로젝트 그래프를 결정, 최종 산출물, 폐기안, 메시지, 태그, 소스 파일이 포함된 구조화 리포트로 만듭니다.

![CORETEX time travel and archive workflow](../assets/coretex-time-archive.png)

## 로컬 파일 라이브러리

프로토타입에는 로컬 파일/폴더 브릿지가 포함되어 있습니다.

```text
data/local-library/<projectId>/
```

데모 파일:

```text
data/local-library/project_demo/briefs/launch-brief.md
data/local-library/project_demo/research/context-loss-notes.txt
```

`Local Files` 패널에서 지원되는 텍스트 자료를 import하면 해당 파일이 `ASSET` 노드가 됩니다. import된 파일은 source metadata를 보존하고 archive에도 포함됩니다. import 시 그래프 노드가 선택되어 있으면 선택 노드에서 파일 asset 노드로 `REFERENCES` edge가 생성됩니다.

## 제품 모델

프로토타입의 중심 객체는 하나입니다.

**Traceable Work Node**

노드는 다음 질문에 답해야 합니다.

- 누가 만들었는가
- 언제 만들어졌는가
- 무엇을 담고 있는가
- 어디에서 파생되었는가
- 무엇을 야기했는가
- 어떤 메시지와 파일이 근거인가
- 어떤 버전 이력을 가지는가
- 의사결정 흐름에 포함되는가

그래서 CORETEX는 파일 관리자나 화이트보드가 아니라 맥락 그래프 프로토타입으로 설계되었습니다.

## 기술 스택

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- React Flow
- Zustand
- TanStack Query
- TipTap
- Zod
- PostgreSQL 제품 구조를 위한 Prisma schema와 migration
- 외부 서비스 없이 실행되는 in-memory local demo store

## 로컬 실행

```bash
npm install
npm run dev -- --port 3000
```

주요 주소:

```text
http://localhost:3000/auth/sign-in
http://localhost:3000/app
http://localhost:3000/app/w/workspace_demo/p/project_demo/flow
http://localhost:3000/app/w/workspace_demo/p/project_demo/archive
```

## 검증

```bash
npm run test
npx tsc --noEmit
npm run build
npx prisma validate
npm run prisma:generate
npm run seed
npm audit --json
```

`npm run build`는 `next build --webpack`을 사용합니다. 현재 sandbox에서 Next 16 Turbopack build가 내부 port bind를 시도해 막히기 때문입니다.

## 데이터 레이어

PostgreSQL 기반 제품 구조를 위한 Prisma 모델과 SQL migration이 포함되어 있습니다.

```text
prisma/schema.prisma
prisma/migrations/0001_init/migration.sql
prisma/migrations/0002_file_assets/migration.sql
```

로컬 프로토타입 실행 시에는 `lib/mock-db.ts`를 사용합니다. 따라서 PostgreSQL, NextAuth, object storage, pgvector, 외부 연동을 설정하지 않아도 데모를 실행할 수 있습니다.

## 현재 경계

프로토타입으로 구현된 것:

- graph workspace
- node/edge CRUD
- document versions
- scoped chat
- message-node linking
- message-to-node creation
- fallback semantic extraction
- local file import
- search
- time-travel view
- archive generation
- usage guard scaffolding

production infrastructure로 아직 구현하지 않은 것:

- 실제 NextAuth provider 설정
- runtime PostgreSQL persistence
- 실시간 공동 편집
- Slack, Figma, Google Drive, S3 sync
- pgvector search
- Stripe billing
- 조직 SSO
- production deployment hardening

## 라이선스

이 repository는 **open source가 아닙니다.**

Copyright (c) 2026 Taewoo Park. All rights reserved.

[LICENSE](../../LICENSE)를 확인하세요.
