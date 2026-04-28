const { ROLES } = require("../roles");

const PURCHASE_STATUSES = {
  DRAFT: "draft",
  ON_REVIEW: "on_review",
  ON_REVIEW_MANAGER: "on_review_manager",
  NEEDS_REWORK: "needs_rework",
  APPROVED: "approved",
  REJECTED: "rejected"
};

const purchaseWorkflow = {
  initialStatus: PURCHASE_STATUSES.DRAFT,
  requiredFields: ["title", "justification", "estimatedCost"],
  transitions: [
    {
      from: PURCHASE_STATUSES.DRAFT,
      action: "submit",
      role: ROLES.APPLICANT,
      to: PURCHASE_STATUSES.ON_REVIEW
    },
    {
      from: PURCHASE_STATUSES.ON_REVIEW,
      action: "sendToRework",
      role: ROLES.OPERATOR,
      to: PURCHASE_STATUSES.NEEDS_REWORK,
      requiresComment: true
    },
    {
      from: PURCHASE_STATUSES.NEEDS_REWORK,
      action: "submit",
      role: ROLES.APPLICANT,
      to: PURCHASE_STATUSES.ON_REVIEW
    },
    {
      from: PURCHASE_STATUSES.ON_REVIEW,
      action: "forwardToManager",
      role: ROLES.OPERATOR,
      to: PURCHASE_STATUSES.ON_REVIEW_MANAGER
    },
    {
      from: PURCHASE_STATUSES.ON_REVIEW_MANAGER,
      action: "approve",
      role: ROLES.MANAGER,
      to: PURCHASE_STATUSES.APPROVED
    },
    {
      from: PURCHASE_STATUSES.ON_REVIEW_MANAGER,
      action: "reject",
      role: ROLES.MANAGER,
      to: PURCHASE_STATUSES.REJECTED,
      requiresComment: true
    }
  ]
};

module.exports = {
  PURCHASE_STATUSES,
  purchaseWorkflow
};
const { ROLES } = require("../roles");

const PURCHASE_STATUSES = {
  DRAFT: "draft",
  ON_REVIEW: "on_review",
  ON_REVIEW_MANAGER: "on_review_manager",
  NEEDS_REWORK: "needs_rework",
  APPROVED: "approved",
  REJECTED: "rejected"
};

const purchaseWorkflow = {
  initialStatus: PURCHASE_STATUSES.DRAFT,
  requiredFields: ["title", "justification", "estimatedCost"],
  transitions: [
    {
      from: PURCHASE_STATUSES.DRAFT,
      action: "submit",
      role: ROLES.APPLICANT,
      to: PURCHASE_STATUSES.ON_REVIEW
    },
    {
      from: PURCHASE_STATUSES.ON_REVIEW,
      action: "sendToRework",
      role: ROLES.OPERATOR,
      to: PURCHASE_STATUSES.NEEDS_REWORK,
      requiresComment: true
    },
    {
      from: PURCHASE_STATUSES.NEEDS_REWORK,
      action: "submit",
      role: ROLES.APPLICANT,
      to: PURCHASE_STATUSES.ON_REVIEW
    },
    {
      from: PURCHASE_STATUSES.ON_REVIEW,
      action: "forwardToManager",
      role: ROLES.OPERATOR,
      to: PURCHASE_STATUSES.ON_REVIEW_MANAGER
    },
    {
      from: PURCHASE_STATUSES.ON_REVIEW_MANAGER,
      action: "approve",
      role: ROLES.MANAGER,
      to: PURCHASE_STATUSES.APPROVED
    },
    {
      from: PURCHASE_STATUSES.ON_REVIEW_MANAGER,
      action: "reject",
      role: ROLES.MANAGER,
      to: PURCHASE_STATUSES.REJECTED,
      requiresComment: true
    }
  ]
};

module.exports = {
  PURCHASE_STATUSES,
  purchaseWorkflow
};
