const { TransitionTicketCommand } = require('./TransitionTicketCommand');
const { Action } = require('../../domain/value-objects/Action');

/**
 * Команда согласования заявки (финальное решение)
 */
class ApproveTicketCommand extends TransitionTicketCommand {
  get action() {
    return Action.APPROVE;
  }
}

module.exports = { ApproveTicketCommand };