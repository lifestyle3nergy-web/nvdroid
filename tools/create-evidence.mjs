import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const GATES = [["configure", ["run", "configure"]], ["compile", ["run", "compile"]], ["tests", ["test"]]];

export function deriveEvidenceStatus({ clean, gatesPassed }) {
  return clean && gatesPassed ? "REVIEW_EVIDENCE" : "NOT_VERIFIED";
}

function run(command, args, options = {}) {
  return execFileSync(command, args, { encoding: "utf8", ...options }).trim();
}

async function sourceDigest() {
  const files = run("git", ["ls-files", "-z"]).split("\0").filter(Boolean).sort();
  const digest = createHash("sha256");
  for (const path of files) {
    digest.update(`${path}\0`);
    digest.update(await readFile(path));
    digest.update("\0");
  }
  return { algorithm: "sha256", value: digest.digest("hex"), fileCount: files.length };
}

export async function createEvidence() {
  const gates = {};
  for (const [name, args] of GATES) {
    execFileSync("npm", args, { stdio: "inherit" });
    gates[name] = { status: "PASS", command: `npm ${args.join(" ")}` };
  }
  const commit = run("git", ["rev-parse", "HEAD"]);
  const clean = run("git", ["status", "--porcelain"]).length === 0;
  const evidence = {
    schemaVersion: 2,
    component: "NVDROID",
    commit,
    activation: { state: "FROZEN", automaticDeployment: false },
    workingTree: clean ? "CLEAN" : "DIRTY",
    gates,
    artifact: { type: "tracked-source", ...(await sourceDigest()) },
    status: deriveEvidenceStatus({ clean, gatesPassed: true }),
    createdAt: new Date().toISOString()
  };
  await mkdir("evidence", { recursive: true });
  await writeFile("evidence/build.json", `${JSON.stringify(evidence, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(evidence, null, 2)}\n`);
  return evidence;
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) await createEvidence();
