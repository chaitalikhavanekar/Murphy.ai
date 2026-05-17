#!/usr/bin/env node

/**
 * validate_module.js
 *
 * PURPOSE: Check that any module JSON file follows the knowledge_schema_template.
 * Run this every time you create or edit a module file.
 *
 * HOW IT WORKS:
 *   - Reads a module JSON file
 *   - Checks all required top-level keys exist
 *   - Checks each section (concepts, reasoning_rules, confirmations, invalidations)
 *     has the required fields per item
 *   - Reports missing fields clearly so you know exactly what to fix
 *
 * USAGE:
 *   node scripts/validate_module.js 01_knowledge_brain/modules/trend.json
 */

const fs = require("fs");
const path = require("path");

const REQUIRED_TOP_KEYS = ["module", "concepts", "reasoning_rules", "confirmations", "invalidations", "knowledge_metadata"];

const REQUIRED_CONCEPT_FIELDS = ["id", "name", "definition", "murphy_context", "module", "importance"];
const REQUIRED_RULE_FIELDS    = ["id", "rule", "condition", "signal", "importance", "source_concept_ids"];
const REQUIRED_CONFIRM_FIELDS = ["id", "pattern", "confirmed_by", "contradicted_by", "source_concept_ids"];
const REQUIRED_INVALID_FIELDS = ["id", "concept_id", "invalidated_when", "severity", "what_to_monitor", "action_on_invalidation"];

const VALID_IMPORTANCE  = ["critical", "high", "medium", "low"];
const VALID_SIGNALS     = ["bullish", "bearish", "neutral", "warning", "confirmation"];
const VALID_SEVERITY    = ["critical", "major", "minor"];
const VALID_COMPLETENESS = ["draft", "in_progress", "complete", "verified"];

function validate(filePath) {
  console.log(`\n=== Murphy TA Assistant — Module Validator ===`);
  console.log(`Validating: ${filePath}\n`);

  if (!fs.existsSync(filePath)) {
    console.error(`ERROR: File not found: ${filePath}`);
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    console.error(`ERROR: Invalid JSON — ${e.message}`);
    process.exit(1);
  }

  const errors   = [];
  const warnings = [];

  // 1. Top-level keys
  for (const key of REQUIRED_TOP_KEYS) {
    if (!(key in data)) errors.push(`Missing top-level key: "${key}"`);
  }

  // 2. Module block
  if (data.module) {
    if (!data.module.id)   errors.push(`module.id is missing`);
    if (!data.module.name) errors.push(`module.name is missing`);
    if (!data.module.priority || !VALID_IMPORTANCE.includes(data.module.priority))
      warnings.push(`module.priority should be one of: ${VALID_IMPORTANCE.join(", ")}`);
  }

  // 3. Concepts
  if (Array.isArray(data.concepts)) {
    if (data.concepts.length === 0) warnings.push(`concepts array is empty`);
    data.concepts.forEach((item, i) => {
      for (const f of REQUIRED_CONCEPT_FIELDS) {
        if (!item[f]) errors.push(`concepts[${i}] ("${item.id || "?"}") missing field: "${f}"`);
      }
      if (item.importance && !VALID_IMPORTANCE.includes(item.importance))
        errors.push(`concepts[${i}] importance must be one of: ${VALID_IMPORTANCE.join(", ")}`);
    });
  } else {
    errors.push(`"concepts" must be an array`);
  }

  // 4. Reasoning rules
  if (Array.isArray(data.reasoning_rules)) {
    if (data.reasoning_rules.length === 0) warnings.push(`reasoning_rules array is empty`);
    data.reasoning_rules.forEach((item, i) => {
      for (const f of REQUIRED_RULE_FIELDS) {
        if (!item[f]) errors.push(`reasoning_rules[${i}] ("${item.id || "?"}") missing field: "${f}"`);
      }
      if (item.signal && !VALID_SIGNALS.includes(item.signal))
        errors.push(`reasoning_rules[${i}] signal must be one of: ${VALID_SIGNALS.join(", ")}`);
      if (item.importance && !VALID_IMPORTANCE.includes(item.importance))
        errors.push(`reasoning_rules[${i}] importance must be one of: ${VALID_IMPORTANCE.join(", ")}`);
    });
  } else {
    errors.push(`"reasoning_rules" must be an array`);
  }

  // 5. Confirmations
  if (Array.isArray(data.confirmations)) {
    data.confirmations.forEach((item, i) => {
      for (const f of REQUIRED_CONFIRM_FIELDS) {
        if (!item[f]) errors.push(`confirmations[${i}] ("${item.id || "?"}") missing field: "${f}"`);
      }
      if (!Array.isArray(item.confirmed_by))
        errors.push(`confirmations[${i}] confirmed_by must be an array`);
    });
  } else {
    errors.push(`"confirmations" must be an array`);
  }

  // 6. Invalidations
  if (Array.isArray(data.invalidations)) {
    if (data.invalidations.length === 0) warnings.push(`invalidations array is empty`);
    data.invalidations.forEach((item, i) => {
      for (const f of REQUIRED_INVALID_FIELDS) {
        if (!item[f]) errors.push(`invalidations[${i}] ("${item.id || "?"}") missing field: "${f}"`);
      }
      if (item.severity && !VALID_SEVERITY.includes(item.severity))
        errors.push(`invalidations[${i}] severity must be one of: ${VALID_SEVERITY.join(", ")}`);
    });
  } else {
    errors.push(`"invalidations" must be an array`);
  }

  // 7. Metadata
  if (data.knowledge_metadata) {
    const m = data.knowledge_metadata;
    if (m.completeness_status && !VALID_COMPLETENESS.includes(m.completeness_status))
      warnings.push(`knowledge_metadata.completeness_status should be one of: ${VALID_COMPLETENESS.join(", ")}`);
    if (m.total_concepts === 0 && Array.isArray(data.concepts) && data.concepts.length > 0)
      warnings.push(`knowledge_metadata.total_concepts is 0 but concepts array has entries — update the count`);
  }

  // Report
  if (errors.length === 0 && warnings.length === 0) {
    console.log(`✓ VALID — No errors, no warnings.\n`);
    console.log(`  Module:       ${data.module?.name}`);
    console.log(`  Concepts:     ${data.concepts?.length ?? 0}`);
    console.log(`  Rules:        ${data.reasoning_rules?.length ?? 0}`);
    console.log(`  Confirmations:${data.confirmations?.length ?? 0}`);
    console.log(`  Invalidations:${data.invalidations?.length ?? 0}`);
  } else {
    if (errors.length > 0) {
      console.log(`✗ ERRORS (${errors.length}) — Fix these before using this module:\n`);
      errors.forEach(e => console.log(`  [ERROR] ${e}`));
    }
    if (warnings.length > 0) {
      console.log(`\n⚠ WARNINGS (${warnings.length}) — Should fix these:\n`);
      warnings.forEach(w => console.log(`  [WARN]  ${w}`));
    }
  }

  console.log("\n=== End of validation ===\n");
  if (errors.length > 0) process.exit(1);
}

const target = process.argv[2];
if (!target) {
  console.error("Usage: node scripts/validate_module.js <path-to-module.json>");
  process.exit(1);
}

validate(path.resolve(target));
