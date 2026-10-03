# Operating Model — Autonomous AI Specialist System

## 1. Layers & roles
| Layer | Actor | Authority |
|---|---|---|
| Human | Owner / approvers | Sets goals, policy, budgets; approves T2/T3 |
| Orchestration | Conductor | Plans, routes, schedules; cannot execute external actions |
| Execution | Specialists | Produce artifacts within tool scopes |
| Oversight | Sentinel | Reviews, blocks, escalates; cannot edit work |
| Learning | Analyst | Measures, recommends routing/policy changes |

## 2. Specialist registry
| Specialist | Best at | Typical tasks | Tools |
|---|---|---|---|
| Strategist | Prioritization, planning | OKRs, positioning | Docs |
| Researcher | Evidence gathering | Market/competitor briefs | Search, Docs |
| Writer | Long/short copy | Posts, emails, docs | Docs |
| Marketer | Campaigns | Calendars, ad copy | Social (draft), Analytics |
| Designer | Visual specs | Briefs, layout specs | Design |
| Engineer | Code & automation | Scripts, integrations | Git (PR only) |
| Operator | Process execution | Scheduling, follow-ups | Calendar, Email (draft) |
| Analyst | Data & reporting | Weekly reports, KPIs | Analytics |
| Support | Customer replies | Ticket drafts | Helpdesk |
| Finance | Budgets, forecasting | Cash view, invoices (draft) | Accounting (read) |

## 3. Task routing algorithm
Score = 0.45·skill_match + 0.25·historical_success + 0.15·(1−cost_norm) + 0.10·availability + 0.05·recency_context. Highest score wins; ties → lower cost. Candidates with a tool-scope gap are excluded. Router writes its reasoning to the Ledger. Runnable reference: [`examples/router.py`](../../examples/router.py).

## 4. Oversight cycle
1. Specialist submits artifact. 2. Sentinel scores quality, goal alignment, brand voice, risk (0–100). 3. ≥85 pass; 70–84 pass with notes; <70 rework (max 2 retries) then escalate. 4. Sentinel also samples completed work weekly for drift and reports to Analyst.

## 5. Human boundaries
See [approval boundaries](approval-boundaries.md). Summary: T0/T1 autonomous, T2 approval before external action, T3 dual approval or human-only.

## 6. Cadence (24/7 with human rhythm)
| Cadence | Activity | Owner |
|---|---|---|
| Continuous | Queue processing, review, alerts | Conductor/Sentinel |
| Daily | 15-min approvals sweep; digest | Human |
| Weekly | KPI review, routing tuning, policy changes | Human + Analyst |
| Monthly | Eval suite re-run, budget reset, decision log review | Human |

## 7. Escalation & incident response
Triggers: repeated failure, low confidence (<0.6), budget >80%, Sentinel risk flag, anomalous behavior. Action: pause affected goal, notify owner, log incident. Kill switch pauses all runs workspace-wide.

## 8. Continuous improvement
Outcomes (approved/rejected, edit distance, cycle time) feed routing weights and Memory. Policy changes happen only through human-approved PRs to `config/`.

## 9. KPIs
Task success rate ≥90%; human-intervention rate trending down; cycle time; Sentinel false-pass rate <2%; cost/run; hours saved per workspace.
