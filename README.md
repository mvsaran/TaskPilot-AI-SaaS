# TaskPilot AI — Enterprise AI Project Management SaaS & Autonomous QA SUT

TaskPilot AI is an enterprise-grade AI-powered Project Management SaaS platform engineered from the ground up to compete with tools like Jira, Linear, ClickUp AI, and Monday.com. 

Beyond being a fully functional production-grade application with rich Kanban boards, RAG vector similarity indexing, and real-time AI Copilot workflows, **TaskPilot AI explicitly serves as the System Under Test (SUT) benchmark for Autonomous AI Quality Assurance Platforms**. It intentionally contains **50 realistic defects** across its security layer, backend race conditions, database constraints, AI prompt/caching logic, and React frontend state synchronization.

---

## 🌟 Key Features & Enterprise Modules

- **Core Kanban & Sprint Engine**: Multi-column swimlanes (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`) with `@hello-pangea/dnd`, subtask checklists, story point tracking, velocity burndown forecasting, and activity timeline.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions across `ADMIN`, `PROJECT_MANAGER`, `DEVELOPER`, `QA_ENGINEER`, `PRODUCT_OWNER`, and `VIEWER` roles enforced via NestJS guards and custom decorators.
- **High-Fidelity AI Hub (10 Capabilities)**:
  1. *Task & Epic Generator*: Decompose high-level feature requests into structured stories.
  2. *Sprint Planner*: Velocity-aware workload distribution balancing capacity across developers.
  3. *Story Generator*: Automated Acceptance Criteria, Definition of Done, and edge-case detection.
  4. *Bug Summarizer*: Stack trace & log analysis pinpointing root causes and code patches.
  5. *Risk Predictor*: Early warning system analyzing overdue tasks and blockers.
  6. *Meeting Notes Summarizer*: Action items and decision extraction from transcripts.
  7. *Smart Search*: Natural language to SQL/Prisma query translator.
  8. *Report Generator*: Weekly executive briefings and release readiness reports.
  9. *RAG Knowledge Assistant*: Vector-indexed document Q&A (`pgvector`) with exact citations.
  10. *Workspace Assistant*: Real-time conversational co-pilot drawer (`/ai/assistant-chat`).
- **Dual-Mode AI Client**: Seamless switching between Live OpenAI API (`gpt-4o`/`gpt-5.5` with JSON schema enforcement) and Deterministic High-Fidelity Simulation Mode (`x-ai-simulation: true`) for reliable local QA testing.
- **RAG Knowledge Base**: Document ingestion (`PDF`, `DOCX`, `Markdown`) split into 512-token chunks, embedded using `text-embedding-3-small`, and queried using PostgreSQL `pgvector` (`<=>` cosine similarity operator).
- **Live Observability & Telemetry**: Server-Sent Events (`/notifications/stream`), structured Winston logging (`corr_id`), and comprehensive audit trails.

---

## 🚀 Quick Start & Installation

### Option 1: Docker Compose (Recommended for Full Stack & pgvector)

Ensure Docker and Docker Compose are installed, then spin up the full stack:

```bash
# Clone and enter directory
cd TaskPilotAI

# Start PostgreSQL (pgvector + pg_trgm), Redis, and PgAdmin
docker-compose up -d

# Verify containers are running
docker ps
```

*Port Mappings:*
- PostgreSQL (`taskpilot-db`): `localhost:5432`
- Redis (`taskpilot-redis`): `localhost:6379`
- PgAdmin (`taskpilot-pgadmin`): `http://localhost:5050` (Email: `admin@taskpilot.ai`, Pass: `Admin123!`)

### Option 2: Running Locally (Development Mode)

#### 1. Backend Setup (`backend/`)
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed     # Seeds 6 demo accounts, projects, sprints, tasks, comments, and RAG chunks
npm run dev      # Starts enterprise NestJS API on http://localhost:4000
```

#### 2. Frontend Setup (`frontend/`)
```bash
cd frontend
npm install
npm run dev      # Starts React 19 + Vite app on http://localhost:3000
```

---

## 🔑 Demo Credentials & Instant Testing

All demo users share the default password: `Password123!`

| Role | Email Address | Assigned Team / Scope | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@taskpilot.ai` | Global Workspace | Full platform governance, user management, audit logs |
| **Project Manager** | `pm@taskpilot.ai` | Core Engineering | Sprint planning, velocity forecasting, project lifecycle |
| **Senior Developer**| `dev@taskpilot.ai` | Core Engineering | Task execution, subtasks, RAG queries, code checks |
| **Lead QA Engineer**| `qa@taskpilot.ai` | Quality Assurance | Defect catalog inspection, bug logging, release audits |
| **Product Owner** | `po@taskpilot.ai` | Product Team | Backlog prioritization, story generation, acceptance review |
| **Auditor / Viewer**| `viewer@taskpilot.ai` | External Audit | Read-only access across dashboards and reports |

*Tip: You can instantly switch roles using the one-click demo selector buttons on the Login page (`/login`) or directly from the top Header dropdown while inside the application!*

---

## 🧪 Autonomous QA Benchmark — 50 Injected SUT Defects

TaskPilot AI is deliberately built with **50 internal defects** designed to challenge AI autonomous testing agents across multiple diagnostic dimensions. These bugs are hidden inside boundary conditions, race conditions, ORM transactions, and state synchronization routines.

### Summary by Category:
- **Security & Authorization (`BUG-SEC-01` to `08`)**: IDOR, missing RBAC checks, XSS, token validation bypass.
- **Backend Logic & Race Conditions (`BUG-BE-01` to `10`)**: Sprint closure race conditions, story point overflows, event listener memory leaks.
- **Database & ORM (`BUG-DB-01` to `10`)**: Missing composite indexes, transaction rollbacks, string truncation, pgvector NaN vectors.
- **AI Hub & RAG Pipeline (`BUG-AI-01` to `10`)**: Prompt injections, hallucinated estimates, RAG threshold exclusions, token window crashes.
- **Frontend & UI State (`BUG-FE-01` to `10`)**: Drag-and-drop optimistic update reversion, role switch cache desync, resize observer leaks.
- **Observability & QA (`BUG-QA-01` to `02`)**: Timezone drift on audit timestamps, missing correlation IDs across async workers.

📖 **For detailed reproduction steps, root cause explanations, and expected behaviors for all 50 defects, reference the complete Ground-Truth Bug Catalog:** [`docs/BUG_CATALOG.md`](file:///C:/Users/mvsar/Projects/TaskPilotAI/docs/BUG_CATALOG.md).

---

## 📚 Technical Documentation Suite

- [`docs/BUG_CATALOG.md`](file:///C:/Users/mvsar/Projects/TaskPilotAI/docs/BUG_CATALOG.md) — Comprehensive 50-defect QA validation catalog.
- [`docs/ARCHITECTURE.md`](file:///C:/Users/mvsar/Projects/TaskPilotAI/docs/ARCHITECTURE.md) — System topology, NestJS modular boundaries, and database schema.
- [`docs/AI_ARCHITECTURE.md`](file:///C:/Users/mvsar/Projects/TaskPilotAI/docs/AI_ARCHITECTURE.md) — Decoupled AI pipeline, RAG pgvector indexing, and simulation engine.
- [`docs/API_SPEC.md`](file:///C:/Users/mvsar/Projects/TaskPilotAI/docs/API_SPEC.md) — Complete REST API reference and payload schemas.

---

## 🛠 Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Material UI v6, `@tanstack/react-query`, React Router v7, `@hello-pangea/dnd`.
- **Backend**: Node.js, NestJS v10, TypeScript, Prisma ORM v5, Passport-JWT, RxJS (SSE), Winston.
- **Database & Storage**: PostgreSQL 16 with `pgvector` & `pg_trgm` extensions, Redis (caching/sessions).
- **AI & ML**: OpenAI SDK (`gpt-4o`, `text-embedding-3-small`), custom RAG chunking (`pdf-parse`), dual-mode simulation engine.

---

## 📁 Project Structure

```text
TaskPilotAI/
├── backend/                  # Enterprise NestJS v10 API & AI Engine
│   ├── prisma/               # Prisma schema, database migrations & seed scripts
│   └── src/
│       ├── common/           # Shared guards (RBAC), interceptors, decorators & filters
│       ├── modules/          # Domain modules (Auth, Projects, Sprints, Tasks, AI Hub, RAG)
│       └── prisma/           # Prisma service & database connection management
├── frontend/                 # React 19 + TypeScript + Vite Single Page Application
│   └── src/
│       ├── components/       # Reusable UI components (Kanban boards, AI drawer, charts)
│       ├── context/          # React context providers (Auth, Theme, Notifications)
│       ├── pages/            # App pages (Dashboard, Backlog, AI Hub, Bug Catalog, etc.)
│       └── services/         # API clients & TanStack Query integrations
├── docs/                     # Technical documentation & Ground-Truth Bug Catalog
│   ├── BUG_CATALOG.md        # Comprehensive catalog of all 50 injected SUT defects
│   ├── ARCHITECTURE.md       # System topology & NestJS module boundaries
│   ├── AI_ARCHITECTURE.md    # RAG pipeline & dual-mode simulation engine specifications
│   └── API_SPEC.md           # REST API reference & payload schemas
├── docker-compose.yml        # Multi-container setup (PostgreSQL + pgvector, Redis, PgAdmin)
└── package.json              # Workspace root configuration
```

---

## 🎯 How It Benefits QA

TaskPilot AI is designed not just as a demo app, but as a premier **System Under Test (SUT)** that directly empowers QA professionals, automation engineers, and AI testing researchers:

1. **Realistic, Multi-Layered Defect Benchmarking**
   - Unlike toy test apps with artificial bugs, TaskPilot AI embeds **50 real-world defects across all layers** (frontend UI desync, backend race conditions, database constraints, security flaws, and AI RAG edge cases). It serves as a comprehensive benchmark for evaluating automated testing frameworks, self-healing test agents, and AI QA bots.
2. **Deterministic & Live AI Testing (Dual-Mode)**
   - Testing AI features normally suffers from non-deterministic LLM outputs and cost overheads. With `x-ai-simulation: true`, QA teams can run deterministic, cost-free regression suites against structured mock AI responses without calling live OpenAI API endpoints.
3. **End-to-End Automation Readiness**
   - Built with clean DOM semantics and structured REST APIs (`/api/*`), QA engineers can easily build and validate comprehensive automation suites using **Playwright, Cypress, or Selenium**, as well as API automation suites using **Postman or RestAssured**.
4. **Comprehensive Ground-Truth Verification**
   - Every single injected defect is thoroughly documented in [`docs/BUG_CATALOG.md`](file:///C:/Users/mvsar/Projects/TaskPilotAI/docs/BUG_CATALOG.md) with reproduction steps, root causes, and expected behavior. QA engineers can verify exact test coverage and calculate defect detection accuracy against ground-truth data.
5. **Role-Based Security & Permission Testing**
   - With 6 distinct enterprise roles (`ADMIN`, `PROJECT_MANAGER`, `DEVELOPER`, `QA_ENGINEER`, `PRODUCT_OWNER`, `VIEWER`), QA teams can practice security testing, IDOR vulnerability detection, and role-based access control validation out of the box.

---

## ✍️ Author

**Saran Kumar**

