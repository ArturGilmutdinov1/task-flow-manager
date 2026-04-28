const { ROLES } = require("../roles");

const VACATION_STATUSES = {
  DRAFT: "draft",
  ON_REVIEW: "on_review",
  ON_REVIEW_MANAGER: "on_review_manager",
  NEEDS_REWORK: "needs_rework",
  APPROVED: "approved",
  REJECTED: "rejected"
};

const vacationWorkflow = {
  initialStatus: VACATION_STATUSES.DRAFT,
  requiredFields: ["startDate", "endDate", "reason"],
  transitions: [
    {
      from: VACATION_STATUSES.DRAFT,
      action: "submit",
      role: ROLES.APPLICANT,
      to: VACATION_STATUSES.ON_REVIEW
    },
    {
      from: VACATION_STATUSES.ON_REVIEW,
      action: "sendToRework",
      role: ROLES.OPERATOR,
      to: VACATION_STATUSES.NEEDS_REWORK,
      requiresComment: true
    },
    {
      from: VACATION_STATUSES.NEEDS_REWORK,
      action: "submit",
      role: ROLES.APPLICANT,
      to: VACATION_STATUSES.ON_REVIEW
    },
    {
      from: VACATION_STATUSES.ON_REVIEW,
      action: "forwardToManager",
      role: ROLES.OPERATOR,
      to: VACATION_STATUSES.ON_REVIEW_MANAGER
    },
    {
      from: VACATION_STATUSES.ON_REVIEW_MANAGER,
      action: "approve",
      role: ROLES.MANAGER,
      to: VACATION_STATUSES.APPROVED
    },
    {
      from: VACATION_STATUSES.ON_REVIEW_MANAGER,
      action: "reject",
      role: ROLES.MANAGER,
      to: VACATION_STATUSES.REJECTED,
      requiresComment: true
    }
  ]
};

module.exports = {
  VACATION_STATUSES,
  vacationWorkflow
};
