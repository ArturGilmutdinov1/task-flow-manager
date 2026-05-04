/**
 * Базовая команда перехода заявки
 */
class TransitionTicketCommand {
  /**
   * @param {Object} params
   * @param {string} params.ticketId - ID заявки
   * @param {string} params.actorId - ID пользователя, выполняющего действие
   * @param {string} params.actorRole - Роль пользователя
   * @param {string} [params.comment] - Комментарий к действию
   */
  constructor({ ticketId, actorId, actorRole, comment } = {}) {
    if (!ticketId) {
      throw new Error('TransitionTicketCommand: ticketId is required');
    }
    if (!actorId) {
      throw new Error('TransitionTicketCommand: actorId is required');
    }
    if (!actorRole) {
      throw new Error('TransitionTicketCommand: actorRole is required');
    }

    this.ticketId = ticketId;
    this.actorId = actorId;
    this.actorRole = actorRole;
    this.comment = comment || null;
  }

  /**
   * Возвращает действие, которое выполняет эта команда
   * Должно быть переопределено в подклассах
   */
  get action() {
    throw new Error('TransitionTicketCommand: action getter must be overridden');
  }
}

module.exports = { TransitionTicketCommand };