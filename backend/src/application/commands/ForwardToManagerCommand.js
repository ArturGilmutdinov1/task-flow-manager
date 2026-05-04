const { TransitionTicketCommand } = require('./TransitionTicketCommand');
const { Action } = require('../../domain/value-objects/Action');

/**
 * Команда передачи заявки руководителю на рассмотрение
 */
class ForwardToManagerCommand extends TransitionTicketCommand {
  get action() {
    return Action.FORWARD_TO_MANAGER;
  }
}

module.exports = { ForwardToManagerCommand };