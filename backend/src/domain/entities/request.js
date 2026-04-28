function createRequestEntity({ id, type, authorId, payload, workflow }) {
  if (!id) {
    throw new Error("Request id is required");
  }

  if (!type) {
    throw new Error("Request type is required");
  }

  if (!authorId) {
    throw new Error("Author id is required");
  }

  if (!workflow || !workflow.initialStatus) {
    throw new Error("Workflow with initial status is required");
  }

  return {
    id,
    type,
    authorId,
    payload: payload || {},
    status: workflow.initialStatus,
    history: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

module.exports = {
  createRequestEntity
};
