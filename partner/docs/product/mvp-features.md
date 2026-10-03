# MVP Feature List — "AI Command Center"

Priority: **P0** must ship by day 60; **P1** by day 90; **P2** post-launch.

| ID | Feature | Pri | Acceptance criteria |
|---|---|---|---|
| F1 | Auth & workspaces | P0 | Email/OAuth login; workspace with members |
| F2 | Goal intake | P0 | Free-text goal + success metric + deadline saved |
| F3 | Plan generation (Conductor) | P0 | Goal → ≤20 tasks with owner-role, risk tier, estimate |
| F4 | Specialist registry | P0 | 10 specialists loaded from `config/agents/` |
| F5 | Task router | P0 | Routes by skill match, past success, cost, risk; reason logged |
| F6 | Execution runner | P0 | Specialist produces artifact, stored with versions |
| F7 | Sentinel review | P0 | Score 0–100 on quality, goal alignment, brand voice, risk; <70 triggers rework |
| F8 | Approval gates | P0 | T2/T3 tasks blocked until human approves/rejects with comment |
| F9 | Dashboard | P0 | Goals, task board, status, blockers, approvals queue |
| F10 | Ledger | P0 | Append-only log of every plan, route, review, approval |
| F11 | Memory | P1 | Brand voice, preferences, past outcomes retrievable by Conductor |
| F12 | Integrations (3) | P1 | Google Workspace, Slack, Notion/Linear |
| F13 | Notifications & escalation | P1 | Slack/email on approvals, failures, SLA risk |
| F14 | Metrics page | P1 | Success rate, cycle time, intervention rate, hours saved |
| F15 | Billing | P1 | Stripe subscriptions + run metering |
| F16 | Templates | P1 | 5 starter playbooks (launch, content sprint, outbound, research, weekly report) |
| F17 | Kill switch & budgets | P0 | Per-workspace pause, spend/run caps |
| F18 | Agent-to-agent handoffs | P2 | Specialist can request another with Conductor approval |
| F19 | Marketplace / API | P2 | Third-party specialist spec |

**Out of scope for MVP:** moving money, custom model hosting, mobile app, enterprise SSO.
