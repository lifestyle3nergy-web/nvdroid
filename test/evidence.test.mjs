import test from "node:test";
import assert from "node:assert/strict";
import { deriveEvidenceStatus } from "../tools/create-evidence.mjs";

test("dirty candidates cannot receive review evidence status",()=>assert.equal(
  deriveEvidenceStatus({clean:false, gatesPassed:true}), "NOT_VERIFIED"
));
test("failed gates cannot receive review evidence status",()=>assert.equal(
  deriveEvidenceStatus({clean:true, gatesPassed:false}), "NOT_VERIFIED"
));
