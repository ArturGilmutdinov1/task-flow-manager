const { validateRoleForAction, validateCommentForAction } = require('../../domain/rules/ValidationRules');
const { getNextStatus } = require('../../domain/rules/TransitionRules');
const { TransitionTicketCommand } = require('../commands/TransitionTicketCommand');

/**
 * Обработчик команд перехода заявки
 * Обрабатывает все команды, связанные с изменением статуса заявки:
 * - SubmitTicketCommand (подача на рассмотрение)
 * - ForwardToManagerCommand (передача руководителю)
 * - ReturnForReworkCommand (возврат на доработку)
 * - ApproveTicketCommand (согласование)
 * - RejectTicketCommand (отклонение)
 */
class TransitionTicketCommandHandler {
  /**
   * @param {Object} dependencies
   * @param {Object} dependencies.ticketRepository - Репозиторий заявок
   */
  constructor({ ticketRepository }) {
    if (!ticketRepository) {
      throw new Error('TransitionTicketCommandHandler: ticketRepository is required');
    }
    this._ticketRepository = ticketRepository;
  }

  /**
   * Выполняет команду перехода заявки
   * @param {TransitionTicketCommand} command - Конкретная команда перехода
   * @returns {Ticket} Обновлённая заявка
   * @throws {Error} Если заявка не найдена, переход недопустим или роль не подходит
   */
  execute(command) {
    if (!(command instanceof TransitionTicketCommand)) {
      throw new Error('TransitionTicketCommandHandler: command must be an instance of TransitionTicketCommand');
    }

    // Поиск заявки
    const ticket = this._ticketRepository.findById(command.ticketId);
    if (!ticket) {
      throw new Error(`Ticket with id "${command.ticketId}" not found`);
    }

    const action = command.action;

    // Валидация: может ли роль выполнить данное действие
    validateRoleForAction({ action, actorRole: command.actorRole });

    // Валидация: обязательный комментарий для определённых действий
    validateCommentForAction({ action, comment: command.comment });

    // Валидация: допустим ли переход из текущего статуса
    const nextStatus = getNextStatus({
      ticketType: ticket.type,
      fromStatus: ticket.status,
      action
    });

    // Применение перехода к сущности
    ticket.transition({
      action,
      nextStatus,
      actorId: command.actorId,
      comment: command.comment
    });

    return this._ticketRepository.save(ticket);
  }
}

module.exports = { TransitionTicketCommandHandler };