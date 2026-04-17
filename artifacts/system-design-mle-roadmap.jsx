import { useState } from "react";

const roadmap = [
  {
    phase: "01",
    title: "How Systems Think: Fundamentals",
    duration: "1–1.5 weeks",
    color: "#34D399",
    icon: "⬟",
    goal: "Build the core vocabulary and mental models that underpin every design decision. This is the phase that makes interview questions and architecture docs readable.",
    mlAngle: "Every ML system is a distributed system. Model servers, feature pipelines, and agent orchestrators all fail in the same ways general systems do — understanding why now saves weeks of debugging later.",
    topics: [
      {
        name: "Scalability Primitives",
        items: [
          "Vertical vs. horizontal scaling — and why ML inference defaults to horizontal",
          "Stateless vs. stateful services: which one is your model server? Your agent?",
          "Throughput vs. latency — they pull in opposite directions, always",
          "Back-of-envelope estimation: QPS, memory, bandwidth before writing a line of code",
        ],
      },
      {
        name: "Distributed Systems First Principles",
        items: [
          "CAP theorem: you can't have consistency + availability + partition tolerance simultaneously",
          "Consistency models: strong, eventual, causal — which matters for a feature store vs. a chat history store",
          "Fault tolerance: what happens when one of your 5 agent nodes dies mid-task?",
          "Idempotency: why your Celery tasks and agent tool calls must be safe to retry",
        ],
      },
      {
        name: "Reliability Vocabulary",
        items: [
          "SLI / SLO / SLA — how to define 'working' for a model serving endpoint",
          "P50 / P95 / P99 latency — why averages lie about your worst users",
          "Error budgets: how much downtime can your system afford per month?",
          "Graceful degradation: serving a cached result when the model is overloaded",
        ],
      },
    ],
    resources: [
      { label: "System Design Primer — GitHub (Free, Comprehensive)", url: "https://github.com/donnemartin/system-design-primer" },
      { label: "Designing Data-Intensive Applications — Ch. 1–2", url: "https://dataintensive.net/" },
      { label: "Back-of-Envelope Estimation — ByteByteGo", url: "https://bytebytego.com/courses/system-design-interview/back-of-envelope-estimation" },
    ],
  },
  {
    phase: "02",
    title: "Databases: Picking the Right Store",
    duration: "1.5–2 weeks",
    color: "#60A5FA",
    icon: "◈",
    goal: "Understand the design space of storage systems well enough to justify every database choice in a design doc or interview — and know exactly why DocSage-ML uses Postgres + Redis + a vector store.",
    mlAngle: "ML systems routinely use 3–5 different storage systems simultaneously. A CV pipeline might use S3 for raw frames, Postgres for metadata, Redis for caching, and Qdrant for embedding retrieval. Knowing each one's guarantees prevents silent data corruption and cascading failures.",
    topics: [
      {
        name: "Relational Databases (SQL)",
        items: [
          "ACID properties — and what each one actually buys you in practice",
          "Indexing: B-tree vs. hash indexes, composite indexes, query planning",
          "N+1 query problem and why ORMs hide it from you",
          "Connection pooling: why 500 concurrent FastAPI workers can't each hold a Postgres connection",
          "Read replicas for scaling read-heavy ML metadata workloads",
        ],
      },
      {
        name: "NoSQL & Specialized Stores",
        items: [
          "Key-value stores (Redis): TTL, eviction policies, pub/sub — caching, rate limiting, job queues",
          "Document stores (MongoDB): when schema flexibility beats relational integrity",
          "Object storage (S3/MinIO): how ML teams actually store images, model weights, and dataset artifacts",
          "Time-series DBs (Prometheus, InfluxDB): purpose-built for metrics and model telemetry",
        ],
      },
      {
        name: "Vector Databases",
        items: [
          "ANN search: HNSW and IVF-Flat index structures — the actual algorithm, not just the name",
          "FAISS vs. Qdrant vs. ChromaDB — operational tradeoffs beyond accuracy",
          "Filtering + vector search: metadata pre-filtering vs. post-filtering for CV retrieval",
          "Embedding versioning: what happens when you update your CLIP model and invalidate stored embeddings?",
        ],
      },
      {
        name: "Sharding, Replication & Consistency",
        items: [
          "Horizontal sharding strategies: range, hash, directory-based",
          "Replication lag and the 'read your own writes' problem",
          "When to denormalize: ML feature stores often trade normalization for query speed",
          "The dual-write problem: keeping Postgres and a vector store in sync",
        ],
      },
    ],
    resources: [
      { label: "CMU 15-445 Database Systems — Free Course (Andy Pavlo)", url: "https://15445.courses.cs.cmu.edu/" },
      { label: "Redis University — Free Courses", url: "https://university.redis.io/" },
      { label: "Qdrant Docs — Vector DB Concepts", url: "https://qdrant.tech/documentation/concepts/" },
      { label: "DDIA — Ch. 3 (Storage & Retrieval), Ch. 5 (Replication)", url: "https://dataintensive.net/" },
    ],
  },
  {
    phase: "03",
    title: "APIs, Services & Async Communication",
    duration: "1–1.5 weeks",
    color: "#F472B6",
    icon: "⟁",
    goal: "Design APIs that are versioned, observable, and resilient — and understand when to go async. This is the connective tissue of every multi-service ML system and every agentic pipeline.",
    mlAngle: "Agent orchestrators are fundamentally API clients. When your LangGraph agent calls a CV model endpoint, a retrieval service, and a database — the failure modes of each interaction (timeouts, retries, partial failures) determine whether your agent produces a valid result or silent garbage.",
    topics: [
      {
        name: "REST API Design",
        items: [
          "Resource modeling: nouns not verbs, hierarchical URLs, correct HTTP semantics",
          "Idempotency keys for safe retries on POST requests",
          "API versioning strategies: URI vs. header vs. content negotiation",
          "Cursor-based pagination vs. offset — why ML pipelines prefer cursor",
          "Rate limiting: token bucket vs. leaky bucket algorithms",
        ],
      },
      {
        name: "gRPC & Streaming",
        items: [
          "Why gRPC over REST for internal ML services: binary serialization, strict contracts, streaming",
          "Protocol Buffers: schema definition, forward/backward compatibility",
          "Server-side streaming: how to stream model output tokens or video frames",
          "When to use gRPC (internal microservices) vs. REST (external-facing APIs)",
        ],
      },
      {
        name: "Async Communication & Queues",
        items: [
          "Synchronous vs. asynchronous: when a client shouldn't wait for the model to finish",
          "Message queues: Celery + Redis, RabbitMQ, Kafka — producer/consumer patterns",
          "Dead letter queues: what happens to failed CV inference jobs",
          "Exactly-once vs. at-least-once delivery — matters for billing and deduplication",
          "Webhook patterns: pushing results back to clients when async jobs complete",
        ],
      },
      {
        name: "Resilience Patterns",
        items: [
          "Circuit breaker: stop hammering a failing model endpoint",
          "Retry with exponential backoff and jitter",
          "Bulkhead: isolate slow inference workers from fast metadata APIs",
          "Timeout budgets: how to set timeouts across a chain of agent tool calls",
        ],
      },
    ],
    resources: [
      { label: "REST API Design Best Practices — Microsoft Docs (Free)", url: "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design" },
      { label: "gRPC Core Concepts — Official Docs", url: "https://grpc.io/docs/what-is-grpc/core-concepts/" },
      { label: "Celery Documentation — Task Queues", url: "https://docs.celeryq.dev/" },
      { label: "Exponential Backoff and Jitter — AWS Blog", url: "https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/" },
    ],
  },
  {
    phase: "04",
    title: "Infrastructure: Containers, Orchestration & CI/CD",
    duration: "1.5–2 weeks",
    color: "#FB923C",
    icon: "◎",
    goal: "Go from 'runs on localhost' to 'runs reliably in production' — understand the infrastructure decisions that make ML systems deployable, reproducible, and maintainable by a team.",
    mlAngle: "ML projects die in deployment. Models trained in notebooks that can't be containerized, pipelines that only work on the author's machine, no CI to catch regressions — these are the failure modes that separate research code from production engineering. This phase closes that gap.",
    topics: [
      {
        name: "Docker: Beyond Basics",
        items: [
          "Multi-stage builds: separate build and runtime images to minimize model container size",
          "Layer caching strategy: order Dockerfile instructions to maximize cache hits",
          "Non-root users and secrets management — never bake API keys into images",
          "Health checks and graceful shutdown (SIGTERM handling in FastAPI)",
          "Docker Compose for local multi-service dev: FastAPI + Postgres + Redis + Celery",
        ],
      },
      {
        name: "Kubernetes for ML Engineers",
        items: [
          "Core objects: Pod, Deployment, Service, ConfigMap, Secret, PVC",
          "Resource requests vs. limits for GPU workloads — always set both",
          "Rolling deployments and rollbacks: zero-downtime model updates",
          "Jobs and CronJobs: batch inference pipelines and periodic retraining triggers",
          "HorizontalPodAutoscaler on custom metrics (queue depth, GPU utilization)",
        ],
      },
      {
        name: "CI/CD for ML Systems",
        items: [
          "GitHub Actions: lint → test → build image → push → deploy",
          "Testing strategy: unit tests for preprocessing, integration tests for API contracts",
          "Model artifact versioning in CI: DVC or MLflow tracking tied to git commits",
          "Environment parity: why staging must mirror prod (GPU type, memory, env vars)",
          "Canary deployments: route 5% of traffic to new model version before full rollout",
        ],
      },
      {
        name: "Networking Basics",
        items: [
          "Ingress controllers: exposing ML APIs with TLS termination and path routing",
          "Internal DNS: how service-to-service calls work inside Kubernetes",
          "L4 vs. L7 load balancers and when each matters for inference workloads",
          "Sidecar pattern: the foundation of service meshes — just the concept level",
        ],
      },
    ],
    resources: [
      { label: "Docker Docs — Multi-stage Builds", url: "https://docs.docker.com/build/building/multi-stage/" },
      { label: "Kubernetes.io — Interactive Tutorial (Free)", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/" },
      { label: "GitHub Actions — Official Quickstart", url: "https://docs.github.com/en/actions/quickstart" },
      { label: "DVC — Data & Model Versioning (Free, Open Source)", url: "https://dvc.org/doc" },
    ],
  },
  {
    phase: "05",
    title: "ML System Design Patterns",
    duration: "1.5 weeks",
    color: "#A78BFA",
    icon: "⬡",
    goal: "Learn the canonical ML system architectures as structured design patterns you can reason about, extend, and discuss in interviews — model serving, data pipelines, feature stores, agentic systems, and observability.",
    mlAngle: "This phase ties everything together. The patterns here apply directly to DocSage-ML, CV inference systems, and multi-agent pipelines. Knowing these by name and trade-off lets you lead architectural conversations rather than just follow them.",
    topics: [
      {
        name: "Model Serving Architecture",
        items: [
          "Synchronous serving (REST/gRPC) vs. async batch inference — decision criteria",
          "Model server options: TorchServe, Triton Inference Server, vLLM, custom FastAPI",
          "Dynamic request batching for CV models at the server level",
          "Model versioning: A/B testing two YOLO versions behind a single endpoint",
          "Shadow mode: running a new model in parallel without serving its output",
        ],
      },
      {
        name: "Data Pipelines for ML",
        items: [
          "Lambda architecture: batch layer + speed layer + serving layer",
          "Feature stores: offline vs. online stores and the point-in-time correctness problem",
          "For CV: image preprocessing pipelines — resizing, normalization, augmentation at scale",
          "Data versioning and lineage: tracking which training data produced which model",
          "Training–serving skew: why offline metrics don't match production",
        ],
      },
      {
        name: "Agentic System Architecture",
        items: [
          "Agents as distributed systems: each tool call is a remote service invocation",
          "Orchestrator vs. executor pattern: one stateful coordinator, many stateless workers",
          "State management: where does agent memory live across steps and across restarts?",
          "Task decomposition and routing: how a planner decides which agent handles what",
          "Failure handling in agent graphs: partial failure, retry budgets, fallback agents",
        ],
      },
      {
        name: "Observability for ML Systems",
        items: [
          "The three pillars: metrics (Prometheus), logs (structured JSON), traces (OpenTelemetry)",
          "ML-specific metrics: prediction latency, model throughput, drift detection signals",
          "Data quality monitoring: schema validation and distribution shift alerts",
          "The feedback loop: logging model inputs/outputs to power future retraining",
        ],
      },
    ],
    resources: [
      { label: "Chip Huyen — ML Systems Design (Free Chapter Summaries)", url: "https://huyenchip.com/machine-learning-systems-design/toc.html" },
      { label: "Made With ML — MLOps Course (Free)", url: "https://madewithml.com/" },
      { label: "Full Stack Deep Learning — Free Course", url: "https://fullstackdeeplearning.com/course/2022/" },
      { label: "Feast — Open Source Feature Store Docs", url: "https://docs.feast.dev/" },
    ],
  },
  {
    phase: "06",
    title: "System Design Interview Playbook",
    duration: "1 week",
    color: "#38BDF8",
    icon: "◇",
    goal: "Turn accumulated knowledge into structured performance under interview conditions. Learn the canonical framework, practice ML-specific design problems, and build the vocabulary to lead architectural conversations.",
    mlAngle: "MLE design rounds test whether you can translate ML requirements into system constraints — not whether you can train a model. 'Design a real-time object detection system for a retail chain' is a systems question with an ML component, not the other way around.",
    topics: [
      {
        name: "The Design Framework",
        items: [
          "Step 1 — Clarify requirements: functional (what it does) vs. non-functional (scale, latency, consistency)",
          "Step 2 — Capacity estimation: QPS, storage, bandwidth — back-of-envelope before drawing boxes",
          "Step 3 — High-level design: data flow first, then components",
          "Step 4 — Deep dive: the interviewer will pick one component — be ready on any",
          "Step 5 — Trade-offs: every choice you make, name what you gave up",
        ],
      },
      {
        name: "ML System Design Question Types",
        items: [
          "Inference system: 'Design a CV API that processes 10K images/sec with <100ms P99'",
          "Training pipeline: 'Design a system to retrain a fraud detection model daily'",
          "Data platform: 'Design a feature store for a recommendation system'",
          "Agentic: 'Design a multi-agent code review system that calls static analysis tools'",
          "Hybrid: 'Design YouTube's video recommendation system end-to-end'",
        ],
      },
      {
        name: "Communication Patterns",
        items: [
          "Narrate your trade-offs out loud — silence reads as uncertainty",
          "Name your patterns: 'I'd use a circuit breaker here because...'",
          "Drive the scope: 'I'll focus on the inference path first, shall I come back to training?'",
          "Acknowledge unknowns honestly: 'I'd validate this assumption before committing'",
          "Whiteboard hygiene: components as boxes, data flow as arrows, labels on everything",
        ],
      },
    ],
    resources: [
      { label: "HelloInterview — ML System Design Guides (Free)", url: "https://www.hellointerview.com/learn/system-design/in-a-hurry/introduction" },
      { label: "ByteByteGo — System Design YouTube (Free)", url: "https://www.youtube.com/@ByteByteGo" },
      { label: "System Design Interview — Concepts You Should Know", url: "https://www.freecodecamp.org/news/systems-design-for-interviews/" },
    ],
  },
  {
    phase: "07",
    title: "Guided Capstone Project",
    duration: "2–3 weeks",
    color: "#FACC15",
    icon: "★",
    goal: "Design and implement a Production CV Inference Platform: multi-tenant image upload, async CV inference, vector similarity search, full observability stack, and a LangGraph agentic analysis layer on top.",
    isProject: true,
    milestones: [
      {
        week: "Week 1",
        title: "Design Doc & Core Infrastructure",
        tasks: [
          "Write a 1-page architecture design doc before touching code: functional requirements (upload, async inference, result retrieval), non-functional requirements (target QPS, latency SLO, storage estimate), and a component diagram. Treat this as a design interview answer written down.",
          "Containerize a FastAPI service with a pretrained CV model (YOLO or Torchvision). Multi-stage Dockerfile, non-root user, SIGTERM handler, /health endpoint.",
          "Set up Docker Compose: FastAPI + Postgres + Redis + Celery worker. Mirrors your DocSage-ML stack — intentionally.",
          "Design and migrate the Postgres schema: jobs table (id, status, user_id, image_path, result_json, created_at), users, API keys. Add appropriate indexes and explain your choices.",
          "Implement async job flow: POST /infer → enqueue Celery task → return job_id. GET /jobs/{id} → poll status. Redis stores result for fast retrieval after completion.",
        ],
      },
      {
        week: "Week 2",
        title: "API Design, Storage & Observability",
        tasks: [
          "Version your API at /api/v1/infer. Add cursor-based pagination to GET /jobs. Implement per-API-key rate limiting via Redis token bucket.",
          "Add MinIO (free, local S3-compatible): images stored as {user_id}/{job_id}.jpg — never binary blobs in Postgres. Update the job flow to upload to MinIO before enqueuing.",
          "Add FAISS or ChromaDB: after inference, embed the image with CLIP and store the embedding + job_id. Implement GET /similar?job_id=X — nearest-neighbor retrieval across past results.",
          "Deploy Prometheus + Grafana via Docker Compose. Instrument FastAPI with prometheus-fastapi-instrumentator. Dashboard: request rate, P99 latency, queue depth, inference duration, error rate.",
          "Add structured JSON logging (structlog). Every log line carries request_id, user_id, job_id, duration_ms. Write a query that finds all failed jobs for a specific user in the last 24 hours.",
        ],
      },
      {
        week: "Week 3",
        title: "Agentic Layer & Design Review",
        tasks: [
          "Build a LangGraph agent with three tools: run_inference(image_url), get_similar_images(job_id, k), get_job_history(user_id, limit). Agent answers natural language queries about the system.",
          "Implement circuit breaker logic in the agent's tool calls: if the inference service returns 3 consecutive 5xx errors, the agent stops calling it and returns a graceful degraded response.",
          "Add canary routing: an NGINX config that sends 10% of /infer traffic to a v2 model container and 90% to v1. Log which model version handled each request. Compare error rates in Grafana.",
          "Write a GitHub Actions CI pipeline: lint (ruff) → unit tests (pytest, mock the model) → build images → docker-compose up → smoke test /health and /infer.",
          "Write a post-project design review: for each major decision (Postgres over MongoDB, Celery over BackgroundTasks, FAISS over Qdrant), one paragraph on the trade-off and what you'd change at 100x scale.",
        ],
      },
    ],
    stack: ["FastAPI", "PostgreSQL", "Redis + Celery", "MinIO (S3-compatible)", "FAISS / ChromaDB", "CLIP", "YOLO / Torchvision", "Prometheus + Grafana", "LangGraph", "NGINX", "Docker Compose", "GitHub Actions"],
  },
];

const PhaseCard = ({ phase, active, onClick }) => (
  <div onClick={onClick} style={{
    cursor: "pointer",
    border: `1px solid ${active ? phase.color : "rgba(255,255,255,0.07)"}`,
    borderLeft: `3px solid ${phase.color}`,
    background: active ? `${phase.color}0d` : "rgba(255,255,255,0.015)",
    borderRadius: "5px", padding: "12px 15px", marginBottom: "7px", transition: "all 0.18s ease",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span style={{ fontSize: "15px", color: phase.color }}>{phase.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "9px", color: phase.color, fontFamily: "monospace", letterSpacing: "0.15em", fontWeight: 700 }}>PHASE {phase.phase}</span>
          {phase.isProject && <span style={{ fontSize: "8px", background: phase.color, color: "#000", padding: "1px 5px", borderRadius: "2px", fontWeight: 800 }}>PROJECT</span>}
        </div>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "#eee", marginTop: "2px", lineHeight: 1.3 }}>{phase.title}</div>
      </div>
      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", fontFamily: "monospace", whiteSpace: "nowrap", flexShrink: 0 }}>{phase.duration}</span>
    </div>
  </div>
);

export default function App() {
  const [active, setActive] = useState(0);
  const phase = roadmap[active];

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0f", fontFamily: "'Inter', -apple-system, sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "24px 36px 20px" }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "5px" }}>
            <span style={{ fontSize: "9px", color: "#34D399", fontFamily: "monospace", letterSpacing: "0.2em", fontWeight: 700 }}>MLE TRACK</span>
            <span style={{ color: "rgba(255,255,255,0.1)" }}>—</span>
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", fontFamily: "monospace", letterSpacing: "0.15em" }}>SYSTEM DESIGN ROADMAP</span>
          </div>
          <h1 style={{ fontSize: "clamp(17px, 2.6vw, 25px)", fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>
            System Design for ML Engineers
          </h1>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.32)", marginTop: "5px" }}>
            ~9–11 weeks · General systems + ML angle every phase · CV-informed · Interviews + Projects + Agentic systems
          </p>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: "1160px", margin: "0 auto", padding: "26px 36px", display: "grid", gridTemplateColumns: "285px 1fr", gap: "26px", width: "100%" }}>
        <div>
          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.18em", fontFamily: "monospace", marginBottom: "11px" }}>PHASES</div>
          {roadmap.map((p, i) => <PhaseCard key={i} phase={p} active={active === i} onClick={() => setActive(i)} />)}
          <div style={{ marginTop: "16px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "5px", padding: "13px 15px", background: "rgba(255,255,255,0.015)" }}>
            <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", fontFamily: "monospace", marginBottom: "5px" }}>TOTAL ESTIMATE</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff" }}>~9–11 wks</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.26)", marginTop: "3px" }}>~10 hrs/week</div>
          </div>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.018)",
          border: `1px solid ${phase.color}18`,
          borderTop: `2px solid ${phase.color}`,
          borderRadius: "7px", padding: "24px 28px", overflowY: "auto", maxHeight: "80vh",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <div style={{ fontSize: "9px", color: phase.color, letterSpacing: "0.2em", fontFamily: "monospace", fontWeight: 700 }}>
                PHASE {phase.phase} · {phase.duration}
              </div>
              <h2 style={{ fontSize: "19px", fontWeight: 700, color: "#fff", margin: "5px 0 0", letterSpacing: "-0.01em" }}>{phase.title}</h2>
            </div>
            <span style={{ fontSize: "26px", color: phase.color, opacity: 0.4, flexShrink: 0 }}>{phase.icon}</span>
          </div>

          <div style={{ background: `${phase.color}0d`, border: `1px solid ${phase.color}22`, borderRadius: "5px", padding: "10px 13px", marginBottom: "10px" }}>
            <span style={{ fontSize: "9px", color: phase.color, fontFamily: "monospace", letterSpacing: "0.15em", fontWeight: 700 }}>GOAL  </span>
            <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{phase.goal}</span>
          </div>

          {phase.mlAngle && (
            <div style={{ background: "rgba(167,139,250,0.07)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "5px", padding: "10px 13px", marginBottom: "20px" }}>
              <span style={{ fontSize: "9px", color: "#A78BFA", fontFamily: "monospace", letterSpacing: "0.15em", fontWeight: 700 }}>ML ANGLE  </span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.52)", lineHeight: 1.6 }}>{phase.mlAngle}</span>
            </div>
          )}

          {!phase.isProject ? (
            <>
              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.18em", fontFamily: "monospace", marginBottom: "13px" }}>TOPICS</div>
              {phase.topics.map((t, i) => (
                <div key={i} style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "10px", color: phase.color, fontFamily: "monospace", letterSpacing: "0.13em", fontWeight: 700, marginBottom: "9px" }}>▸ {t.name.toUpperCase()}</div>
                  {t.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", gap: "9px", marginBottom: "6px" }}>
                      <span style={{ color: "rgba(255,255,255,0.16)", fontSize: "11px", marginTop: "2px", flexShrink: 0 }}>·</span>
                      <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.18em", fontFamily: "monospace", marginBottom: "9px" }}>RESOURCES</div>
                {phase.resources.map((r, i) => (
                  <a key={i} href={r.url} target="_blank" rel="noreferrer" style={{
                    display: "flex", alignItems: "center", gap: "8px", color: phase.color, fontSize: "12px",
                    textDecoration: "none", padding: "6px 10px", background: `${phase.color}08`,
                    borderRadius: "4px", border: `1px solid ${phase.color}18`, marginBottom: "6px",
                  }}>
                    <span style={{ fontSize: "9px", opacity: 0.5 }}>↗</span>{r.label}
                  </a>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
                {phase.stack.map((s, i) => (
                  <span key={i} style={{
                    fontSize: "10px", padding: "3px 8px", background: `${phase.color}10`,
                    border: `1px solid ${phase.color}25`, color: phase.color,
                    borderRadius: "3px", fontFamily: "monospace",
                  }}>{s}</span>
                ))}
              </div>
              {phase.milestones.map((m, i) => (
                <div key={i} style={{ marginBottom: "22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "11px" }}>
                    <span style={{ fontSize: "9px", color: phase.color, fontFamily: "monospace", letterSpacing: "0.15em", fontWeight: 700 }}>{m.week.toUpperCase()}</span>
                    <div style={{ flex: 1, height: "1px", background: `${phase.color}18` }} />
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.42)", fontWeight: 600 }}>{m.title}</span>
                  </div>
                  {m.tasks.map((task, j) => (
                    <div key={j} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                      <span style={{ fontSize: "9px", color: phase.color, fontFamily: "monospace", marginTop: "3px", flexShrink: 0, opacity: 0.6 }}>{String(j + 1).padStart(2, "0")}</span>
                      <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>{task}</span>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
