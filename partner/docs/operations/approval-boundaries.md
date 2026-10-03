# Approval Boundaries

| Tier | Definition | Examples | Rule |
|---|---|---|---|
| T0 | Internal, reversible, no external effect | Research, drafts, plans | Autonomous |
| T1 | Low-risk, reversible external-facing prep | Scheduling internal meetings, updating tasks | Autonomous + logged |
| T2 | External-facing or costly | Sending email/posts, publishing, spend <$100, code merge | Human approval before action |
| T3 | Irreversible, legal, financial, sensitive data | Contracts, payments, deleting data, spend ≥$100, credentials | Human-only or dual approval |

Rules: unknown → T2. Tier can be raised, never lowered, by Sentinel. Approvals expire after 24h. All decisions logged in the Ledger. Machine-readable version: [`config/policies/approval-policy.yaml`](../../config/policies/approval-policy.yaml).
