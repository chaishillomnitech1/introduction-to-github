#!/usr/bin/env python3
"""Reference router: scores specialists and applies the approval policy.
Run: python3 examples/router.py  (no dependencies)."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent

def load_specialists():
    out = []
    for line in (ROOT / "config/agents/registry.yaml").read_text().splitlines():
        if line.strip().startswith("- {id:"):
            body = line.strip()[3:-1]
            sid = re.search(r"id: (\w+)", body).group(1)
            skills = re.search(r"skills: \[(.*?)\]", body).group(1).split(", ")
            cost = int(re.search(r"cost: (\d)", body).group(1))
            out.append({"id": sid, "skills": skills, "cost": cost})
    return out

HISTORY = {}  # specialist id -> success rate; default 0.8
T2_ACTIONS = {"send_email", "publish", "merge_code"}
T3_ACTIONS = {"payment", "sign_contract", "delete_data"}

def tier(action):
    if action in T3_ACTIONS: return "T3"
    if action in T2_ACTIONS: return "T2"
    if action in {"research", "draft", "plan", "analyze"}: return "T0"
    return "T2"  # fail closed

def route(task, specialists):
    best = None
    for s in specialists:
        match = len(set(task["skills"]) & set(s["skills"])) / len(task["skills"])
        if match == 0: continue
        score = 0.45*match + 0.25*HISTORY.get(s["id"], 0.8) + 0.15*(1 - s["cost"]/5) + 0.15*1.0
        if best is None or score > best[1]: best = (s["id"], score)
    return best

if __name__ == "__main__":
    specs = load_specialists()
    tasks = [
        {"name": "Competitor brief", "skills": ["research"], "action": "research"},
        {"name": "Launch email", "skills": ["copywriting"], "action": "send_email"},
        {"name": "Pay vendor invoice", "skills": ["finance"], "action": "payment"},
        {"name": "Weekly KPI report", "skills": ["reporting", "kpi"], "action": "analyze"},
    ]
    for t in tasks:
        sid, score = route(t, specs)
        tr = tier(t["action"])
        gate = {"T0": "autonomous", "T1": "autonomous", "T2": "HUMAN APPROVAL", "T3": "DUAL APPROVAL"}[tr]
        print(f"{t['name']:<22} -> {sid:<10} score={score:.2f} tier={tr} [{gate}]")
