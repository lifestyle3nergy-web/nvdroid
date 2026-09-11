import { execFileSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
function files(dir) { return readdirSync(dir).flatMap(name => { const p=join(dir,name); return statSync(p).isDirectory() ? files(p) : p.endsWith(".mjs") ? [p] : []; }); }
for (const file of [...files("src"), ...files("tools")]) execFileSync(process.execPath, ["--check", file], {stdio:"inherit"});
process.stdout.write("compile checks passed\n");
