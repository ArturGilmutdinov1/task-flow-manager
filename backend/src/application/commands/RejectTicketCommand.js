const { TransitionTicketCommand } = require('./TransitionTicketCommand');
const { Action } = require('../../domain/value-objects/Action');

/**
 * Команда отклонения заявки (финальное решение)
 */
class RejectTicketCommand extends TransitionTicketCommand {
  constructor(params) {
    super(params);
    if (!this.comment || !String(this.comment).trim()) {
      throw new Error('RejectTicketCommand: comment is required');
    }
  }

  get action() {
    return Action.REJECT;
  }
}

module.exports = { RejectTicketCommand };