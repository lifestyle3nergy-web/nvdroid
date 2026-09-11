export class InMemoryOperationStore {
  #operations = new Map();

  save(operation) {
    this.#operations.set(operation.operationId, structuredClone(operation));
    return this.get(operation.operationId);
  }

  get(operationId) {
    const value = this.#operations.get(operationId);
    return value ? structuredClone(value) : null;
  }
}

function assertExecutionRequest(request) {
  if (!request?.operationId || typeof request.operationId !== "string") throw new TypeError("operationId must be a non-empty string");
  if (!request?.taskId || typeof request.taskId !== "string") throw new TypeError("taskId must be a non-empty string");
  if (!request?.payloadRef || typeof request.payloadRef !== "string") throw new TypeError("payloadRef must be a non-empty string");
  if (request.idempotent !== true && !request.checkpointRef) throw new TypeError("rotation requires idempotent=true or checkpointRef");
}

export async function executeWithRotation({ request, providerIds, invoke, store = new InMemoryOperationStore(), now = () => new Date().toISOString() }) {
  assertExecutionRequest(request);
  if (!Array.isArray(providerIds) || providerIds.length < 2) throw new TypeError("at least two providerIds are required");
  if (new Set(providerIds).size !== providerIds.length) throw new TypeError("providerIds must be unique");

  const existing = store.get(request.operationId);
  if (existing?.status === "succeeded") return existing;

  const operation = existing ?? {
    operationId: request.operationId,
    taskId: request.taskId,
    status: "pending",
    payloadRef: request.payloadRef,
    checkpointRef: request.checkpointRef ?? null,
    attempts: []
  };

  for (const providerId of providerIds) {
    if (operation.attempts.some(attempt => attempt.providerId === providerId)) continue;
    const attempt = { providerId, startedAt: now(), status: "started" };
    operation.status = "running";
    operation.attempts.push(attempt);
    store.save(operation); // durable boundary before remote execution

    try {
      const result = await invoke({
        providerId,
        taskId: request.taskId,
        payloadRef: request.payloadRef,
        checkpointRef: operation.checkpointRef,
        idempotencyKey: request.operationId
      });
      if (!result?.artifactRef) throw Object.assign(new Error("provider returned no artifactRef"), { retrySafe: false });
      attempt.status = "succeeded";
      attempt.finishedAt = now();
      operation.status = "succeeded";
      operation.selectedProviderId = providerId;
      operation.artifactRef = result.artifactRef;
      operation.checkpointRef = result.checkpointRef ?? operation.checkpointRef;
      return store.save(operation);
    } catch (error) {
      attempt.status = error?.retrySafe === true ? "failed-retryable" : "result-ambiguous";
      attempt.finishedAt = now();
      attempt.reason = error instanceof Error ? error.message : "provider failure";
      operation.status = error?.retrySafe === true ? "rotating" : "reconciliation-required";
      store.save(operation);
      if (error?.retrySafe !== true) return store.get(operation.operationId);
    }
  }

  operation.status = "exhausted";
  return store.save(operation);
}
