const { handleError } = require('../errors');

/**
 * Контроллер заявок
 * Обрабатывает HTTP-запросы, связанные с заявками
 */
class TicketController {
  /**
   * @param {Object} dependencies
   * @param {Object} dependencies.ticketService - Сервис заявок
   */
  constructor({ ticketService }) {
    if (!ticketService) {
      throw new Error('TicketController: ticketService is required');
    }
    this._ticketService = ticketService;
  }

  /**
   * POST /api/tickets — Создание заявки
   * Body: { type, formData, createdBy }
   */
  create = (req, res) => {
    try {
      const { type, formData, createdBy } = req.body;
      const ticket = this._ticketService.createTicket({ type, formData, createdBy });
      return res.status(201).json(ticket.toJSON());
    } catch (error) {
      return handleError(error, res);
    }
  };

  /**
   * GET /api/tickets — Список заявок
   * Query: ?userId=...&role=...
   */
  list = (req, res) => {
    try {
      const { userId, role } = req.query;
      const tickets = this._ticketService.listTickets({ userId, role });
      return res.json({ items: tickets.map((t) => t.toJSON()) });
    } catch (error) {
      return handleError(error, res);
    }
  };

  /**
   * GET /api/tickets/:id — Получение заявки по ID
   */
  getById = (req, res) => {
    try {
      const ticket = this._ticketService.getTicketById(req.params.id);
      if (!ticket) {
        return res.status(404).json({ error: 'NotFoundError', message: `Ticket with id "${req.params.id}" not found` });
      }
      return res.json(ticket.toJSON());
    } catch (error) {
      return handleError(error, res);
    }
  };

  /**
   * POST /api/tickets/:id/submit — Подать заявку на рассмотрение
   * Body: { actorId, actorRole, comment? }
   */
  submit = (req, res) => {
    try {
      const { actorId, actorRole, comment } = req.body;
      const ticket = this._ticketService.submitTicket({
        ticketId: req.params.id,
        actorId,
        actorRole,
        comment
      });
      return res.json(ticket.toJSON());
    } catch (error) {
      return handleError(error, res);
    }
  };

  /**
   * POST /api/tickets/:id/forward — Передать руководителю
   * Body: { actorId, actorRole, comment? }
   */
  forward = (req, res) => {
    try {
      const { actorId, actorRole, comment } = req.body;
      const ticket = this._ticketService.forwardToManager({
        ticketId: req.params.id,
        actorId,
        actorRole,
        comment
      });
      return res.json(ticket.toJSON());
    } catch (error) {
      return handleError(error, res);
    }
  };

  /**
   * POST /api/tickets/:id/rework — Вернуть на доработку
   * Body: { actorId, actorRole, comment } (comment обязателен)
   */
  rework = (req, res) => {
    try {
      const { actorId, actorRole, comment } = req.body;
      const ticket = this._ticketService.returnForRework({
        ticketId: req.params.id,
        actorId,
        actorRole,
        comment
      });
      return res.json(ticket.toJSON());
    } catch (error) {
      return handleError(error, res);
    }
  };

  /**
   * POST /api/tickets/:id/approve — Согласовать заявку
   * Body: { actorId, actorRole, comment? }
   */
  approve = (req, res) => {
    try {
      const { actorId, actorRole, comment } = req.body;
      const ticket = this._ticketService.approveTicket({
        ticketId: req.params.id,
        actorId,
        actorRole,
        comment
      });
      return res.json(ticket.toJSON());
    } catch (error) {
      return handleError(error, res);
    }
  };

  /**
   * POST /api/tickets/:id/reject — Отклонить заявку
   * Body: { actorId, actorRole, comment } (comment обязателен)
   */
  reject = (req, res) => {
    try {
      const { actorId, actorRole, comment } = req.body;
      const ticket = this._ticketService.rejectTicket({
        ticketId: req.params.id,
        actorId,
        actorRole,
        comment
      });
      return res.json(ticket.toJSON());
    } catch (error) {
      return handleError(error, res);
    }
  };
}

module.exports = { TicketController };