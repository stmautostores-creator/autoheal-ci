# 🛠️ AutoHeal CI — Autonomous Pipeline Self-Healing via IBM Bob 2.0

> Transforming broken CI/CD builds into verified, non-breaking pull requests within 60 seconds — with zero human triage.

---

## 📌 Problem Statement
Continuous integration pipelines regularly fail due to asynchronous race conditions, flaky test harnesses, and unintended breaking changes. Developers waste roughly 30% of engineering bandwidth deciphering raw stack traces and diagnosing builds.

## 💡 Solution: AutoHeal CI
AutoHeal CI is an autonomous agentic CI/CD remediator built with **IBM Bob 2.0**.
1. **Pipeline Interception:** Captures failed build logs and git diffs via GitHub Action webhooks.
2. **Bob 2.0 Agentic Diagnosis:** Ingests the entire repository AST to plan, isolate, and patch root causes.
3. **Deterministic Verification:** Tests the patch 3x in isolated local containers to guarantee stability.
4. **Pull Request Dispatch:** Opens an auto-documented PR with embedded IBM Bob Task Session Summaries.

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
npm install
pip install -r requirements.txt