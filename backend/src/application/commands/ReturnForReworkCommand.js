const { TransitionTicketCommand } = require('./TransitionTicketCommand');
const { Action } = require('../../domain/value-objects/Action');

/**
 * Команда возврата заявки на доработку
 */
class ReturnForReworkCommand extends TransitionTicketCommand {
  constructor(params) {
    super(params);
    if (!this.comment || !String(this.comment).trim()) {
      throw new Error('ReturnForReworkCommand: comment is required');
    }
  }

  get action() {
    return Action.RETURN_FOR_REWORK;
  }
}

module.exports = { ReturnForReworkCommand };