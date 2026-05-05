const { CreateTicketCommand } = require('./commands/CreateTicketCommand');
const { TransitionTicketCommand } = require('./commands/TransitionTicketCommand');

/**
 * Шина команд (Command Bus)
 */
class CommandBus {
  constructor() {
    /** @type {Map<Function, Object>} Map: CommandConstructor → Handler */
    this._handlers = new Map();
  }

  /**
   * Регистрирует обработчик для определённого типа команды
   * @param {Function} CommandClass - Конструктор команды
   * @param {Object} handler - Обработчик с методом execute()
   */
  register(CommandClass, handler) {
    if (!CommandClass || typeof CommandClass !== 'function') {
      throw new Error('CommandBus: CommandClass must be a constructor');
    }
    if (!handler || typeof handler.execute !== 'function') {
      throw new Error('CommandBus: handler must have an execute method');
    }

    this._handlers.set(CommandClass, handler);
  }

  /**
   * Отправляет команду на выполнение соответствующему обработчику
   * @param {Object} command - Экземпляр команды
   * @returns {*} Результат выполнения команды
   * @throws {Error} Если команда неизвестного типа или обработчик не зарегистрирован
   */
  dispatch(command) {
    const CommandClass = command.constructor;
    const handler = this._handlers.get(CommandClass);

    if (!handler) {
      throw new Error(
        `CommandBus: no handler registered for ${CommandClass.name || 'UnknownCommand'}`
      );
    }

    return handler.execute(command);
  }

  /**
   * Проверяет, зарегистрирован ли обработчик для данного типа команды
   * @param {Function} CommandClass - Конструктор команды
   * @returns {boolean}
   */
  hasHandler(CommandClass) {
    return this._handlers.has(CommandClass);
  }
}

module.exports = { CommandBus };