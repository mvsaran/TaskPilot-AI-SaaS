# TaskPilot AI — Decoupled AI Pipeline & RAG Indexer Architecture

TaskPilot AI incorporates a highly sophisticated, decoupled AI orchestration engine designed for low-latency copilot interactions, token window management, semantic vector indexing (`pgvector`), and high-fidelity deterministic simulation mode.

---

## 1. Decoupled AI Pipeline Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Client / UI
    participant Ctrl as AiController (/api/v1/ai/*)
    participant Svc as AiService
    participant Cache as AiCacheService (Redis)
    participant Prompt as PromptManagerService
    participant OpenAI as OpenAiClientService
    participant Parser as ResponseParserService
    participant RAG as KnowledgeService / RagIndexer

    User->>Ctrl: POST /ai/task-generator { prompt, projectId }
    Ctrl->>Svc: generateTasks(prompt, user, projectId)
    Svc->>Cache: checkCache(cacheKey)
    alt Cache Hit
        Cache-->>Svc: Return Cached JSON Response
        Svc-->>Ctrl: Return Result (from Cache)
    else Cache Miss
        Svc->>Prompt: renderTemplate('TASK_GENERATOR', { prompt, context })
        Prompt-->>Svc: Formatted System & User Prompts
        Svc->>OpenAI: generateCompletion({ messages, temperature: 0.2 })
        OpenAI-->>Svc: Raw LLM Output / Simulation Output
        Svc->>Parser: parseAndValidateJson(rawOutput, schema)
        Parser-->>Svc: Validated & Structured JSON Object
        Svc->>Cache: setCache(cacheKey, result, TTL=3600s)
        Svc-->>Ctrl: Return Result
        Ctrl-->>User: JSON Response to UI
    end
```

---

## 2. RAG (Retrieval-Augmented Generation) Vector Indexing (`pgvector`)

When users upload PDF, DOCX, or Markdown engineering specifications to `/api/v1/knowledge`, the document pipeline processes text through the following stages:

```mermaid
graph LR
    Doc[Document Upload PDF/DOCX/MD] --> Parse[Text Extraction pdf-parse / mammoth]
    Parse --> Chunk[Token Chunking 512 Tokens / 64 Overlap]
    Chunk --> Embed[OpenAI text-embedding-3-small 1536d Vector]
    Embed --> DB[(PostgreSQL pgvector <=> Cosine Distance Index)]
    Query[User Query RAG Assistant] --> QEmbed[Embed Query Vector]
    QEmbed --> Search[Postgres SELECT ... ORDER BY embedding <=> query_vec LIMIT 5]
    Search --> Citations[Return Top-K Chunks with Exact Document Citations]
```

### pgvector Operator Specification
In `RagIndexerService`, vector similarity search is executed using raw PostgreSQL `<=>` cosine distance operator:
```sql
SELECT id, "documentId", content, "chunkIndex",
       1 - (embedding <=> $1::vector) as similarity
FROM "KnowledgeChunk"
WHERE "documentId" IN ($2, $3...)
ORDER BY embedding <=> $1::vector
LIMIT 5;
```

---

## 3. Dual-Mode AI Client & Deterministic QA Simulation Mode

To support reliable, repeatable testing across Autonomous QA SUT workflows without incurring real API token charges or non-deterministic LLM variance, `OpenAiClientService` checks the `x-ai-simulation` request header or `OPENAI_SIMULATION_MODE=true` environment variable.

When enabled (`x-ai-simulation: true`):
- All 10 AI capabilities immediately return pre-computed, structured, realistic engineering responses.
- Eliminates network flakiness and rate limits during automated regression sweeps while maintaining exact JSON schemas.
