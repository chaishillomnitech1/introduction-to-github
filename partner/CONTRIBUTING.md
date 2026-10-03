# Contributing

1. Use the shared vocabulary (Partner, Conductor, Specialists, Sentinel, Gates, Ledger, Memory). Do not introduce synonyms.
2. Docs live in `docs/<area>/`; update `README.md` tables when adding files.
3. New specialists: add `config/agents/<id>.yaml` and a row in the registry table of the operating model.
4. Any change to approval tiers requires update to `config/policies/approval-policy.yaml` and `docs/operations/approval-boundaries.md` in the same PR.
