import test from "node:test";
import assert from "node:assert/strict";
import { decide } from "../src/policy.mjs";

const policy={criticalBatteryPct:15,criticalEnergyLimit:2,meteredMultiplier:3,allowedProcessingLocations:["device","tenant-cloud"]};
const request={taskId:"t1",requiredCapabilities:["gpu-inference"],maxLatencyMs:500,maxCost:2,batteryPct:50,transport:"wifi",metered:false,humanApproved:false};
const candidate={id:"gpu",capabilities:["gpu-inference"],available:true,consequential:false,processingLocation:"tenant-cloud",latencyMs:100,cost:1,reliability:.99,energyCost:2,networkCost:3,privacyRisk:1,deviceLoad:1};

test("selects an admissible path",()=>assert.equal(decide(request,[candidate],policy).selectedCandidateId,"gpu"));
test("metered state is independent from transport",()=>assert.equal(decide({...request,transport:"wifi",metered:true},[candidate],policy).status,"selected"));
test("rejects latency outside hard constraint",()=>assert.equal(decide({...request,maxLatencyMs:20},[candidate],policy).status,"no-admissible-path"));
test("rejects consequential work without approval",()=>assert.equal(decide(request,[{...candidate,consequential:true}],policy).status,"no-admissible-path"));
test("rejects expensive work on critical battery",()=>assert.equal(decide({...request,batteryPct:5},[{...candidate,energyCost:3}],policy).status,"no-admissible-path"));
test("tie breaking is deterministic",()=>assert.equal(decide(request,[{...candidate,id:"z"},{...candidate,id:"a"}],policy).selectedCandidateId,"a"));
