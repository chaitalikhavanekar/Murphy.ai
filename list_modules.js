#!/usr/bin/env node

/**
 * list_modules.js
 *
 * PURPOSE: Print a summary of every module file in 01_knowledge_brain/modules/
 * Shows at a glance: which modules exist, how many concepts/rules/confirmations
 * each has, and their completeness status.
 *
 * USAGE:
 *   node scripts/list_modules.js
 */

const fs   = require("fs");
const path = require("path");

const MODULES_DIR = path.resolve(__dirname, "../01_knowledge_brain/modules");

function statusIcon(status) {
  const icons = { complete: "✓", verified: "★", in_progress: "◑", draft: "○" };
  return icons[status] || "?";
}

function padEnd(str, len) {
  return String(str).padEnd(len);
}

function run() {
  console.log("\n=== Murphy TA Assistant — Knowledge Brain Status ===\n");

  if (!fs.existsSync(MODULES_DIR)) {
    console.log("No modules directory found at:", MODULES_DIR);
    console.log("Create 01_knowledge_brain/modules/ and add module JSON files.\n");
    return;
  }

  const files = fs.readdirSync(MODULES_DIR).filter(f => f.endsWith(".json"));

  if (files.length === 0) {
    console.log("No module files found yet.");
    console.log("Next step: copy the schema template and create your first module.\n");
    return;
  }

  console.log(
    padEnd("Module", 28) +
    padEnd("Concepts", 12) +
    padEnd("Rules", 10) +
    padEnd("Confirms", 12) +
    padEnd("Invalids", 12) +
    padEnd("Status", 14) +
    "Priority"
  );
  console.log("─".repeat(96));

  let totalConcepts = 0, totalRules = 0, totalConfirms = 0, totalInvalids = 0;

  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(MODULES_DIR, file), "utf8"));
      const c  = Array.isArray(data.concepts)        ? data.concepts.length        : "?";
      const r  = Array.isArray(data.reasoning_rules)  ? data.reasoning_rules.length  : "?";
      const cf = Array.isArray(data.confirmations)    ? data.confirmations.length    : "?";
      const iv = Array.isArray(data.invalidations)    ? data.invalidations.length    : "?";
      const st = data.knowledge_metadata?.completeness_status || "draft";
      const pr = data.module?.priority || "—";
      const nm = data.module?.name || file;

      if (typeof c  === "number") totalConcepts  += c;
      if (typeof r  === "number") totalRules     += r;
      if (typeof cf === "number") totalConfirms  += cf;
      if (typeof iv === "number") totalInvalids  += iv;

      console.log(
        padEnd(`${statusIcon(st)} ${nm}`, 28) +
        padEnd(c,  12) +
        padEnd(r,  10) +
        padEnd(cf, 12) +
        padEnd(iv, 12) +
        padEnd(st, 14) +
        pr
      );
    } catch (e) {
      console.log(`  ${file} — ERROR reading file: ${e.message}`);
    }
  }

  console.log("─".repeat(96));
  console.log(
    padEnd(`Total: ${files.length} modules`, 28) +
    padEnd(totalConcepts,  12) +
    padEnd(totalRules,     10) +
    padEnd(totalConfirms,  12) +
    padEnd(totalInvalids,  12)
  );
  console.log("\nLegend: ✓ complete  ★ verified  ◑ in_progress  ○ draft\n");
  console.log("To validate a module: node scripts/validate_module.js 01_knowledge_brain/modules/<name>.json\n");
}

run();
