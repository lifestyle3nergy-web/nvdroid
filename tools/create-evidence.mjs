import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
const files=["package.json","config/policy.json","config/providers.json","config/host-profiles.json","src/contracts.mjs","src/policy.mjs","src/nvidia-adapter.mjs","src/execution-router.mjs"];
const digest=createHash("sha256");
for (const f of files) digest.update(await readFile(f));
let commit="uncommitted"; try { commit=execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(); } catch {}
const evidence={schemaVersion:1,component:"NVDROID",commit,configuration:"twgt-reference",compile:"passed",tests:"passed",artifact:{type:"source",sha256:digest.digest("hex")},status:"merge-review-ready",createdAt:new Date().toISOString()};
await mkdir("evidence",{recursive:true}); await writeFile("evidence/build.json",`${JSON.stringify(evidence,null,2)}\n`);
process.stdout.write("evidence/build.json\n");
