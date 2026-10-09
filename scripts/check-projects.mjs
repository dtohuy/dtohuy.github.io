#!/usr/bin/env node
// Validates assets/data/projects.json against the pages under projects/.
// Run from anywhere: node scripts/check-projects.mjs
//
// Adding a work:
//   1. Put the page at projects/<id>/index.html
//   2. Add an entry to assets/data/projects.json:
//        id          slug, same as the folder name
//        category    an id from assets/data/categories.json
//        date        YYYY-MM-DD (newest first on the page)
//        title, description   string, or { "zh-Hant", "zh-Hans", "en" }
//        tags        optional list of strings / i18n objects
//        meta        optional short line under the title
//        featured    optional, true pins it to the top
//        url         optional, only for works hosted elsewhere: a full https://
//                    address. No projects/<id>/ folder is needed then.
//   3. Run this script.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const LANGS = ["zh-Hant", "zh-Hans", "en"];
const errors = [];

const readJson = (rel) => {
  try {
    return JSON.parse(readFileSync(join(root, rel), "utf8"));
  } catch (err) {
    errors.push(`${rel}: ${err.message}`);
    return [];
  }
};

// A text field is a non-empty string, or an object with every language filled in
function checkText(where, value, required) {
  if (value == null) {
    if (required) errors.push(`${where}: missing`);
  } else if (typeof value === "string") {
    if (!value.trim()) errors.push(`${where}: empty`);
  } else if (typeof value === "object" && !Array.isArray(value)) {
    LANGS.filter((l) => typeof value[l] !== "string" || !value[l].trim())
      .forEach((l) => errors.push(`${where}: missing "${l}"`));
  } else {
    errors.push(`${where}: must be a string or a language object`);
  }
}

const isDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s)
  && new Date(`${s}T00:00:00Z`).toISOString().startsWith(s);

const isExternalUrl = (s) => {
  try { return typeof s === "string" && new URL(s).protocol === "https:"; } catch { return false; }
};

const categories = readJson("assets/data/categories.json");
const projects = readJson("assets/data/projects.json");

const categoryIds = new Set();
categories.forEach((c, i) => {
  const where = `categories[${i}]${c?.id ? ` (${c.id})` : ""}`;
  if (typeof c?.id !== "string" || !c.id) errors.push(`${where}: missing id`);
  else if (categoryIds.has(c.id)) errors.push(`${where}: duplicate id`);
  else categoryIds.add(c.id);
  checkText(`${where}.label`, c?.label, true);
});

const projectIds = new Set();
projects.forEach((p, i) => {
  const where = `projects[${i}]${p?.id ? ` (${p.id})` : ""}`;
  if (typeof p?.id !== "string" || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.id)) {
    errors.push(`${where}: id must be a lowercase slug like "my-work"`);
  } else if (projectIds.has(p.id)) {
    errors.push(`${where}: duplicate id`);
  } else {
    projectIds.add(p.id);
    if (p.url == null) {
      if (!existsSync(join(root, "projects", p.id, "index.html"))) {
        errors.push(`${where}: projects/${p.id}/index.html not found (or set "url")`);
      }
    } else if (!isExternalUrl(p.url)) {
      errors.push(`${where}: url must be a full https:// address (leave it out for pages in this repo)`);
    }
  }
  if (!categoryIds.has(p?.category)) {
    errors.push(`${where}: category "${p?.category}" is not in categories.json`);
  }
  if (!isDate(p?.date)) errors.push(`${where}: date must be YYYY-MM-DD`);
  checkText(`${where}.title`, p?.title, true);
  checkText(`${where}.description`, p?.description, true);
  checkText(`${where}.meta`, p?.meta, false);
  if (p?.tags != null && !Array.isArray(p.tags)) errors.push(`${where}.tags: must be a list`);
  (Array.isArray(p?.tags) ? p.tags : []).forEach((tag, j) => checkText(`${where}.tags[${j}]`, tag, true));
});

// Every page folder needs a listing, or nobody can find it
const projectsDir = join(root, "projects");
if (existsSync(projectsDir)) {
  readdirSync(projectsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !projectIds.has(d.name))
    .forEach((d) => errors.push(`projects/${d.name}/: no entry in projects.json`));
}

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join("\n"));
  console.error(`\n${errors.length} problem(s) found.`);
  process.exit(1);
}
console.log(`✓ ${projects.length} project(s), ${categories.length} categories — all good.`);
