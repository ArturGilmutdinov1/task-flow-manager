const { Ticket } = require('../domain/entities/Ticket');
const { validateRequiredFields, validateActionContext } = require('../domain/rules/ValidationRules');
const { getNextStatus } = require('../domain/rules/TransitionRules');

class TicketService {
  constructor({ ticketRepository } = {}) {
    if (!ticketRepository) {
      throw new Error('ticketRepository is required');
    }

    this._ticketRepository = ticketRepository;
  }

  createTicket(data) {
    validateRequiredFields({
      ticketType: data?.type,
      formData: data?.formData || {}
    });

    const ticket = Ticket.create(data);
    const existingTicket = this._ticketRepository.findById(ticket.id);
    if (existingTicket) {
      throw new Error(`Ticket with id "${ticket.id}" already exists`);
    }

    return this._ticketRepository.save(ticket);
  }

  transitionTicket({ ticketId, action, actorId, actorRole, comment }) {
    const ticket = this._ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new Error(`Ticket with id "${ticketId}" not found`);
    }

    validateActionContext({ action, actorRole, comment });

    const nextStatus = getNextStatus({
      ticketType: ticket.type,
      fromStatus: ticket.status,
      action
    });

    ticket.transition({
      action,
      nextStatus,
      actorId,
      comment
    });

    return this._ticketRepository.save(ticket);
  }

  getTicketById(id) {
    return this._ticketRepository.findById(id);
  }

  listTickets() {
    return this._ticketRepository.findAll();
  }
}

module.exports = { TicketService };