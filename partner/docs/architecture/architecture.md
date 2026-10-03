# Architecture

## Diagram

```
┌────────────────────────── CLIENTS ──────────────────────────┐
│  Web app (command center) │ Slack bot │ Public API (P2)      │
└───────────────┬─────────────────────────────────────────────┘
                ▼
        ┌───────────────┐   authn/z, tenancy, rate limits
        │  API Gateway  │
        └───────┬───────┘
                ▼
┌────────────────────────── CONTROL PLANE ───────────────────────────┐
│  CONDUCTOR (orchestrator)                                          │
│   ├─ Planner: goal → task graph                                    │
│   ├─ Router: skill · history · cost · risk → specialist            │
│   ├─ Scheduler/Queue: retries, SLAs, budgets                       │
│   └─ Policy Engine: tier classification, approval gates            │
│  SENTINEL (oversight): QA · goal-alignment · brand · risk · drift  │
│  ANALYST: metrics, routing feedback, ROI                           │
└───────┬───────────────────────────────────────────┬────────────────┘
        ▼                                           ▼
┌──────── DATA PLANE: SPECIALIST POD ────────┐   ┌──── HUMAN LAYER ────┐
│ Strategist Researcher Writer Marketer      │   │ Approvals queue     │
│ Designer Engineer Operator Analyst         │──►│ Escalations         │
│ Support Finance   (+ third-party, P2)      │   │ Kill switch/budgets │
│  each: prompt · tools · model · limits     │   └─────────────────────┘
└───────┬────────────────────────────────────┘
        ▼
┌──────────── TOOL LAYER (sandboxed, scoped credentials) ──────────┐
│ Docs/Drive │ Email/Calendar │ CRM │ Slack │ Git │ Web search │ … │
└──────────────────────────────────────────────────────────────────┘
        ▼
┌──────────────────────── STATE ───────────────────────────┐
│ Postgres (goals, tasks, runs) │ Vector store (Memory)     │
│ Object store (artifacts)      │ Ledger (append-only)      │
└────────────────────────────────────────────────────────────┘
        Observability: traces, cost per run, eval suite
```

## Task lifecycle

```
INTAKE → PLANNED → ROUTED → RUNNING → IN_REVIEW(Sentinel) ─pass─► [GATE if T2/T3] → DONE
                                         │fail (<70)                   │reject
                                         └──── REWORK (max 2) ──► ESCALATED ◄┘
```

## Component responsibilities

| Component | Responsibility | Key interface |
|---|---|---|
| API Gateway | Auth, tenancy, quotas | REST/JSON |
| Conductor | Planning, routing, scheduling | `plan(goal)`, `route(task)` |
| Policy Engine | Classify risk tier, enforce gates, budgets | `config/policies/approval-policy.yaml` |
| Specialists | Execute with scoped tools | `config/agents/*.yaml` |
| Sentinel | Independent review; never the same model/prompt as the producer | `review(artifact, goal)` |
| Ledger | Immutable log (hash-chained) | append-only |
| Memory | Retrieval of brand, preferences, outcomes | vector + structured |

## Design decisions
- **Separation of duties:** producer and reviewer are different agents.
- **Least privilege:** each specialist gets only the tools and scopes it needs.
- **Model-agnostic:** specialists declare a model class; routing optimizes cost vs. quality.
- **Fail closed:** unknown risk → treated as T2 (approval required).
- **Everything is logged:** replayable runs and evals.

## Suggested stack
TypeScript (Next.js) front end; Python or TypeScript workers; Postgres + pgvector; Redis queue; S3-compatible storage; OpenTelemetry; Stripe.
