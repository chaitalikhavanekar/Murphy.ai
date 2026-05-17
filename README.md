# Murphy TA Assistant

**A personal AI Technical Analysis assistant grounded in John J. Murphy's _Technical Analysis of the Financial Markets_.**

This is NOT a trading bot. NOT a signal generator. NOT a prediction engine.

This is an AI reasoning assistant — like a senior technical analyst and market mentor in your pocket. It helps you think through charts with discipline, structure, and Murphy-grounded logic.

---

## What this system does

- Analyzes chart screenshots like a trained technical analyst
- Identifies trend structure, support/resistance, volume behavior, patterns
- Evaluates confirmations and contradictions in a setup
- Assesses risk and explains its reasoning
- Tells you what to monitor next

---

## Project stages

| Stage | Name | Status |
|-------|------|--------|
| Stage 1 | Murphy Knowledge Foundation | 🔵 In progress |
| Stage 2 | RAG Retrieval Layer | ⬜ Not started |
| Stage 3 | Chart Analysis Engine | ⬜ Not started |
| Stage 4 | Full Assistant UI | ⬜ Not started |

**We are currently in Stage 1 only.** Do not jump ahead.

---

## Stage 1 — Knowledge Foundation

The goal of Stage 1 is to convert Murphy's book into structured, machine-readable knowledge that the AI can retrieve and reason with.

### Folder structure

```
murphy-ta-assistant/
│
├── 01_knowledge_brain/
│   ├── schemas/
│   │   └── knowledge_schema_template.json   ← master blueprint (start here)
│   └── modules/
│       ├── trend.json                        ← one file per Murphy module
│       ├── support_resistance.json
│       ├── volume.json
│       ├── chart_patterns.json
│       └── ... (one per module)
│
├── scripts/
│   ├── validate_module.js   ← validates any module against the schema
│   └── list_modules.js      ← shows all modules and their status
│
├── docs/
│   └── (notes, decisions, references)
│
├── package.json
└── README.md
```

### The four files every module produces

Every Murphy topic (trend, volume, patterns, etc.) produces four sections inside its JSON file:

| Section | Purpose |
|---------|---------|
| `concepts` | Every TA concept Murphy defines for this topic |
| `reasoning_rules` | Actionable if-then rules the AI uses to analyze charts |
| `confirmations` | What confirms a signal — and what contradicts it |
| `invalidations` | Exact conditions that break or invalidate a setup |

All four sections live in **one JSON file per module**, following the master schema template.

---

## How to add a new module

1. Copy the template:
   ```bash
   cp 01_knowledge_brain/schemas/knowledge_schema_template.json 01_knowledge_brain/modules/YOUR_MODULE.json
   ```

2. Open the file and fill in your data. Remove all `_comment` fields when done.

3. Validate it:
   ```bash
   node scripts/validate_module.js 01_knowledge_brain/modules/YOUR_MODULE.json
   ```

4. Check the knowledge brain status:
   ```bash
   node scripts/list_modules.js
   ```

---

## Planned modules (Stage 1)

| Module ID | Murphy chapters | Priority |
|-----------|----------------|----------|
| `trend` | Ch. 1, 4 | Critical |
| `support_resistance` | Ch. 4 | Critical |
| `volume` | Ch. 7 | Critical |
| `chart_patterns` | Ch. 5, 6 | High |
| `moving_averages` | Ch. 9 | High |
| `oscillators` | Ch. 10 | High |
| `dow_theory` | Ch. 2 | High |
| `candlesticks` | Ch. 12 | Medium |
| `fibonacci` | Ch. 13 | Medium |
| `elliott_wave` | Ch. 13 | Medium |
| `intermarket` | Ch. 16 | Medium |

---

## Design principles

1. **Murphy-grounded** — every rule, concept, and invalidation must trace back to the book
2. **Explainability first** — the AI must always explain its reasoning, not just output a signal
3. **Modular** — each module is independent and can be loaded/updated separately
4. **No overengineering** — Stage 1 is JSON files and two scripts, nothing more
5. **Step by step** — complete Stage 1 fully before touching Stage 2

---

## Running the scripts

```bash
# Install dependencies (none yet — pure Node.js)
npm install

# List all modules and their status
npm run list

# Validate a specific module file
npm run validate 01_knowledge_brain/modules/trend.json
```

---

## Important rules for this project

- Do NOT build ML models, neural networks, or prediction engines
- Do NOT add live trading, signals, or execution features
- Do NOT skip stages
- Every concept must have a Murphy source reference
- Every rule must have a condition and a signal — no vague statements
- Every invalidation must be specific and measurable

---

_This project is for personal learning and AI-assisted technical analysis. It is not financial advice._
