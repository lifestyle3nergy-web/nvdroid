import { access, readFile } from "node:fs/promises";
for (const path of ["package.json", "config/policy.json", "src/policy.mjs"]) await access(path);
const policy = JSON.parse(await readFile("config/policy.json", "utf8"));
if (!Array.isArray(policy.allowedProcessingLocations) || !policy.allowedProcessingLocations.length) throw new Error("allowedProcessingLocations is required");
process.stdout.write("configuration valid\n");
