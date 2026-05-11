<h1 align="center">CORETEX</h1>

<p align="center">
  <strong>추적 가능한 협업 문서를 위한 비주얼 프로토타입.</strong><br />
  문서, 채팅, 버전, 의사결정, 로컬 파일을 방향성 의사결정 계보 그래프로 다룹니다.
</p>

<p align="center">
  <img alt="License: Proprietary" src="https://img.shields.io/badge/license-proprietary-333333?style=flat-square&labelColor=000000" />
  <img alt="Top language" src="https://img.shields.io/github/languages/top/TaewoooPark/Coretex?style=flat-square&labelColor=000000&color=333333" />
  <img alt="Repository stars" src="https://img.shields.io/github/stars/TaewoooPark/Coretex?style=flat-square&labelColor=000000&color=333333" />
  <img alt="Last commit" src="https://img.shields.io/github/last-commit/TaewoooPark/Coretex?style=flat-square&labelColor=000000&color=333333" />
</p>

<p align="center">
  <a href="../../README.md">English README</a> ·
  <a href="https://github.com/TaewoooPark/NODEPROMPT">NODEPROMPT</a> ·
  <a href="https://github.com/TaewoooPark/PAIDEIA">PAIDEIA</a> ·
  <a href="https://taewoopark.com">taewoopark.com</a>
</p>

<p align="center">
  <img src="../assets/coretex-hero.svg" alt="CORETEX visual prototype overview" width="100%" />
</p>

## 비주얼 프로토타입

CORETEX는 production SaaS가 아니라 실행 가능한 비주얼 프로토타입입니다. 업무가 폴더, 분리된 채팅 로그, 독립 문서 버전에 묻히는 대신, 의미 있는 작업 단위를 **Traceable Work Node**로 만들고 방향성 그래프 안에서 추적하는 제품 방향을 검증합니다.

프로토타입이 검증하려는 질문은 하나입니다.

> 최종 결과물이 어디서 시작됐고, 어떤 초안과 대화와 근거를 거쳐 지금 상태가 됐는지 팀이 빠르게 추적할 수 있는가?

현재 데모에서는 그래프 워크스페이스, 노드 인스펙터, 문서 편집기, scoped chat, 버전 기록, 로컬 파일 import, 검색, 타임트래블, 아카이브 생성을 확인할 수 있습니다.

## 해시태그 박스

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

태그 구성은 NODEPROMPT와 PAIDEIA에서 반복적으로 쓰인 공개 레포 분류를 CORETEX에 맞춰 조정했습니다. 그래프 인터페이스, local-first 워크플로, markdown 기반 시스템, AI 보조 맥락 추출 계열입니다.

## 데모 주소

개발 서버를 실행한 뒤 flow workspace를 엽니다.

```bash
npm install
npm run dev -- --port 3000
```

```text
http://localhost:3000/app/w/workspace_demo/p/project_demo/flow
```

아카이브 주소:

```text
http://localhost:3000/app/w/workspace_demo/p/project_demo/archive
```

## 데모에서 확인 가능한 것

| 영역 | 확인 가능한 내용 |
| --- | --- |
| Graph workspace | `IDEA`, `BRIEF`, `RESEARCH`, `DRAFT`, `DECISION`, `ASSET`, `FINAL` 노드가 방향성 계보 그래프로 표시됩니다. |
| Node inspector | 선택한 노드에 메타데이터, 문서 본문, 채팅, 버전, 계보, AI 제안이 붙어 있습니다. |
| Edge model | `SUPPORTS`, `REFINES`, `REFERENCES`, `DECIDES` 관계를 만들 수 있고, DAG를 깨는 edge는 거부됩니다. |
| Document editing | TipTap 문서 편집, immutable version 저장, 예전 버전을 새 버전으로 복원하는 흐름을 확인할 수 있습니다. |
| Scoped chat | 프로젝트 전체 채팅과 노드 scoped 채팅, message-node 수동 연결, message-to-node 생성을 확인할 수 있습니다. |
| Fallback extraction | API key 없이도 `#tag`, `@node-title`, 결정 문장 패턴에서 의미 제안이 생성됩니다. |
| Local files | `data/local-library/project_demo` 아래의 텍스트/Markdown 자료를 `ASSET` 노드로 import할 수 있습니다. |
| Search | 노드 제목, 요약, 문서 본문, 메시지, 태그, 의사결정을 검색할 수 있습니다. |
| Time travel | 하단 타임라인으로 과거 그래프 상태를 읽기 전용으로 재구성할 수 있습니다. |
| Archive | 계보, 결정, 최종 산출물, 폐기안, 메시지, 태그, 소스 파일을 포함한 읽기 전용 리포트를 생성합니다. |

## 비주얼 둘러보기

### Graph Workspace

메인 캔버스는 업무를 방향성 의사결정 그래프로 다룹니다. 노드는 추적 가능한 업무 단위이고, edge는 한 작업이 다른 작업으로 이어진 이유를 보존합니다.

<p align="center">
  <img src="../assets/coretex-graph-workspace.svg" alt="CORETEX graph workspace" width="100%" />
</p>

### Message To Node

채팅은 사라지는 보조 채널이 아니라 근거가 되는 맥락입니다. 프로젝트 또는 노드 scoped 메시지를 기존 노드에 연결하거나 새 Traceable Work Node로 승격할 수 있습니다.

<p align="center">
  <img src="../assets/coretex-message-to-node.svg" alt="CORETEX message to node workflow" width="100%" />
</p>

### Local Files To Asset Nodes

로컬 파일 라이브러리는 폴더 맥락을 데모 안으로 가져오는 프로토타입 브릿지입니다. 지원되는 텍스트 자료는 `ASSET` 노드가 되고 source metadata를 유지합니다.

<p align="center">
  <img src="../assets/coretex-file-import.svg" alt="CORETEX local file import workflow" width="100%" />
</p>

### Time Travel And Archive

타임라인은 과거 그래프 상태를 재구성합니다. 아카이브 화면은 현재 그래프를 구조화된 프로젝트 메모리로 바꿉니다.

<p align="center">
  <img src="../assets/coretex-time-archive.svg" alt="CORETEX time travel and archive workflow" width="100%" />
</p>

## 제품 모델

핵심 객체는 **Traceable Work Node**입니다. 노드는 다음 질문에 답해야 합니다.

| 질문 | 프로토타입 지원 |
| --- | --- |
| 누가 만들었는가? | 노드 메타데이터와 메시지 작성자. |
| 무엇을 담고 있는가? | 제목, 요약, 타입, 태그, 문서 본문, 연결된 파일. |
| 어디에서 파생되었는가? | incoming semantic edge와 source chat/file reference. |
| 무엇을 야기했는가? | outgoing semantic edge와 downstream final output. |
| 어떤 근거가 있는가? | scoped message, import asset, document version. |
| 어떻게 바뀌었는가? | immutable document version과 restore flow. |
| 의사결정에 영향을 줬는가? | `DECISION` 노드, `DECIDES` edge, archive section. |

그래서 CORETEX는 파일 관리자, 화이트보드, 채팅 wrapper가 아니라 context graph로 설계되었습니다.

## 기술 스택

| 레이어 | 도구 |
| --- | --- |
| App | Next.js App Router, React, TypeScript |
| Interface | Tailwind CSS, React Flow, TipTap |
| State and data | Zustand, TanStack Query, Zod |
| Product schema | PostgreSQL을 위한 Prisma model과 SQL migration |
| Prototype runtime | `lib/mock-db.ts`의 in-memory local demo store |

## 로컬 파일 라이브러리

프로토타입은 아래 경로를 읽습니다.

```text
data/local-library/<projectId>/
```

데모 파일:

```text
data/local-library/project_demo/briefs/launch-brief.md
data/local-library/project_demo/research/context-loss-notes.txt
```

`Local Files` 패널에서 지원되는 텍스트 자료를 import하면 CORETEX는 `ASSET` 노드를 만들고 source metadata를 저장하며 archive에도 파일을 포함합니다. 다른 그래프 노드가 선택된 상태에서 import하면 선택 노드에서 asset 노드로 `REFERENCES` edge가 생성됩니다.

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

## 현재 경계

프로토타입으로 구현된 것과 아직 production infrastructure가 아닌 것을 분리하면 다음과 같습니다.

| 구현됨 | 아직 production infrastructure 아님 |
| --- | --- |
| Graph workspace | 실제 NextAuth provider 설정 |
| Node/edge CRUD | runtime PostgreSQL persistence |
| Document versions | 실시간 공동 편집 |
| Scoped chat | Slack, Figma, Google Drive, S3 sync |
| Message-node linking | pgvector search |
| Message-to-node creation | Stripe billing |
| Fallback semantic extraction | 조직 SSO |
| Local file import | production deployment hardening |
| Search, time travel, archive generation | production observability and audit policy |

## 라이선스

이 repository는 공개되어 있지만 **open source가 아닙니다**.

Copyright (c) 2026 Taewoo Park. All rights reserved. [LICENSE](../../LICENSE)를 확인하세요.

## Connect

<p align="center">
  <a href="https://github.com/TaewoooPark"><img alt="GitHub" src="https://img.shields.io/badge/GitHub-000000?style=flat-square&logo=github&logoColor=white" /></a>
  <a href="https://x.com/theoverstrcture"><img alt="X" src="https://img.shields.io/badge/X-000000?style=flat-square&logo=x&logoColor=white" /></a>
  <a href="https://www.linkedin.com/in/taewoo-park-427a05352"><img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-000000?style=flat-square&logo=linkedin&logoColor=white" /></a>
  <a href="https://www.instagram.com/t.wo0_x/"><img alt="Instagram" src="https://img.shields.io/badge/Instagram-000000?style=flat-square&logo=instagram&logoColor=white" /></a>
  <a href="https://taewoopark.com"><img alt="Website" src="https://img.shields.io/badge/taewoopark.com-000000?style=flat-square" /></a>
  <a href="mailto:ptw151125@kaist.ac.kr"><img alt="Email" src="https://img.shields.io/badge/Email-000000?style=flat-square&logo=gmail&logoColor=white" /></a>
</p>
