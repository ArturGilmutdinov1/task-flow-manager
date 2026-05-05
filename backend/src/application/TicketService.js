const { CreateTicketCommand } = require('./commands/CreateTicketCommand');
const { SubmitTicketCommand } = require('./commands/SubmitTicketCommand');
const { ForwardToManagerCommand } = require('./commands/ForwardToManagerCommand');
const { ReturnForReworkCommand } = require('./commands/ReturnForReworkCommand');
const { ApproveTicketCommand } = require('./commands/ApproveTicketCommand');
const { RejectTicketCommand } = require('./commands/RejectTicketCommand');
const { UserRole, TicketsVisibilityByRole } = require('../domain/value-objects/UserRole');
const { TicketStatus } = require('../domain/value-objects/TicketStatus');

/**
 * Сервис управления заявками
 */
class TicketService {
  /**
   * @param {Object} dependencies
   * @param {Object} dependencies.commandBus - Шина команд
   * @param {Object} dependencies.ticketRepository - Репозиторий заявок
   */
  constructor({ commandBus, ticketRepository } = {}) {
    if (!commandBus) {
      throw new Error('TicketService: commandBus is required');
    }
    if (!ticketRepository) {
      throw new Error('TicketService: ticketRepository is required');
    }

    this._commandBus = commandBus;
    this._ticketRepository = ticketRepository;
  }

  // ─── Команды (запись) ─────────────────────────────────────────────

  /**
   * Создаёт новую заявку
   * @param {Object} params
   * @param {string} params.type - Тип заявки
   * @param {Object} params.formData - Данные формы
   * @param {string} params.createdBy - ID заявителя
   * @returns {Ticket}
   */
  createTicket({ type, formData, createdBy }) {
    const command = new CreateTicketCommand({ type, formData, createdBy });
    return this._commandBus.dispatch(command);
  }

  /**
   * Подаёт заявку на рассмотрение (из черновика/доработки)
   * @param {Object} params
   * @param {string} params.ticketId
   * @param {string} params.actorId
   * @param {string} params.actorRole
   * @param {string} [params.comment]
   * @returns {Ticket}
   */
  submitTicket({ ticketId, actorId, actorRole, comment }) {
    const command = new SubmitTicketCommand({ ticketId, actorId, actorRole, comment });
    return this._commandBus.dispatch(command);
  }

  /**
   * Передаёт заявку руководителю на рассмотрение
   * @param {Object} params
   * @param {string} params.ticketId
   * @param {string} params.actorId
   * @param {string} params.actorRole
   * @param {string} [params.comment]
   * @returns {Ticket}
   */
  forwardToManager({ ticketId, actorId, actorRole, comment }) {
    const command = new ForwardToManagerCommand({ ticketId, actorId, actorRole, comment });
    return this._commandBus.dispatch(command);
  }

  /**
   * Возвращает заявку на доработку
   * @param {Object} params
   * @param {string} params.ticketId
   * @param {string} params.actorId
   * @param {string} params.actorRole
   * @param {string} params.comment - Обязательный комментарий
   * @returns {Ticket}
   */
  returnForRework({ ticketId, actorId, actorRole, comment }) {
    const command = new ReturnForReworkCommand({ ticketId, actorId, actorRole, comment });
    return this._commandBus.dispatch(command);
  }

  /**
   * Согласовывает заявку (финальное решение)
   * @param {Object} params
   * @param {string} params.ticketId
   * @param {string} params.actorId
   * @param {string} params.actorRole
   * @param {string} [params.comment]
   * @returns {Ticket}
   */
  approveTicket({ ticketId, actorId, actorRole, comment }) {
    const command = new ApproveTicketCommand({ ticketId, actorId, actorRole, comment });
    return this._commandBus.dispatch(command);
  }

  /**
   * Отклоняет заявку (финальное решение)
   * @param {Object} params
   * @param {string} params.ticketId
   * @param {string} params.actorId
   * @param {string} params.actorRole
   * @param {string} params.comment - Обязательный комментарий
   * @returns {Ticket}
   */
  rejectTicket({ ticketId, actorId, actorRole, comment }) {
    const command = new RejectTicketCommand({ ticketId, actorId, actorRole, comment });
    return this._commandBus.dispatch(command);
  }

  // ─── Запросы (чтение) ─────────────────────────────────────────────

  /**
   * Получает заявку по ID
   * @param {string} id
   * @returns {Ticket|null}
   */
  getTicketById(id) {
    return this._ticketRepository.findById(id);
  }

  /**
   * Возвращает заявки в зависимости от роли пользователя
   * - Заявитель: только свои заявки
   * - Оператор: заявки в статусе pending_operator
   * - Руководитель: заявки в статусе pending_manager
   * 
   * @param {Object} params
   * @param {string} params.userId - ID пользователя
   * @param {string} params.role - Роль пользователя
   * @returns {Ticket[]}
   */
  listTickets({ userId, role } = {}) {
    const allTickets = this._ticketRepository.findAll();

    if (!userId || !role) {
      return allTickets;
    }

    const visibility = TicketsVisibilityByRole[role];
    if (!visibility) {
      return allTickets;
    }

    if (visibility === 'own') {
      return allTickets.filter((ticket) => ticket.createdBy === userId);
    }

    // Для оператора и руководителя — заявки в соответствующем статусе
    if (visibility === 'pending_operator') {
      return allTickets.filter((ticket) => ticket.status === TicketStatus.PENDING_OPERATOR);
    }
    if (visibility === 'pending_manager') {
      return allTickets.filter((ticket) => ticket.status === TicketStatus.PENDING_MANAGER);
    }

    return allTickets;
  }
}

module.exports = { TicketService };