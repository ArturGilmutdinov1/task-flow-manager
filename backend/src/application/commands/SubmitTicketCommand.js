const { TransitionTicketCommand } = require('./TransitionTicketCommand');
const { Action } = require('../../domain/value-objects/Action');

/**
 * Команда подачи заявки на рассмотрение (из черновика/доработки)
 */
class SubmitTicketCommand extends TransitionTicketCommand {
  get action() {
    return Action.SUBMIT;
  }
}

module.exports = { SubmitTicketCommand };