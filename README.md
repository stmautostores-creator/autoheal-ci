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
```

### 2. Set Environment Variables
Create a `.env` file or export these in your shell before starting the listener:

```bash
export GITHUB_TOKEN=<your_github_pat>
export AUTOHEAL_API_KEY=<your_webhook_secret>
export IBM_BOB_API_KEY=<your_ibm_bob_api_key>
# Optional — defaults to IBM Bob production endpoint
export IBM_BOB_ENDPOINT=https://api.bob.ibm.com/v2/agent/session
```

### 3. Start the Listener
```bash
python listener.py
```
The FastAPI server starts on `http://0.0.0.0:8000`.

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Liveness check |
| `/webhook/autoheal` | POST | CI failure ingestion entry point |

### 4. Run Tests
```bash
# Run the intentionally broken test suite (demonstrates the bug)
npm test

# Run the healed test suite (remediated by IBM Bob 2.0)
npx jest tests/sessionService.healed.test.js --runInBand
```

---

## 🏗️ Architecture

```
GitHub Actions CI
      │
      │  POST /webhook/autoheal
      ▼
┌─────────────────────┐
│   listener.py       │  FastAPI webhook receiver
│   (port 8000)       │
└────────┬────────────┘
         │
         ▼  Background task
┌─────────────────────┐
│ remediation_pipeline│
│  1. Clone repo      │
│  2. IBM Bob Agent   │  run_ibm_bob_agent()
│  3. Sandbox verify  │  run_sandbox_tests() × 3
│  4. Commit & push   │
│  5. Open PR         │  open_github_pull_request()
└─────────────────────┘
```

---

## 📁 Project Structure

```
autoheal-ci/
├── listener.py                        # FastAPI orchestrator (main entry point)
├── src/
│   └── sessionService.js              # Source under test — async session lifecycle
├── tests/
│   ├── sessionService.test.js         # Original failing test (race condition bug)
│   └── sessionService.healed.test.js  # Remediated test suite (IBM Bob 2.0 output)
├── .github/workflows/ci.yml           # CI pipeline + AutoHeal webhook trigger
├── requirements.txt                   # Python dependencies
└── package.json                       # Node.js dependencies & test script
```

---

## 🔐 Security Notes

- All secrets must be provided via environment variables — no defaults are hardcoded.
- The `/webhook/autoheal` endpoint requires a valid `X-AutoHeal-Key` header matching `AUTOHEAL_API_KEY`.
- `GITHUB_TOKEN` is used only for cloning private repos and opening PRs. If not set, the pipeline commits locally without pushing.

---

## 🧪 How the Demo Works

1. The broken test in `tests/sessionService.test.js` is missing `await` on an async call, causing a race condition failure.
2. GitHub Actions detects the failure and POSTs the failure log + git diff to the AutoHeal listener.
3. `run_ibm_bob_agent()` locates the defect and patches the `await` keyword into the call site.
4. `run_sandbox_tests()` runs Jest 3 consecutive times to confirm deterministic stability.
5. A PR is opened against the failing branch with a full IBM Bob 2.0 Task Session Summary embedded in the description.
