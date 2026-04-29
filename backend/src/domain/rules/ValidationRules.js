const { UserRole } = require('../value-objects/UserRole');
const { Action } = require('../value-objects/Action');
const { RequiredFieldsByType } = require('../value-objects/TicketType');

const ACTION_ROLES = {
  [Action.SUBMIT]: [UserRole.REQUESTER],
  [Action.FORWARD_TO_MANAGER]: [UserRole.OPERATOR],
  [Action.RETURN_FOR_REWORK]: [UserRole.OPERATOR],
  [Action.APPROVE]: [UserRole.MANAGER],
  [Action.REJECT]: [UserRole.MANAGER]
};

function validateRoleForAction({ action, actorRole }) {
  const allowedRoles = ACTION_ROLES[action];
  if (!allowedRoles) {
    throw new Error(`Unknown action: ${action}`);
  }
  if (!allowedRoles.includes(actorRole)) {
    throw new Error(`Role "${actorRole}" cannot perform action "${action}"`);
  }
}

function validateCommentForAction({ action, comment }) {
  const actionsRequiringComment = [Action.RETURN_FOR_REWORK, Action.REJECT];
  if (!actionsRequiringComment.includes(action)) {
    return;
  }

  if (!comment || !String(comment).trim()) {
    throw new Error(`Comment is required for action "${action}"`);
  }
}

function validateRequiredFields({ ticketType, formData }) {
  const requiredFields = RequiredFieldsByType[ticketType];

  if (!requiredFields) {
    throw new Error(`Unsupported ticket type: ${ticketType}`);
  }

  const missingFields = requiredFields.filter((field) => {
    const value = formData?.[field];
    return value === undefined || value === null || value === '';
  });

  if (missingFields.length > 0) {
    throw new Error(
      `Missing required fields for "${ticketType}": ${missingFields.join(', ')}`
    );
  }
}

function validateActionContext({ action, actorRole, comment }) {
  validateRoleForAction({ action, actorRole });
  validateCommentForAction({ action, comment });
}

module.exports = {
  ACTION_ROLES,
  validateRoleForAction,
  validateCommentForAction,
  validateRequiredFields,
  validateActionContext
};
