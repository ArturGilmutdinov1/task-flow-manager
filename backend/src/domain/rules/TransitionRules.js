const { TicketType } = require('../value-objects/TicketType');
const { TicketStatus, TerminalStatuses } = require('../value-objects/TicketStatus');
const { Action } = require('../value-objects/Action');

const TRANSITIONS_BY_TYPE = {
  [TicketType.PURCHASE]: {
    [TicketStatus.DRAFT]: {
      [Action.SUBMIT]: TicketStatus.PENDING_OPERATOR
    },
    [TicketStatus.PENDING_OPERATOR]: {
      [Action.FORWARD_TO_MANAGER]: TicketStatus.PENDING_MANAGER,
      [Action.RETURN_FOR_REWORK]: TicketStatus.REWORK
    },
    [TicketStatus.PENDING_MANAGER]: {
      [Action.APPROVE]: TicketStatus.APPROVED,
      [Action.REJECT]: TicketStatus.REJECTED
    },
    [TicketStatus.REWORK]: {
      [Action.SUBMIT]: TicketStatus.PENDING_OPERATOR
    }
  },
  [TicketType.VACATION]: {
    [TicketStatus.DRAFT]: {
      [Action.SUBMIT]: TicketStatus.PENDING_OPERATOR
    },
    [TicketStatus.PENDING_OPERATOR]: {
      [Action.FORWARD_TO_MANAGER]: TicketStatus.PENDING_MANAGER,
      [Action.RETURN_FOR_REWORK]: TicketStatus.REWORK
    },
    [TicketStatus.PENDING_MANAGER]: {
      [Action.APPROVE]: TicketStatus.APPROVED,
      [Action.REJECT]: TicketStatus.REJECTED
    },
    [TicketStatus.REWORK]: {
      [Action.SUBMIT]: TicketStatus.PENDING_OPERATOR
    }
  }
};

function getTransitionsForType(ticketType) {
  return TRANSITIONS_BY_TYPE[ticketType] || null;
}

function getNextStatus({ ticketType, fromStatus, action }) {
  const typeTransitions = getTransitionsForType(ticketType);

  if (!typeTransitions) {
    throw new Error(`Unsupported ticket type: ${ticketType}`);
  }
  if (TerminalStatuses.includes(fromStatus)) {
    throw new Error(`Transition from terminal status is forbidden: ${fromStatus}`);
  }

  const nextStatus = typeTransitions[fromStatus]?.[action];
  if (!nextStatus) {
    throw new Error(
      `Invalid transition: type=${ticketType}, from=${fromStatus}, action=${action}`
    );
  }

  return nextStatus;
}

function canTransition(params) {
  try {
    getNextStatus(params);
    return true;
  } catch (_error) {
    return false;
  }
}

module.exports = {
  TRANSITIONS_BY_TYPE,
  getTransitionsForType,
  getNextStatus,
  canTransition
};
