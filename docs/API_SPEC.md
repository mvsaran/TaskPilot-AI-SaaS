# TaskPilot AI — REST API Specification & Payload Reference

All API routes are prefixed under `/api/v1` and protected via JWT authentication (`Authorization: Bearer <accessToken>`), except for `/auth/login`, `/auth/register`, and `/common/health`.

---

## 1. Authentication & Identity (`/api/v1/auth`)

### `POST /api/v1/auth/login`
Authenticates credentials against database and returns signed access and refresh tokens.
- **Payload**: `{"email": "dev@taskpilot.ai", "password": "Password123!"}`
- **Response (`200 OK`)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "usr-dev-01",
    "email": "dev@taskpilot.ai",
    "fullName": "Sarah Connor",
    "role": "DEVELOPER",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  }
}
```

### `POST /api/v1/auth/refresh`
Rotates access token using stored refresh token (`localStorage`).

---

## 2. Projects & Workspace (`/api/v1/projects`)

### `GET /api/v1/projects`
Returns paginated list of projects filtered by team or search query.
- **Query Params**: `?teamId=...&search=...&page=1&limit=20&sort=name`
- **Response (`200 OK`)**:
```json
{
  "data": [
    {
      "id": "prj-alpha",
      "key": "ALPHA",
      "name": "TaskPilot AI Core Engine & RAG Indexer",
      "status": "ACTIVE",
      "healthScore": 94.5,
      "teamId": "team-eng"
    }
  ],
  "meta": { "total": 1, "page": 1, "limit": 20 }
}
```

### `POST /api/v1/projects` (`ADMIN`, `PROJECT_MANAGER`)
Creates a new workspace project.

### `DELETE /api/v1/projects/:id` (`ADMIN`, `PROJECT_MANAGER`)
Deletes project and cascades Epics/Stories/Tasks (`BUG-SEC-01` injected check failure).

---

## 3. Tasks & Kanban Swimlanes (`/api/v1/tasks`)

### `GET /api/v1/tasks`
Fetches tasks filtered by project, sprint, assignee, or status.
- **Query Params**: `?projectId=prj-alpha&sprintId=sprint-3&status=IN_PROGRESS`

### `PATCH /api/v1/tasks/:id/status`
Optimistically moves a task card across Kanban columns (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`).
- **Payload**: `{"status": "DONE"}`

### `POST /api/v1/tasks/:id/comments`
Appends a comment with real-time `@username` mention detection and audit trail logging.
- **Payload**: `{"content": "Please review with @dev before deploying."}`

### `PATCH /api/v1/tasks/subtasks/:id/toggle`
Toggles subtask completion status (`isCompleted: boolean`).

---

## 4. AI Hub & Copilot Capabilities (`/api/v1/ai`)

All AI endpoints accept the optional header `x-ai-simulation: true` to return instant, zero-latency deterministic QA simulation results.

| Endpoint | Method | Request Body Schema | Key Output Field |
| :--- | :--- | :--- | :--- |
| `/ai/task-generator` | `POST` | `{"prompt": "Build OAuth2 login", "projectId": "..."}` | `tasks: [{ title, priority, storyPoints, subtasks }]` |
| `/ai/sprint-planner` | `POST` | `{"prompt": "Balance velocity...", "projectId": "..."}` | `recommendations: [{ assignee, assignedTasks, capacity }]` |
| `/ai/story-generator` | `POST` | `{"prompt": "As user I want...", "projectId": "..."}` | `story: { acceptanceCriteria, definitionOfDone }` |
| `/ai/summarize-bug` | `POST` | `{"logs": "Exception in... stack trace"}` | `summary: { rootCause, severity, proposedFix }` |
| `/ai/predict-risk` | `POST` | `{"projectContext": "...", "projectId": "..."}` | `riskAnalysis: { riskScore, riskFactor, mitigation }` |
| `/ai/rag-chat` | `POST` | `{"question": "What is RBAC rule?", "projectId": "..."}` | `ragResult: { answer, citations: ["doc#chunk"] }` |
| `/ai/assistant-chat` | `POST` | `{"message": "Summarize sprint 3 status"}` | `reply: "Sprint 3 is currently 94% on track..."` |

---

## 5. RAG Knowledge Base (`/api/v1/knowledge`)

### `POST /api/v1/knowledge`
Uploads document payload (`PDF`, `DOCX`, `Markdown`), extracts text, splits into 512-token chunks with 64-token overlap, generates 1536d OpenAI embeddings, and indexes into PostgreSQL `pgvector`.

---

## 6. Real-Time Telemetry (`/api/v1/notifications/stream`)

### `GET /api/v1/notifications/stream`
Open Server-Sent Events (`SSE`) stream emitting real-time project updates, task comments, and AI alerts directly to connected frontend clients.
