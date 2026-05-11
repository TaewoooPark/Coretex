CORETEX 구현 세부 명세서

0. 문서 목적

이 문서는 CORETEX: 노드 기반 협업 문서 관리 시스템을 Codex 또는 유사한 AI 코딩 에이전트로 구현하기 위한 상세 제품·기술 명세서다.

서비스의 핵심은 기존 협업 툴의 선형적 UI를 벗어나, 프로젝트의 문서·대화·버전·의사결정·참조 자료를 맥락 노드 Context Node와 의사결정 계보 그래프 Decision Genealogy Graph로 재구성하는 것이다.

UI 디자인 방향은 브루탈리즘 모노톤 Brutalist Monotone이다.
즉, 장식적이고 부드러운 SaaS UI가 아니라, 두꺼운 선, 명확한 대비, 흑백 중심의 정보 밀도 높은 인터페이스를 구현한다.

⸻

1. 기본 구현 전제

1.1 제품 유형

CORETEX는 웹 기반 B2B SaaS 협업 도구로 구현한다.

초기 구현 범위는 다음과 같다.

* 웹앱 MVP
* 워크스페이스 기반 프로젝트 관리
* 프로젝트별 노드 그래프
* 노드 기반 문서 편집
* 노드 간 부모·자식 관계 연결
* 채팅과 문서의 의미론적 연결
* 버전 히스토리
* Time-Travel Slider
* AI 기반 태그·링크 제안
* 프로젝트 아카이브 생성

⸻

1.2 권장 기술 스택

Codex 구현 기준으로 다음 스택을 고정한다.

Frontend:
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- React Flow
- Zustand
- TanStack Query
- TipTap Editor
Backend:
- Next.js Route Handlers
- Prisma ORM
- PostgreSQL
- pgvector optional
- OpenAI API optional
- Zod validation
Auth:
- NextAuth 또는 Supabase Auth
- MVP에서는 NextAuth + Prisma Adapter 권장
Storage:
- Local mock storage for MVP
- 이후 S3-compatible storage로 확장
Billing:
- MVP에서는 usage limit만 구현
- 이후 Stripe Billing 연동 가능하도록 데이터 구조 선반영

⸻

1.3 구현 철학

CORETEX는 파일 관리 앱이 아니다.
또한 단순한 화이트보드 앱도 아니다.

구현의 중심 객체는 다음 1개다.

Traceable Work Node, TWN

TWN은 다음 정보를 반드시 가진다.

누가 만들었는가
언제 만들어졌는가
무엇을 담고 있는가
어디에서 파생되었는가
무엇을 야기했는가
어떤 대화와 연결되는가
어떤 버전 이력을 갖는가
어떤 결정의 근거가 되는가

즉, CORETEX의 모든 데이터는 독립 파일이 아니라 계보를 가진 맥락 단위로 존재해야 한다.

⸻

2. 제품 요약

2.1 한 줄 정의

CORETEX는 프로젝트의 문서, 대화, 의사결정, 버전, 피드백을 노드 기반 흐름으로 연결하여 협업의 맥락 손실을 줄이는 비선형 협업 문서 관리 시스템이다.

⸻

2.2 핵심 가치

사용자는 CORETEX를 통해 다음 질문에 즉시 답할 수 있어야 한다.

이 최종 결과물은 어디서 시작되었는가?
어떤 초안과 실험을 거쳤는가?
어떤 피드백 때문에 수정되었는가?
어떤 채팅에서 이 결정이 나왔는가?
폐기된 버전에는 어떤 논리가 있었는가?
새 팀원이 프로젝트 맥락을 어디서부터 따라가야 하는가?

⸻

2.3 핵심 사용자

1. 스타트업 팀

* 제품 방향성이 자주 바뀜
* 문서와 대화가 Slack, Notion, Figma, Google Drive에 분산됨
* “왜 이렇게 결정했는지”가 빠르게 사라짐

2. 연구팀

* 가설, 실험, 피드백, 결과물이 반복됨
* 실패한 실험의 맥락도 중요함
* 논문, 리포트, 실험 로그의 계보 관리가 필요함

3. 디자인·전략 조직

* 아이디어 발산과 수렴 과정이 복잡함
* 클라이언트 피드백과 내부 의사결정이 얽힘
* 최종안보다 과정의 논리 추적이 중요함

4. 개발·프로덕트 팀

* PRD, 이슈, 회의록, 디자인, 개발 결정이 분산됨
* 변경 이유와 버전 흐름을 복원하기 어려움
* 신규 팀원 온보딩에 많은 시간이 듦

⸻

3. MVP 범위

3.1 반드시 구현할 기능

MVP에서 반드시 구현해야 하는 기능은 다음이다.

1. 사용자 인증
2. 워크스페이스 생성
3. 프로젝트 생성
4. 프로젝트 그래프 화면
5. Context Node 생성, 수정, 삭제
6. 노드 간 방향성 Edge 생성
7. 노드 문서 편집
8. 문서 버전 저장
9. 노드별 채팅
10. 프로젝트 전체 채팅
11. 채팅 메시지와 노드 수동 연결
12. AI 기반 태그·노드 연결 제안
13. Time-Travel Slider
14. 특정 시점의 그래프·문서 버전 복원
15. 노드 검색
16. 태그 검색
17. 프로젝트 아카이브 생성
18. 브루탈리즘 모노톤 UI

⸻

3.2 MVP에서 제외할 기능

초기 구현에서는 다음 기능을 제외한다.

1. 실시간 동시 편집
2. Figma, Slack, Google Drive 실제 연동
3. 고급 권한 매트릭스
4. Stripe 결제 실연동
5. 완전한 벡터 검색
6. 자동 레이아웃 고도화
7. 모바일 최적화
8. 오프라인 모드
9. 파일 대용량 업로드
10. 조직 단위 SSO

단, 추후 확장을 위해 데이터 모델에는 일부 필드를 미리 반영한다.

⸻

4. 정보 구조

4.1 라우팅 구조

/
  Landing or redirect
/auth/sign-in
/auth/sign-up
/app
  Workspace selector
/app/w/[workspaceId]
  Workspace dashboard
/app/w/[workspaceId]/projects
  Project list
/app/w/[workspaceId]/p/[projectId]
  Project home redirect to /flow
/app/w/[workspaceId]/p/[projectId]/flow
  Main graph workspace
/app/w/[workspaceId]/p/[projectId]/archive
  Archive view
/app/w/[workspaceId]/settings
  Workspace settings
/app/w/[workspaceId]/billing
  Usage and billing placeholder

⸻

4.2 메인 화면 구조

/flow 화면은 CORETEX의 핵심 화면이다.

┌──────────────────────────────────────────────────────────────┐
│ TOP BAR                                                      │
│ Workspace / Project / Search / Command / User                │
├───────────────┬────────────────────────────┬─────────────────┤
│ LEFT SIDEBAR  │ GRAPH CANVAS               │ RIGHT INSPECTOR │
│               │                            │                 │
│ Project nodes │ Context Node graph          │ Active node     │
│ Tags          │ DAG visualization           │ Metadata        │
│ Filters       │ Edge relationship           │ Versions        │
│               │                            │ Linked chats    │
├───────────────┴────────────────────────────┴─────────────────┤
│ BOTTOM TIME-TRAVEL BAR                                       │
│ Timeline slider / current snapshot / restore button          │
└──────────────────────────────────────────────────────────────┘

⸻

5. 주요 개념 정의

5.1 Context Node

Context Node는 CORETEX의 핵심 단위다.

하나의 노드는 다음 중 하나의 유형을 가진다.

type NodeType =
  | "IDEA"
  | "BRIEF"
  | "RESEARCH"
  | "DRAFT"
  | "EXPERIMENT"
  | "FEEDBACK"
  | "DECISION"
  | "TASK"
  | "ASSET"
  | "FINAL"
  | "ARCHIVE";

⸻

5.2 Node Status

type NodeStatus =
  | "RAW"
  | "IN_PROGRESS"
  | "REVIEW"
  | "DECIDED"
  | "DISCARDED"
  | "FINALIZED";

⸻

5.3 Edge Relationship

노드 간 관계는 단순 연결이 아니라 의미를 가진 방향성 연결이어야 한다.

type EdgeType =
  | "DERIVES_FROM"      // A에서 B가 파생됨
  | "SUPPORTS"          // A가 B를 근거로 지지함
  | "CONTRADICTS"       // A가 B와 충돌함
  | "REFINES"           // A가 B를 정제함
  | "REPLACES"          // A가 B를 대체함
  | "REFERENCES"        // A가 B를 참조함
  | "DECIDES"           // A가 B의 의사결정 근거가 됨
  | "BLOCKS";           // A가 B를 막고 있음

⸻

5.4 Decision Genealogy

의사결정 계보는 다음 형태의 방향성 비순환 그래프다.

[Idea]
   ↓
[Research]
   ↓
[Draft A] ──────┐
   ↓             ↓
[Feedback]    [Draft B]
   ↓             ↓
[Decision] ←────┘
   ↓
[Final Output]

핵심 규칙은 다음이다.

1. Edge는 방향성을 가진다.
2. 기본적으로 cycle을 허용하지 않는다.
3. cycle이 생성될 경우 API 레벨에서 거부한다.
4. 삭제된 노드는 soft delete 처리한다.
5. 과거 시점 복원을 위해 createdAt, deletedAt을 보존한다.

⸻

6. 데이터 모델

6.1 Prisma Schema 초안

Codex는 아래 스키마를 기준으로 prisma/schema.prisma를 작성한다.

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  image         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  memberships   WorkspaceMember[]
  nodesCreated  ContextNode[] @relation("NodeCreator")
  messages      Message[]
  versions      DocumentVersion[]
}
model Workspace {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  members     WorkspaceMember[]
  projects    Project[]
  billing     BillingAccount?
}
model WorkspaceMember {
  id           String   @id @default(cuid())
  workspaceId  String
  userId       String
  role         WorkspaceRole @default(MEMBER)
  createdAt    DateTime @default(now())
  workspace    Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([workspaceId, userId])
}
enum WorkspaceRole {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}
model Project {
  id            String   @id @default(cuid())
  workspaceId   String
  name          String
  description   String?
  status        ProjectStatus @default(ACTIVE)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  archivedAt    DateTime?
  workspace     Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  nodes         ContextNode[]
  edges         NodeEdge[]
  messages      Message[]
  tags          SemanticTag[]
  events        ActivityEvent[]
  archives      ProjectArchive[]
}
enum ProjectStatus {
  ACTIVE
  PAUSED
  ARCHIVED
}
model ContextNode {
  id            String   @id @default(cuid())
  projectId     String
  title         String
  type          NodeType
  status        NodeStatus @default(RAW)
  summary       String?
  content       Json?
  positionX     Float    @default(0)
  positionY     Float    @default(0)
  width         Float?
  height        Float?
  createdById   String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime?
  currentVersionNo Int @default(1)
  metadata      Json?
  aiSummary     String?
  confidence    Float?
  project       Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  createdBy     User    @relation("NodeCreator", fields: [createdById], references: [id])
  outgoingEdges NodeEdge[] @relation("EdgeFrom")
  incomingEdges NodeEdge[] @relation("EdgeTo")
  versions      DocumentVersion[]
  linkedMessages MessageNodeLink[]
  tags          NodeTag[]
  decisions     Decision[]
  events        ActivityEvent[]
  @@index([projectId])
  @@index([type])
  @@index([status])
  @@index([createdAt])
}
enum NodeType {
  IDEA
  BRIEF
  RESEARCH
  DRAFT
  EXPERIMENT
  FEEDBACK
  DECISION
  TASK
  ASSET
  FINAL
  ARCHIVE
}
enum NodeStatus {
  RAW
  IN_PROGRESS
  REVIEW
  DECIDED
  DISCARDED
  FINALIZED
}
model NodeEdge {
  id            String   @id @default(cuid())
  projectId     String
  fromNodeId     String
  toNodeId       String
  type          EdgeType
  label         String?
  weight        Float    @default(1)
  confidence    Float?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime?
  project       Project     @relation(fields: [projectId], references: [id], onDelete: Cascade)
  fromNode      ContextNode @relation("EdgeFrom", fields: [fromNodeId], references: [id], onDelete: Cascade)
  toNode        ContextNode @relation("EdgeTo", fields: [toNodeId], references: [id], onDelete: Cascade)
  @@index([projectId])
  @@index([fromNodeId])
  @@index([toNodeId])
  @@unique([fromNodeId, toNodeId, type])
}
enum EdgeType {
  DERIVES_FROM
  SUPPORTS
  CONTRADICTS
  REFINES
  REPLACES
  REFERENCES
  DECIDES
  BLOCKS
}
model DocumentVersion {
  id            String   @id @default(cuid())
  nodeId        String
  versionNo     Int
  title         String?
  content       Json
  plainText     String?
  changeSummary String?
  createdById   String
  createdAt     DateTime @default(now())
  node          ContextNode @relation(fields: [nodeId], references: [id], onDelete: Cascade)
  createdBy     User        @relation(fields: [createdById], references: [id])
  @@unique([nodeId, versionNo])
  @@index([nodeId])
  @@index([createdAt])
}
model Message {
  id            String   @id @default(cuid())
  projectId     String
  authorId      String
  content       String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime?
  scopeNodeId   String?
  aiProcessed   Boolean @default(false)
  project       Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  author        User    @relation(fields: [authorId], references: [id])
  linkedNodes   MessageNodeLink[]
  tags          MessageTag[]
  @@index([projectId])
  @@index([scopeNodeId])
  @@index([createdAt])
}
model MessageNodeLink {
  id            String   @id @default(cuid())
  messageId     String
  nodeId        String
  source        LinkSource @default(MANUAL)
  confidence    Float?
  reason        String?
  createdAt     DateTime @default(now())
  message       Message     @relation(fields: [messageId], references: [id], onDelete: Cascade)
  node          ContextNode @relation(fields: [nodeId], references: [id], onDelete: Cascade)
  @@unique([messageId, nodeId])
}
enum LinkSource {
  MANUAL
  AI
  RULE
}
model SemanticTag {
  id            String   @id @default(cuid())
  projectId     String
  name          String
  normalized    String
  description   String?
  createdAt     DateTime @default(now())
  project       Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  nodes         NodeTag[]
  messages      MessageTag[]
  @@unique([projectId, normalized])
}
model NodeTag {
  id            String   @id @default(cuid())
  nodeId        String
  tagId         String
  confidence    Float?
  source        LinkSource @default(MANUAL)
  createdAt     DateTime @default(now())
  node          ContextNode @relation(fields: [nodeId], references: [id], onDelete: Cascade)
  tag           SemanticTag @relation(fields: [tagId], references: [id], onDelete: Cascade)
  @@unique([nodeId, tagId])
}
model MessageTag {
  id            String   @id @default(cuid())
  messageId     String
  tagId         String
  confidence    Float?
  source        LinkSource @default(MANUAL)
  createdAt     DateTime @default(now())
  message       Message     @relation(fields: [messageId], references: [id], onDelete: Cascade)
  tag           SemanticTag @relation(fields: [tagId], references: [id], onDelete: Cascade)
  @@unique([messageId, tagId])
}
model Decision {
  id            String   @id @default(cuid())
  nodeId        String
  statement     String
  rationale     String?
  outcome       String?
  decidedAt     DateTime @default(now())
  createdAt     DateTime @default(now())
  node          ContextNode @relation(fields: [nodeId], references: [id], onDelete: Cascade)
}
model ActivityEvent {
  id            String   @id @default(cuid())
  projectId     String
  nodeId        String?
  actorId       String?
  type          ActivityEventType
  payload       Json?
  createdAt     DateTime @default(now())
  project       Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  node          ContextNode? @relation(fields: [nodeId], references: [id])
  @@index([projectId])
  @@index([nodeId])
  @@index([createdAt])
}
enum ActivityEventType {
  NODE_CREATED
  NODE_UPDATED
  NODE_DELETED
  EDGE_CREATED
  EDGE_DELETED
  VERSION_CREATED
  MESSAGE_CREATED
  MESSAGE_LINKED
  TAG_CREATED
  TAG_LINKED
  DECISION_CREATED
  ARCHIVE_CREATED
}
model ProjectArchive {
  id            String   @id @default(cuid())
  projectId     String
  title         String
  summary       String?
  content       Json
  createdAt     DateTime @default(now())
  project       Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
model BillingAccount {
  id            String   @id @default(cuid())
  workspaceId   String   @unique
  plan          BillingPlan @default(FREE)
  nodeLimit     Int      @default(100)
  storageLimitMb Int     @default(500)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  workspace     Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
}
enum BillingPlan {
  FREE
  TEAM
  BUSINESS
  ENTERPRISE
}

⸻

7. API 명세

7.1 공통 응답 형태

모든 API는 다음 형식을 따른다.

type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

⸻

7.2 Workspace API

GET /api/workspaces

현재 사용자가 속한 워크스페이스 목록을 반환한다.

Response:
{
  workspaces: {
    id: string;
    name: string;
    slug: string;
    role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
  }[];
}

⸻

POST /api/workspaces

워크스페이스를 생성한다.

Request:
{
  name: string;
  slug: string;
}
Response:
{
  workspace: Workspace;
}

검증 규칙:

name: 1자 이상 80자 이하
slug: 영문 소문자, 숫자, 하이픈만 허용
slug: unique

⸻

7.3 Project API

GET /api/workspaces/:workspaceId/projects

프로젝트 목록 조회.

Response:
{
  projects: {
    id: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    nodeCount: number;
    updatedAt: string;
  }[];
}

⸻

POST /api/workspaces/:workspaceId/projects

프로젝트 생성.

Request:
{
  name: string;
  description?: string;
}
Response:
{
  project: Project;
}

생성 시 기본 노드를 자동 생성한다.

Node 1:
type = BRIEF
title = "Project Brief"
status = RAW
Node 2:
type = IDEA
title = "Initial Idea"
status = RAW
Edge:
Initial Idea -> Project Brief
type = SUPPORTS

⸻

7.4 Graph API

GET /api/projects/:projectId/graph

프로젝트의 현재 그래프를 반환한다.

Query:
{
  at?: string;        // ISO timestamp. 없으면 현재 시점
  tag?: string;
  type?: NodeType;
  status?: NodeStatus;
  depth?: number;
  focusNodeId?: string;
}
Response:
{
  project: {
    id: string;
    name: string;
  };
  nodes: GraphNodeDTO[];
  edges: GraphEdgeDTO[];
  timeRange: {
    start: string;
    end: string;
  };
}
type GraphNodeDTO = {
  id: string;
  title: string;
  type: NodeType;
  status: NodeStatus;
  summary?: string;
  position: {
    x: number;
    y: number;
  };
  currentVersionNo: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  tags: string[];
};
type GraphEdgeDTO = {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: EdgeType;
  label?: string;
  createdAt: string;
  deletedAt?: string;
};

at이 있는 경우 다음 규칙으로 복원한다.

1. createdAt <= at 인 노드만 포함한다.
2. deletedAt이 null이거나 deletedAt > at 인 노드만 포함한다.
3. edge도 동일한 규칙을 적용한다.
4. 각 노드의 문서 버전은 createdAt <= at 중 가장 최신 version을 사용한다.

⸻

7.5 Node API

POST /api/projects/:projectId/nodes

노드 생성.

Request:
{
  title: string;
  type: NodeType;
  status?: NodeStatus;
  summary?: string;
  content?: object;
  position?: {
    x: number;
    y: number;
  };
  parentNodeId?: string;
  edgeType?: EdgeType;
}
Response:
{
  node: ContextNode;
  edge?: NodeEdge;
}

동작:

1. 노드를 생성한다.
2. DocumentVersion versionNo = 1을 생성한다.
3. parentNodeId가 있으면 parentNodeId -> newNode edge를 생성한다.
4. ActivityEvent NODE_CREATED를 생성한다.
5. parentNodeId가 있으면 ActivityEvent EDGE_CREATED를 생성한다.

⸻

PATCH /api/nodes/:nodeId

노드 메타데이터 수정.

Request:
{
  title?: string;
  type?: NodeType;
  status?: NodeStatus;
  summary?: string;
  position?: {
    x: number;
    y: number;
  };
  metadata?: object;
}

⸻

DELETE /api/nodes/:nodeId

노드 soft delete.

deletedAt = now()
관련 edge도 deletedAt = now()
ActivityEvent NODE_DELETED 생성

⸻

7.6 Edge API

POST /api/projects/:projectId/edges

노드 간 연결 생성.

Request:
{
  fromNodeId: string;
  toNodeId: string;
  type: EdgeType;
  label?: string;
}

검증 규칙:

1. fromNodeId와 toNodeId는 같은 project에 속해야 한다.
2. fromNodeId !== toNodeId
3. 동일한 fromNodeId, toNodeId, type 조합은 중복 불가
4. cycle 생성 시 거부

Cycle 검증 의사코드:

function wouldCreateCycle(edges, fromNodeId, toNodeId) {
  // 새 edge: from -> to
  // 이미 to에서 from으로 가는 경로가 있으면 cycle
  return hasPath(edges, toNodeId, fromNodeId);
}

⸻

DELETE /api/edges/:edgeId

edge soft delete.

deletedAt = now()
ActivityEvent EDGE_DELETED 생성

⸻

7.7 Document Version API

GET /api/nodes/:nodeId/versions

노드의 문서 버전 목록 조회.

Response:
{
  versions: {
    id: string;
    versionNo: number;
    title?: string;
    changeSummary?: string;
    createdAt: string;
    createdBy: {
      id: string;
      name?: string;
    };
  }[];
}

⸻

POST /api/nodes/:nodeId/versions

새 문서 버전 저장.

Request:
{
  title?: string;
  content: object;
  plainText?: string;
  changeSummary?: string;
}

동작:

1. 현재 node.currentVersionNo + 1 계산
2. DocumentVersion 생성
3. ContextNode.currentVersionNo 업데이트
4. ContextNode.content 업데이트
5. ActivityEvent VERSION_CREATED 생성

⸻

7.8 Chat API

GET /api/projects/:projectId/messages

프로젝트 채팅 조회.

Query:
{
  nodeId?: string;
  before?: string;
  limit?: number;
}

nodeId가 있는 경우 해당 노드와 연결된 메시지만 반환한다.

⸻

POST /api/projects/:projectId/messages

메시지 생성.

Request:
{
  content: string;
  scopeNodeId?: string;
}

동작:

1. Message 생성
2. ActivityEvent MESSAGE_CREATED 생성
3. AI context extraction job 실행
4. AI 결과에 따라 MessageNodeLink, SemanticTag, MessageTag, NodeTag 생성

MVP에서는 job queue 없이 API 요청 내부에서 동기 처리해도 된다.
단, 코드 구조는 추후 비동기 큐로 분리 가능하게 작성한다.

⸻

POST /api/messages/:messageId/link-node

메시지를 노드에 수동 연결한다.

Request:
{
  nodeId: string;
  reason?: string;
}

⸻

7.9 AI API

POST /api/ai/extract-context

채팅 또는 문서 텍스트에서 노드 링크, 태그, 의사결정 후보를 추출한다.

Request:
{
  projectId: string;
  sourceType: "MESSAGE" | "DOCUMENT";
  sourceId: string;
  text: string;
}
Response:
{
  suggestedTags: {
    name: string;
    confidence: number;
  }[];
  suggestedNodeLinks: {
    nodeId: string;
    confidence: number;
    reason: string;
  }[];
  suggestedEdges: {
    fromNodeId: string;
    toNodeId: string;
    type: EdgeType;
    confidence: number;
    reason: string;
  }[];
  suggestedDecision?: {
    statement: string;
    rationale?: string;
    confidence: number;
  };
}

⸻

8. AI 연결 로직

8.1 AI 사용 목적

AI는 사용자 대신 결정을 내리지 않는다.
AI는 다음 작업만 수행한다.

1. 대화에서 주요 키워드 추출
2. 기존 노드와 관련성 추정
3. 새 태그 제안
4. 의사결정 문장 후보 탐지
5. 노드 간 연결 후보 제안
6. 문서 변경 요약 생성

⸻

8.2 LLM Prompt 설계

서버에서 사용하는 시스템 프롬프트는 다음 구조를 따른다.

You are a context extraction engine for a node-based collaboration system.
Your task:
- Extract semantic tags.
- Identify related existing nodes.
- Suggest causal or reference relationships.
- Detect decisions if explicitly stated.
- Do not invent information.
- Return strict JSON only.
Node relationship types:
DERIVES_FROM, SUPPORTS, CONTRADICTS, REFINES, REPLACES, REFERENCES, DECIDES, BLOCKS.
Decision should only be extracted when the text contains a clear commitment, conclusion, approval, rejection, or selected direction.

사용자 입력에는 다음 정보를 포함한다.

{
  projectName: string;
  existingNodes: {
    id: string;
    title: string;
    type: NodeType;
    summary?: string;
    tags: string[];
  }[];
  sourceText: string;
}

⸻

8.3 OpenAI API가 없는 경우 fallback

환경변수 OPENAI_API_KEY가 없는 경우에도 앱이 동작해야 한다.

Fallback 규칙:

1. #tag 형식의 단어를 SemanticTag로 추출한다.
2. @node-title 형식의 언급을 노드 링크로 처리한다.
3. "결정:", "결론:", "확정:", "reject", "approve" 같은 패턴이 있으면 Decision 후보로 처리한다.
4. 기존 노드 title이 메시지에 포함되면 confidence 0.7로 링크 후보 생성.

⸻

9. Time-Travel Slider 명세

9.1 목적

Time-Travel Slider는 특정 시점의 프로젝트 상태를 복원하는 기능이다.

사용자는 다음을 볼 수 있어야 한다.

해당 시점에 존재했던 노드
해당 시점에 존재했던 edge
해당 시점의 문서 버전
해당 시점까지 발생한 채팅
해당 시점까지 만들어진 의사결정

⸻

9.2 UI 위치

하단 고정 바에 배치한다.

┌────────────────────────────────────────────────────┐
│ TIME TRAVEL: [2026-05-11 14:20] ───────●────────── │
│ Current / Snapshot / Restore View / Exit           │
└────────────────────────────────────────────────────┘

⸻

9.3 동작

1. 기본 상태는 Current Mode다.
2. 슬라이더를 움직이면 Time-Travel Mode로 진입한다.
3. Graph API를 at timestamp와 함께 재호출한다.
4. 노드 클릭 시 해당 시점의 최신 DocumentVersion을 보여준다.
5. 과거 시점에서는 편집을 막는다.
6. "Restore as New Version" 버튼을 누르면 과거 문서를 현재 새 버전으로 복원한다.

⸻

9.4 복원 규칙

과거 버전을 직접 덮어쓰지 않는다.
항상 현재 시점에 새 DocumentVersion을 생성한다.
changeSummary에는 "Restored from version N at timestamp"를 기록한다.

⸻

10. UI 디자인 명세: Brutalist Monotone

10.1 디자인 원칙

CORETEX UI는 다음 원칙을 따른다.

1. 장식보다 구조
2. 색보다 대비
3. 둥근 모서리보다 날카로운 경계
4. 부드러운 그림자보다 하드 섀도우
5. 흐릿한 정보보다 과감한 레이블
6. SaaS형 파스텔 톤 금지
7. Glassmorphism 금지
8. 과도한 애니메이션 금지
9. 정보 밀도 높은 편집 도구 느낌

⸻

10.2 컬러 토큰

:root {
  --color-bg: #f4f4f0;
  --color-surface: #ffffff;
  --color-surface-alt: #e8e8e3;
  --color-text: #000000;
  --color-muted: #6b6b6b;
  --color-border: #000000;
  --color-inverse-bg: #000000;
  --color-inverse-text: #ffffff;
  --color-danger: #000000;
  --color-warning: #777777;
  --color-success: #222222;
}

컬러 사용 규칙:

배경: off-white
텍스트: black
보조 텍스트: gray
border: black
active 상태: black background + white text
danger 상태: black diagonal pattern 또는 굵은 outline
status 구분: 색상 대신 패턴, 라벨, border style 사용

⸻

10.3 타이포그래피

Primary Font:
- IBM Plex Mono
- Space Mono
- JetBrains Mono
Fallback:
- ui-monospace
- SFMono-Regular
- Menlo
- Monaco
- Consolas

타입 스케일:

--font-xs: 11px;
--font-sm: 12px;
--font-md: 14px;
--font-lg: 18px;
--font-xl: 24px;
--font-2xl: 36px;

사용 규칙:

버튼: uppercase
노드 타입: uppercase
상태 라벨: uppercase
긴 본문: 14px 또는 15px
메타데이터: 11px

⸻

10.4 Border와 Shadow

--border-thin: 1px solid #000;
--border-default: 2px solid #000;
--border-heavy: 4px solid #000;
--shadow-hard-sm: 2px 2px 0 #000;
--shadow-hard-md: 4px 4px 0 #000;
--shadow-hard-lg: 8px 8px 0 #000;

규칙:

모든 주요 panel은 2px black border
활성 node는 4px black border
버튼 hover 시 hard shadow 증가
disabled는 opacity보다 hatch pattern 사용

⸻

10.5 Layout Grid

--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;

Canvas 배경:

.graph-canvas {
  background-color: var(--color-bg);
  background-image:
    linear-gradient(to right, rgba(0,0,0,0.12) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.12) 1px, transparent 1px);
  background-size: 24px 24px;
}

⸻

11. 컴포넌트 명세

11.1 공통 컴포넌트

BrutalButton
BrutalInput
BrutalTextarea
BrutalSelect
BrutalBadge
BrutalPanel
BrutalDialog
BrutalTabs
BrutalDivider
BrutalTooltip
BrutalCommandMenu

⸻

11.2 BrutalButton

Props:

type BrutalButtonProps = {
  variant?: "default" | "inverse" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  children: React.ReactNode;
};

스타일:

default:
- white background
- black text
- 2px black border
- 2px hard shadow
inverse:
- black background
- white text
- 2px black border
ghost:
- transparent background
- underline or border-bottom
danger:
- white background
- black border
- diagonal repeating background pattern

⸻

11.3 ContextNodeCard

Graph canvas에 표시되는 노드 카드다.

type ContextNodeCardProps = {
  id: string;
  title: string;
  type: NodeType;
  status: NodeStatus;
  summary?: string;
  tags: string[];
  currentVersionNo: number;
  selected: boolean;
};

시각 구조:

┌──────────────────────────────┐
│ DRAFT             v.03        │
├──────────────────────────────┤
│ Homepage Copy Direction      │
│                              │
│ 첫 번째 카피 방향성 초안       │
├──────────────────────────────┤
│ #brand #landing #copy        │
├──────────────────────────────┤
│ STATUS: REVIEW               │
└──────────────────────────────┘

상태 표현:

RAW: dotted border
IN_PROGRESS: solid border
REVIEW: double border
DECIDED: heavy left border
DISCARDED: diagonal hatch overlay
FINALIZED: black header, white text

⸻

11.4 FlowCanvas

React Flow 기반 그래프 캔버스.

기능:

1. 노드 드래그
2. 노드 선택
3. 노드 다중 선택
4. edge 생성
5. edge 삭제
6. fit view
7. focus node
8. depth filter
9. tag filter
10. current/time-travel mode 전환

React Flow mapping:

const reactFlowNodes = contextNodes.map(node => ({
  id: node.id,
  type: "contextNode",
  position: {
    x: node.position.x,
    y: node.position.y
  },
  data: node
}));
const reactFlowEdges = edges.map(edge => ({
  id: edge.id,
  source: edge.fromNodeId,
  target: edge.toNodeId,
  label: edge.type,
  type: "brutalEdge",
  data: edge
}));

⸻

11.5 Right Inspector

활성 노드의 상세 정보를 보여준다.

탭 구조:

[SUMMARY] [DOC] [CHAT] [VERSIONS] [GENEALOGY] [AI]

SUMMARY 탭

Title
Type
Status
Summary
Tags
Created by
Created at
Incoming edges
Outgoing edges

DOC 탭

TipTap editor
Save Version button
Change Summary input
Current Version number

CHAT 탭

Linked messages
Node-scoped chat input
Manual link button
AI-linked indicator

VERSIONS 탭

Version list
Created by
Created at
Change summary
Open version
Restore as new version

GENEALOGY 탭

Parents
Children
Decision chain
Origin node
Final outputs derived from this node

AI 탭

Suggested tags
Suggested node links
Suggested edges
Suggested decision
Accept / Reject buttons

⸻

11.6 ChatLayer

프로젝트 채팅과 노드 채팅을 모두 처리한다.

모드:

type ChatMode = "PROJECT" | "NODE";

기능:

1. 프로젝트 전체 메시지 작성
2. 특정 노드에 scope된 메시지 작성
3. 메시지에서 연결된 노드 표시
4. AI가 연결한 경우 confidence 표시
5. 메시지 수동 노드 연결
6. 메시지 기반 새 노드 생성

메시지 UI:

┌──────────────────────────────────────┐
│ TAEWOO / 2026-05-11 14:22            │
├──────────────────────────────────────┤
│ 이 버전은 onboarding flow 쪽에서...  │
├──────────────────────────────────────┤
│ LINKED: [Draft v2] [Decision #4]      │
│ TAGS: #onboarding #ux                │
└──────────────────────────────────────┘

⸻

11.7 TimeTravelBar

Props:

type TimeTravelBarProps = {
  start: Date;
  end: Date;
  current: Date;
  mode: "CURRENT" | "TIME_TRAVEL";
  onChange: (date: Date) => void;
  onExit: () => void;
};

상태:

CURRENT:
- slider disabled or fixed at end
- label: CURRENT STATE
TIME_TRAVEL:
- black background
- white text
- label: VIEWING PAST STATE
- editing disabled globally

⸻

12. 상태 관리

12.1 Zustand Store

type FlowStore = {
  activeProjectId: string | null;
  activeNodeId: string | null;
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  mode: "CURRENT" | "TIME_TRAVEL";
  selectedTimestamp: string | null;
  filters: {
    nodeTypes: NodeType[];
    statuses: NodeStatus[];
    tags: string[];
    depth: number | null;
    focusNodeId: string | null;
  };
  inspectorTab:
    | "SUMMARY"
    | "DOC"
    | "CHAT"
    | "VERSIONS"
    | "GENEALOGY"
    | "AI";
  setActiveNode: (id: string | null) => void;
  setMode: (mode: "CURRENT" | "TIME_TRAVEL") => void;
  setSelectedTimestamp: (timestamp: string | null) => void;
  setFilters: (filters: Partial<FlowStore["filters"]>) => void;
  setInspectorTab: (tab: FlowStore["inspectorTab"]) => void;
};

⸻

12.2 서버 데이터 캐싱

TanStack Query key 규칙:

["workspaces"]
["projects", workspaceId]
["graph", projectId, filters, selectedTimestamp]
["node", nodeId]
["versions", nodeId]
["messages", projectId, scopeNodeId]
["archive", projectId]

Mutation 이후 invalidation:

node 생성 → graph invalidate
node 수정 → graph, node invalidate
edge 생성 → graph invalidate
version 생성 → graph, node, versions invalidate
message 생성 → messages, graph invalidate
AI link 생성 → messages, node, graph invalidate

⸻

13. 핵심 사용자 플로우

13.1 프로젝트 생성

1. 사용자가 Workspace Dashboard 진입
2. Create Project 클릭
3. 프로젝트 이름과 설명 입력
4. 서버가 Project 생성
5. 기본 Brief Node와 Initial Idea Node 생성
6. /flow 화면으로 이동

⸻

13.2 노드 생성

1. 사용자가 Canvas에서 우클릭 또는 Create Node 클릭
2. Node Type 선택
3. Title 입력
4. Optional parent node 선택
5. 서버가 ContextNode 생성
6. parent가 있으면 edge 생성
7. 새 노드가 Canvas에 표시됨

⸻

13.3 노드 연결

1. 사용자가 source node handle에서 target node로 drag
2. Edge type 선택 modal 표시
3. 사용자가 관계 유형 선택
4. API가 cycle 여부 검사
5. 문제가 없으면 edge 생성
6. Graph에 edge 표시

⸻

13.4 문서 버전 저장

1. 사용자가 node 선택
2. DOC 탭 진입
3. 문서 편집
4. Save Version 클릭
5. Change Summary 입력
6. 새 DocumentVersion 생성
7. node.currentVersionNo 증가
8. version list 갱신

⸻

13.5 채팅에서 맥락 자동 연결

1. 사용자가 프로젝트 채팅에 메시지 작성
2. Message 생성
3. AI extractor 실행
4. 관련 node, tag, decision 후보 생성
5. confidence가 높은 항목은 자동 연결
6. confidence가 낮은 항목은 AI 탭에서 제안으로 표시

권장 threshold:

confidence >= 0.85: 자동 연결
0.60 <= confidence < 0.85: 사용자 승인 필요
confidence < 0.60: 무시

⸻

13.6 Time Travel

1. 사용자가 하단 slider 이동
2. Time-Travel Mode 진입
3. 해당 timestamp로 graph API 호출
4. 과거 노드·edge·문서 버전 표시
5. 편집 UI disabled
6. 사용자가 Restore as New Version 선택 가능
7. Exit 클릭 시 Current Mode 복귀

⸻

13.7 프로젝트 아카이브 생성

1. 사용자가 Archive 메뉴 클릭
2. 서버가 프로젝트 그래프, 노드, 버전, 의사결정, 태그, 메시지 요약을 수집
3. Archive JSON 생성
4. 읽기 전용 Archive View 표시

Archive View 구성:

1. Project Overview
2. Decision Timeline
3. Node Genealogy
4. Final Outputs
5. Discarded Alternatives
6. Major Tags
7. Key Messages
8. Version History

⸻

14. 아카이브 데이터 구조

type ProjectArchiveContent = {
  project: {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    archivedAt?: string;
  };
  overview: {
    nodeCount: number;
    edgeCount: number;
    messageCount: number;
    decisionCount: number;
    versionCount: number;
  };
  decisionTimeline: {
    nodeId: string;
    title: string;
    decision: string;
    rationale?: string;
    decidedAt: string;
  }[];
  nodeGenealogy: {
    nodeId: string;
    title: string;
    type: NodeType;
    status: NodeStatus;
    parents: string[];
    children: string[];
    tags: string[];
  }[];
  finalOutputs: {
    nodeId: string;
    title: string;
    summary?: string;
    versionNo: number;
  }[];
  discardedAlternatives: {
    nodeId: string;
    title: string;
    reason?: string;
  }[];
  keyMessages: {
    id: string;
    content: string;
    linkedNodeIds: string[];
    createdAt: string;
  }[];
};

⸻

15. 검색 명세

15.1 기본 검색

검색 대상:

노드 제목
노드 요약
문서 plainText
태그 이름
메시지 content
의사결정 statement

API:

GET /api/projects/:projectId/search?q=...

Response:

{
  results: {
    type: "NODE" | "MESSAGE" | "TAG" | "DECISION";
    id: string;
    title: string;
    excerpt?: string;
    score?: number;
  }[];
}

⸻

15.2 검색 UI

Top Bar의 Command Menu에서 실행한다.

단축키:

Mac: Cmd + K
Windows/Linux: Ctrl + K

검색 결과 클릭 시:

NODE → 해당 노드 focus
MESSAGE → Chat 탭 열고 메시지 highlight
TAG → tag filter 적용
DECISION → decision node focus

⸻

16. 권한 명세

16.1 역할

OWNER:
- 모든 권한
- billing 관리
- workspace 삭제
ADMIN:
- project 생성/삭제
- member 초대
- 모든 node 수정
MEMBER:
- node 생성/수정
- message 작성
- version 생성
VIEWER:
- 읽기 전용
- time-travel 조회 가능
- archive 조회 가능

⸻

16.2 MVP 권한 체크

서버에서 반드시 체크해야 하는 것:

1. 사용자가 workspace member인지
2. 해당 project가 workspace에 속하는지
3. VIEWER가 mutation API를 호출하지 못하는지
4. 삭제 API는 MEMBER 이상인지
5. workspace 설정 변경은 ADMIN 이상인지

⸻

17. BM 구현 선반영

MVP에서 결제까지 구현하지 않더라도 SaaS BM을 위해 다음 usage guard를 구현한다.

17.1 Plan Limit

FREE:
- workspace 1개
- project 3개
- node 100개
- storage 500MB
- AI extraction 월 100회
TEAM:
- project 30개
- node 5,000개
- storage 50GB
- AI extraction 월 10,000회
BUSINESS:
- project 무제한
- node 100,000개
- storage 1TB
- advanced archive
ENTERPRISE:
- custom
- SSO
- on-premise option

⸻

17.2 Usage Guard

노드 생성 API에서 다음을 체크한다.

현재 workspace의 plan 조회
현재 node count 조회
nodeLimit 초과 시 402 또는 403 반환

응답:

{
  ok: false,
  error: {
    code: "PLAN_LIMIT_EXCEEDED",
    message: "This workspace has reached the node limit for the current plan."
  }
}

⸻

18. 파일 구조

Codex는 다음 구조로 프로젝트를 생성한다.

coretex/
  app/
    layout.tsx
    page.tsx
    auth/
      sign-in/
        page.tsx
      sign-up/
        page.tsx
    app/
      layout.tsx
      page.tsx
      w/
        [workspaceId]/
          page.tsx
          projects/
            page.tsx
          p/
            [projectId]/
              page.tsx
              flow/
                page.tsx
              archive/
                page.tsx
          settings/
            page.tsx
          billing/
            page.tsx
    api/
      workspaces/
        route.ts
      workspaces/
        [workspaceId]/
          projects/
            route.ts
      projects/
        [projectId]/
          graph/
            route.ts
          nodes/
            route.ts
          edges/
            route.ts
          messages/
            route.ts
          search/
            route.ts
          archive/
            route.ts
      nodes/
        [nodeId]/
          route.ts
          versions/
            route.ts
      edges/
        [edgeId]/
          route.ts
      messages/
        [messageId]/
          link-node/
            route.ts
      ai/
        extract-context/
          route.ts
  components/
    brutal/
      BrutalButton.tsx
      BrutalInput.tsx
      BrutalTextarea.tsx
      BrutalSelect.tsx
      BrutalBadge.tsx
      BrutalPanel.tsx
      BrutalDialog.tsx
      BrutalTabs.tsx
      BrutalCommandMenu.tsx
    layout/
      AppShell.tsx
      TopBar.tsx
      LeftSidebar.tsx
      RightInspector.tsx
    flow/
      FlowCanvas.tsx
      ContextNodeCard.tsx
      BrutalEdge.tsx
      NodeCreateDialog.tsx
      EdgeCreateDialog.tsx
      TimeTravelBar.tsx
    inspector/
      SummaryTab.tsx
      DocumentTab.tsx
      ChatTab.tsx
      VersionsTab.tsx
      GenealogyTab.tsx
      AiSuggestionsTab.tsx
    chat/
      ChatLayer.tsx
      MessageCard.tsx
      MessageComposer.tsx
    archive/
      ArchiveOverview.tsx
      DecisionTimeline.tsx
      ArchiveGenealogy.tsx
  lib/
    auth.ts
    db.ts
    permissions.ts
    graph.ts
    ai/
      extractContext.ts
      fallbackExtractor.ts
      prompt.ts
    usage.ts
    validators.ts
    archive.ts
  hooks/
    useGraph.ts
    useNodeVersions.ts
    useMessages.ts
    useSearch.ts
  stores/
    flowStore.ts
  types/
    api.ts
    graph.ts
    node.ts
    billing.ts
  prisma/
    schema.prisma
    seed.ts
  styles/
    globals.css

⸻

19. 주요 유틸리티 함수

19.1 Cycle Detection

lib/graph.ts

export function wouldCreateCycle(params: {
  edges: { fromNodeId: string; toNodeId: string }[];
  fromNodeId: string;
  toNodeId: string;
}): boolean {
  const { edges, fromNodeId, toNodeId } = params;
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    if (!adjacency.has(edge.fromNodeId)) {
      adjacency.set(edge.fromNodeId, []);
    }
    adjacency.get(edge.fromNodeId)!.push(edge.toNodeId);
  }
  const visited = new Set<string>();
  const stack = [toNodeId];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === fromNodeId) {
      return true;
    }
    if (visited.has(current)) {
      continue;
    }
    visited.add(current);
    const nextNodes = adjacency.get(current) ?? [];
    for (const next of nextNodes) {
      stack.push(next);
    }
  }
  return false;
}

⸻

19.2 Time Travel Version Resolver

export function resolveVersionAt<T extends {
  versionNo: number;
  createdAt: Date;
}>(versions: T[], at: Date): T | null {
  const candidates = versions
    .filter(version => version.createdAt <= at)
    .sort((a, b) => b.versionNo - a.versionNo);
  return candidates[0] ?? null;
}

⸻

19.3 Tag Normalizer

export function normalizeTag(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^#/, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣-_]/g, "");
}

⸻

20. 테스트 명세

20.1 Unit Test

필수 테스트:

1. cycle detection
2. tag normalization
3. time-travel version resolver
4. plan limit checker
5. fallback AI extractor
6. permission checker

⸻

20.2 Integration Test

필수 테스트:

1. project 생성 시 기본 node와 edge 생성
2. node 생성 시 version 1 생성
3. edge 생성 시 cycle 거부
4. message 생성 시 AI extraction 실행
5. document version 저장 시 currentVersionNo 증가
6. time-travel graph query가 과거 상태를 정확히 반환
7. viewer role이 mutation을 수행하지 못함

⸻

20.3 UI Acceptance Test

수동 검증 기준:

1. graph canvas가 정상적으로 표시된다.
2. node drag 후 위치가 저장된다.
3. node click 시 inspector가 갱신된다.
4. edge 생성 modal이 뜬다.
5. version 저장 후 version list가 증가한다.
6. time-travel mode에서 editor가 disabled된다.
7. AI suggestion을 accept하면 tag 또는 link가 생성된다.
8. monochrome brutalist design이 전체 화면에 일관되게 적용된다.

⸻

21. Codex 구현 순서

아래 순서대로 Codex에 작업을 지시한다.

⸻

Phase 1. 프로젝트 초기화

Codex 지시문:

Create a Next.js App Router project with TypeScript and Tailwind CSS.
Implement the base CORETEX app structure using the following stack:
- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- React Flow
- Zustand
- TanStack Query
- TipTap
Set up:
- app directory routing
- global brutalist monochrome CSS tokens
- Prisma client
- basic layout shell
- placeholder auth pages
- workspace dashboard page
- project flow page
Do not implement business logic yet.
Focus on file structure, styling foundation, and compile correctness.

Acceptance Criteria:

1. npm run dev 실행 가능
2. /auth/sign-in 접근 가능
3. /app 접근 가능
4. /app/w/demo/p/demo/flow 접근 가능
5. 브루탈리즘 모노톤 스타일 토큰 적용

⸻

Phase 2. Prisma Schema와 Seed 구현

Codex 지시문:

Implement the Prisma schema for CORETEX using the provided data model.
Add:
- User
- Workspace
- WorkspaceMember
- Project
- ContextNode
- NodeEdge
- DocumentVersion
- Message
- MessageNodeLink
- SemanticTag
- NodeTag
- MessageTag
- Decision
- ActivityEvent
- ProjectArchive
- BillingAccount
Create a seed script that creates:
- one demo user
- one demo workspace
- one demo project
- five context nodes
- multiple edges forming a DAG
- several document versions
- several messages linked to nodes
- tags

Acceptance Criteria:

1. prisma generate 성공
2. prisma migrate dev 성공
3. prisma db seed 성공
4. demo project에 graph 데이터 존재

⸻

Phase 3. Graph API 구현

Codex 지시문:

Implement Graph API for CORETEX.
Routes:
- GET /api/projects/[projectId]/graph
- POST /api/projects/[projectId]/nodes
- PATCH /api/nodes/[nodeId]
- DELETE /api/nodes/[nodeId]
- POST /api/projects/[projectId]/edges
- DELETE /api/edges/[edgeId]
Requirements:
- Return graph DTO compatible with React Flow.
- Support at timestamp for time-travel query.
- Soft delete nodes and edges.
- Create ActivityEvent records.
- Validate edge cycles.
- Create DocumentVersion version 1 when a node is created.

Acceptance Criteria:

1. graph API returns nodes and edges
2. node creation works
3. edge creation works
4. cyclic edge is rejected
5. deleted node disappears from current graph
6. time-travel query can show old state

⸻

Phase 4. Flow Canvas 구현

Codex 지시문:

Implement the main FlowCanvas using React Flow.
Components:
- FlowCanvas
- ContextNodeCard
- BrutalEdge
- NodeCreateDialog
- EdgeCreateDialog
- TimeTravelBar
Requirements:
- Render graph nodes from API.
- Render custom brutalist node cards.
- Allow node selection.
- Open RightInspector on node click.
- Allow node drag and persist position.
- Allow edge creation with edge type dialog.
- Apply monochrome brutalist visual design.

Acceptance Criteria:

1. demo graph가 canvas에 표시됨
2. node card 디자인이 명세와 일치
3. node 클릭 시 inspector에 정보 표시
4. node drag 후 새로고침해도 위치 유지
5. edge 생성 가능

⸻

Phase 5. Document Version 구현

Codex 지시문:

Implement document editing and versioning.
Routes:
- GET /api/nodes/[nodeId]/versions
- POST /api/nodes/[nodeId]/versions
Components:
- DocumentTab
- VersionsTab
Requirements:
- Use TipTap editor for node content.
- Save content as JSON.
- Store plainText for search.
- Increment versionNo on save.
- Display version history.
- Allow viewing old versions.
- Allow restore old version as new version.
- Disable editing in time-travel mode.

Acceptance Criteria:

1. 노드 문서 편집 가능
2. Save Version 시 version 증가
3. version list 표시
4. old version preview 가능
5. restore as new version 가능

⸻

Phase 6. Chat와 의미론적 연결 구현

Codex 지시문:

Implement project and node-scoped chat.
Routes:
- GET /api/projects/[projectId]/messages
- POST /api/projects/[projectId]/messages
- POST /api/messages/[messageId]/link-node
- POST /api/ai/extract-context
Components:
- ChatLayer
- MessageCard
- MessageComposer
- ChatTab
- AiSuggestionsTab
Requirements:
- Users can post project-level messages.
- Users can post node-scoped messages.
- Messages can be manually linked to nodes.
- Implement fallback AI extractor.
- If OPENAI_API_KEY exists, use LLM extraction.
- Suggested tags and node links appear in AI tab.
- High-confidence links are auto-created.

Acceptance Criteria:

1. project chat 작성 가능
2. node chat 작성 가능
3. message-node manual link 가능
4. #tag가 자동으로 tag 처리됨
5. 기존 node title 언급 시 link suggestion 생성
6. AI 탭에서 accept/reject 가능

⸻

Phase 7. Search와 Filter 구현

Codex 지시문:

Implement project search and graph filters.
Routes:
- GET /api/projects/[projectId]/search
Features:
- Search nodes, messages, tags, decisions.
- Top bar command menu with Cmd/Ctrl + K.
- Filter graph by node type.
- Filter graph by status.
- Filter graph by tag.
- Focus node from search result.

Acceptance Criteria:

1. Cmd/Ctrl + K로 검색창 열림
2. node 검색 결과 클릭 시 canvas focus
3. tag 검색 결과 클릭 시 filter 적용
4. type/status filter가 graph에 반영됨

⸻

Phase 8. Time Travel 구현

Codex 지시문:

Implement time-travel mode.
Requirements:
- TimeTravelBar at bottom.
- Slider range from first ActivityEvent to now.
- Moving slider calls graph API with at timestamp.
- Current mode and time-travel mode are visually distinct.
- Editing is disabled in time-travel mode.
- RightInspector displays historical document version.
- Restore old version as new version is supported.

Acceptance Criteria:

1. slider 이동 시 graph가 과거 상태로 변경됨
2. 과거에 없던 node는 보이지 않음
3. 과거에 삭제되지 않았던 node는 보임
4. editor disabled 처리됨
5. current mode 복귀 가능

⸻

Phase 9. Archive 구현

Codex 지시문:

Implement project archive generation.
Routes:
- POST /api/projects/[projectId]/archive
- GET /api/projects/[projectId]/archive
Components:
- ArchiveOverview
- DecisionTimeline
- ArchiveGenealogy
Requirements:
- Generate JSON archive from project data.
- Include node genealogy.
- Include decisions.
- Include final outputs.
- Include discarded alternatives.
- Include key messages.
- Render archive as read-only brutalist report.

Acceptance Criteria:

1. archive 생성 가능
2. archive page에서 읽기 가능
3. decision timeline 표시
4. final outputs 표시
5. discarded alternatives 표시

⸻

Phase 10. Polish와 안정화

Codex 지시문:

Polish the CORETEX MVP.
Tasks:
- Add loading states
- Add error states
- Add empty states
- Add permission guard placeholders
- Add usage limit guard
- Add responsive minimum layout for tablet
- Add unit tests for graph utilities
- Add integration tests for core APIs
- Ensure brutalist monochrome UI consistency

Acceptance Criteria:

1. 주요 API 에러가 UI에 표시됨
2. empty project 상태가 자연스럽게 표시됨
3. node limit 초과 시 에러 표시
4. test suite 통과
5. npm run build 성공

⸻

22. Empty State 문구

22.1 프로젝트 없음

NO PROJECT FLOW FOUND.
Create a project to start mapping decisions, drafts, messages, and context into a traceable graph.

⸻

22.2 노드 없음

THIS CANVAS HAS NO CONTEXT YET.
Start with an IDEA, BRIEF, or DECISION node.

⸻

22.3 선택된 노드 없음

NO NODE SELECTED.
Select a node to inspect its document, genealogy, versions, and linked conversations.

⸻

22.4 AI 제안 없음

NO AI SUGGESTIONS.
CORETEX will surface semantic tags, node links, and decision candidates as conversations accumulate.

⸻

23. 에러 메시지

CYCLE_NOT_ALLOWED
This edge would create a circular genealogy. CORETEX requires decision flows to remain acyclic.
NODE_LIMIT_EXCEEDED
This workspace has reached the node limit for the current plan.
READ_ONLY_TIME_TRAVEL
You are viewing a past state. Exit time-travel mode to edit the current project.
NODE_NOT_FOUND
The selected node does not exist or has been deleted.
EDGE_DUPLICATED
This relationship already exists between the selected nodes.
AI_EXTRACTION_FAILED
Context extraction failed. The message was saved, but no semantic links were created.

⸻

24. 최종 MVP 성공 기준

CORETEX MVP는 다음이 가능하면 1차 완성으로 본다.

1. 사용자가 프로젝트를 생성한다.
2. 프로젝트 안에서 노드를 만들고 연결한다.
3. 연결된 노드들이 방향성 그래프로 보인다.
4. 각 노드는 문서와 버전을 가진다.
5. 채팅 메시지가 노드와 연결된다.
6. AI 또는 fallback rule이 태그와 링크를 제안한다.
7. Time-Travel Slider로 과거 상태를 볼 수 있다.
8. 최종 결과물이 어떤 아이디어, 초안, 피드백, 결정에서 파생되었는지 추적할 수 있다.
9. 전체 UI가 브루탈리즘 모노톤 스타일로 일관된다.
10. 프로젝트 종료 후 archive report를 생성할 수 있다.

⸻

25. Codex에 넣을 최종 통합 프롬프트

아래 프롬프트를 Codex의 첫 작업 지시로 사용할 수 있다.

You are implementing CORETEX, a node-based collaborative document management system.
CORETEX reframes project work as a graph of traceable context nodes rather than linear files, chats, or folders.
Core concept:
- Every unit of work is a Traceable Work Node.
- Nodes can represent ideas, briefs, research, drafts, experiments, feedback, decisions, tasks, assets, final outputs, and archives.
- Nodes are connected by directed acyclic relationships.
- Documents, chats, versions, tags, and decisions must be attached to nodes.
- The user should be able to trace why a final output exists and how it evolved.
Design direction:
- Brutalist monochrome.
- Black and white.
- Thick borders.
- Hard shadows.
- Monospace typography.
- No pastel SaaS aesthetic.
- No glassmorphism.
- No rounded soft cards.
- Dense, structural, editorial interface.
Tech stack:
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- React Flow
- Zustand
- TanStack Query
- TipTap editor
Implement the MVP in phases:
1. App shell and brutalist design system
2. Prisma schema and seed data
3. Graph API for context nodes and edges
4. React Flow canvas
5. Node inspector
6. Document editor and version history
7. Project and node chat
8. AI or fallback semantic tagging
9. Time-travel slider
10. Archive generation
Non-negotiable requirements:
- Graph must be a DAG.
- Edge creation must reject cycles.
- Node and edge deletion must be soft delete.
- Document versions must be immutable.
- Time-travel mode must reconstruct graph state by timestamp.
- Editing must be disabled in time-travel mode.
- All major user actions must create ActivityEvent records.
- The app must run even without OPENAI_API_KEY by using fallback extraction.
- npm run build must succeed.
Start by creating the project structure, global design tokens, Prisma schema, seed script, and a demo flow page with mock data. Then progressively replace mock data with real API calls.

⸻

이 명세의 핵심은 CORETEX를 “문서 앱”으로 만들지 않는 것이다.
구현 중 판단이 애매할 때는 항상 다음 기준을 적용하면 된다.

이 기능이 프로젝트의 맥락, 계보, 결정 이유, 버전 흐름을 더 잘 추적하게 만드는가?

그렇다면 CORETEX의 핵심 기능이다.
