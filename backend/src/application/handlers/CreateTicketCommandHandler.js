const { Ticket } = require('../../domain/entities/Ticket');
const { validateRequiredFields } = require('../../domain/rules/ValidationRules');
const { CreateTicketCommand } = require('../commands/CreateTicketCommand');

/**
 * Обработчик команды создания заявки
 */
class CreateTicketCommandHandler {
  /**
   * @param {Object} dependencies
   * @param {Object} dependencies.ticketRepository - Репозиторий заявок
   */
  constructor({ ticketRepository }) {
    if (!ticketRepository) {
      throw new Error('CreateTicketCommandHandler: ticketRepository is required');
    }
    this._ticketRepository = ticketRepository;
  }

  /**
   * Выполняет команду создания заявки
   * @param {CreateTicketCommand} command
   * @returns {Ticket} Созданная заявка
   */
  execute(command) {
    if (!(command instanceof CreateTicketCommand)) {
      throw new Error('CreateTicketCommandHandler: command must be an instance of CreateTicketCommand');
    }

    // Валидация обязательных полей формы
    validateRequiredFields({
      ticketType: command.type,
      formData: command.formData
    });

    // Создание сущности заявки
    const ticket = Ticket.create({
      type: command.type,
      formData: command.formData,
      createdBy: command.createdBy
    });

    // Проверка уникальности ID (защита от коллизий)
    const existingTicket = this._ticketRepository.findById(ticket.id);
    if (existingTicket) {
      throw new Error(`Ticket with id "${ticket.id}" already exists`);
    }

    return this._ticketRepository.save(ticket);
  }
}

module.exports = { CreateTicketCommandHandler };