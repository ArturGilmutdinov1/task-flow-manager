function validateTransition({ workflow, currentStatus, action, role, comment }) {
  if (!workflow || !Array.isArray(workflow.transitions)) {
    throw new Error("Workflow is not configured");
  }

  const transition = workflow.transitions.find(
    (item) => item.from === currentStatus && item.action === action && item.role === role
  );

  if (!transition) {
    throw new Error("Transition is not allowed for current status, role and action");
  }

  if (transition.requiresComment && (!comment || !comment.trim())) {
    throw new Error("Comment is required for this action");
  }

  return {
    nextStatus: transition.to
  };
}

module.exports = {
  validateTransition
};
