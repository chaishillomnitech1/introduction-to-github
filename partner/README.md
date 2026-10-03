<div align="center">

# ◈ PARTNER

### Your business, on autonomous mode.

**The autonomous AI operating system for ambitious execution.**
*Goals in. Governed execution out. Humans only where judgment matters.*

`Status: Pre-seed foundation` · `Wedge: AI Chief of Staff for founders & small teams` · `Model: SaaS + usage + services`

[Pitch](docs/investors/pitch-deck.md) · [MVP](docs/product/mvp-features.md) · [Architecture](docs/architecture/architecture.md) · [90-Day Plan](docs/launch/90-day-plan.md) · [Operating Model](docs/operations/operating-model.md) · [Brand](docs/brand/brand-package.md)

</div>

---

## Why Partner

Most AI tools help with a task. **Partner runs the work.** You state an outcome; **Conductor** (orchestrator) decomposes it, routes each task to the best-fit **Specialist**, **Sentinel** (oversight) audits every output, and you approve only what crosses a risk boundary.

```
 YOU ──► CONDUCTOR ──► SPECIALISTS ──► SENTINEL ──► (APPROVAL GATE) ──► DELIVERED
  ▲          │ plan/route     │ execute        │ QA/risk/brand               │
  └──────────┴──── MEMORY + ANALYTICS: every outcome improves the next ◄─────┘
```

## What is in this repo

| Deliverable | Location |
|---|---|
| Investor narrative & pitch deck outline | [`docs/investors/`](docs/investors) |
| MVP feature list (prioritized, with acceptance criteria) | [`docs/product/mvp-features.md`](docs/product/mvp-features.md) |
| Architecture diagram + explanation | [`docs/architecture/`](docs/architecture) |
| Operating model (routing, oversight, approval boundaries) | [`docs/operations/`](docs/operations) |
| 90-day execution plan, launch plan | [`docs/launch/`](docs/launch) |
| Brand package (names, taglines, positioning, voice) | [`docs/brand/`](docs/brand) |
| Roadmap | [`ROADMAP.md`](ROADMAP.md) |
| Machine-readable specialist registry & policies | [`config/`](config) |
| Working routing example (Python, stdlib only) | [`examples/router.py`](examples/router.py) |

## Quick start

```bash
python3 examples/router.py            # routes sample tasks, applies approval policy
```

Output shows each task assigned to a specialist, its risk tier, and whether human approval is required.

## Core concepts (shared vocabulary)

| Term | Meaning |
|---|---|
| **Partner OS** | The product. |
| **Conductor** | Orchestrator: goal → plan → tasks → routing. |
| **Specialists** | Role-specific AI workers (Strategist, Researcher, Writer, Marketer, Designer, Engineer, Operator, Analyst, Support, Finance). |
| **Sentinel** | Oversight layer: QA, risk, brand-voice, audit. |
| **Gates** | Human approval checkpoints by risk tier (T0–T3). |
| **Ledger** | Immutable audit log of every decision and action. |
| **Memory** | Workspace knowledge + learned outcomes. |

## Revenue model at a glance

Free → **Pro** ($79/mo) → **Team** ($399/mo) → **Enterprise** (custom) + usage-based runs + done-for-you onboarding + marketplace take rate. See [business model](docs/investors/business-model.md).

## Principles

Flow like water · Precision over noise · Right specialist, right job · Trust is earned through audit · Compounding intelligence.

## Repo layout

```
partner/
├── README.md  ROADMAP.md  CONTRIBUTING.md  LICENSE-NOTICE.md
├── docs/{investors,product,architecture,operations,brand,launch}/
├── config/{agents,policies}/
└── examples/
```

> **Extraction note:** this folder is self-contained so it can be moved into `chaishillomnitech1/partner` as-is (`git subtree split --prefix=partner`).
