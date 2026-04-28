const { REQUEST_TYPES } = require("../requestTypes");
const { purchaseWorkflow } = require("./purchaseWorkflow");
const { vacationWorkflow } = require("./vacationWorkflow");

const workflowByType = {
  [REQUEST_TYPES.PURCHASE]: purchaseWorkflow,
  [REQUEST_TYPES.VACATION]: vacationWorkflow
};

function getWorkflowByType(type) {
  const workflow = workflowByType[type];

  if (!workflow) {
    throw new Error(`Unsupported request type: ${type}`);
  }

  return workflow;
}

module.exports = {
  workflowByType,
  getWorkflowByType
};
