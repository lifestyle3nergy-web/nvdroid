import { access, readFile } from "node:fs/promises";
import { validateConfiguration } from "../src/configuration.mjs";
const paths = ["package.json", "config/policy.json", "config/providers.json", "config/host-profiles.json", "governance/activation-policy.json", "src/policy.mjs"];
for (const path of paths) await access(path);
const [packageJson, policy, providers, hosts, activationPolicy] = await Promise.all(paths.slice(0, 5).map(async path => JSON.parse(await readFile(path, "utf8"))));
validateConfiguration({ packageJson, policy, providers, hosts, activationPolicy });
process.stdout.write("configuration valid\n");
