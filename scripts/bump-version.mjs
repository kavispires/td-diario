#!/usr/bin/env node
/**
 * Pre-commit helper that bumps `package.json`'s patch version for every
 * commit, unless the version was already changed as part of the commit
 * being made (either by hand or by a previous run of this script).
 *
 * Comparing the staged (index) version against the version already
 * recorded in `HEAD` lets this safely re-run on amends/rebases without
 * double-bumping.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';

/**
 * Reads `package.json`'s `version` field from a given git revision.
 *
 * @param {string} pathSpec - A git revision:path expression, e.g.
 *   `HEAD:package.json` or `:package.json` (the index/staging area).
 * @returns {string | null} The version string, or `null` when the file
 *   doesn't exist at that revision (e.g. the very first commit).
 */
function readVersionAt(pathSpec) {
  try {
    const raw = execSync(`git show ${pathSpec}`, {
      encoding: 'utf8',
    });
    return JSON.parse(raw).version ?? null;
  } catch {
    return null;
  }
}

const headVersion = readVersionAt('HEAD:package.json');
const stagedVersion = readVersionAt(':package.json');

if (headVersion !== null && stagedVersion !== headVersion) {
  // The version was already changed as part of this commit; leave it alone.
  process.exit(0);
}

const packageJson = JSON.parse(
  execSync('git show :package.json', { encoding: 'utf8' }),
);
const versionParts = packageJson.version.split('.').map(Number);

if (versionParts.length !== 3 || versionParts.some(Number.isNaN)) {
  // biome-ignore lint/suspicious/noConsole: CLI script output
  console.warn(
    `bump-version: skipping, "${packageJson.version}" is not a plain semver patch version.`,
  );
  process.exit(0);
}

versionParts[2] += 1;
packageJson.version = versionParts.join('.');

await fs.writeFile('package.json', `${JSON.stringify(packageJson, null, 2)}\n`);

execSync('git add package.json');

// biome-ignore lint/suspicious/noConsole: CLI script output
console.log(`bump-version: bumped package.json to ${packageJson.version}.`);
