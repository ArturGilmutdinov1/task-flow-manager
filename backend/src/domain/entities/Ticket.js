const { randomUUID } = require('node:crypto');
const { TicketStatus } = require('../value-objects/TicketStatus');

class Ticket {
  /**
   * @param {Object} data - Данные заявки
   * @param {string} data.id - Уникальный идентификатор
   * @param {string} data.type - Тип заявки (purchase/vacation)
   * @param {string} data.status - Текущий статус
   * @param {string} data.createdBy - ID пользователя-заявителя
   * @param {Date} data.createdAt - Дата создания
   * @param {Date} data.updatedAt - Дата последнего обновления
   * @param {Object} data.formData - Данные формы (зависят от типа)
   */
  constructor(data) {
    Ticket.validateRequiredFields(data);

    this._id = data.id;
    this._type = data.type;
    this._status = data.status;
    this._createdBy = data.createdBy;
    this._createdAt = data.createdAt || new Date();
    this._updatedAt = data.updatedAt || new Date();
    this._formData = { ...(data.formData || {}) };
    this._history = Array.isArray(data.history) ? [...data.history] : [];
  }

  static validateRequiredFields(data) { 
    const requiredFields = [
      'id',
      'type',
      'status',
      'createdBy',
      'createdAt',
      'updatedAt'
    ];

    for (const field of requiredFields) {
      if (!data?.[field]) {
        throw new Error(`Ticket ${field} is required`);
      }
    }
  }

  static create(data) {
    return new Ticket({ 
      id: data?.id || randomUUID(),
      type: data?.type,
      status: data?.status || TicketStatus.DRAFT,
      createdBy: data?.createdBy,
      createdAt: data?.createdAt || new Date(),
      updatedAt: data?.updatedAt || new Date(),
      formData: data?.formData || {},
      history: data?.history || []
    });
  }

  transition({ action, nextStatus, actorId, comment }) {
    this._status = nextStatus;
    this._updatedAt = new Date();
    this._history.push({
      actorId,
      action,
      at: this._updatedAt,
      comment: comment || null,
      toStatus: nextStatus
    });
  }

  // Геттеры
  get id() { return this._id; }
  get type() { return this._type; }
  get status() { return this._status; }
  get createdBy() { return this._createdBy; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }
  get formData() { return { ...this._formData }; }
  get history() { return [...this._history]; }

  toJSON() {
    return {
      id: this._id,
      type: this._type,
      status: this._status,
      createdBy: this._createdBy,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      formData: { ...this._formData },
      history: [...this._history]
    };
  }
}

module.exports = { Ticket };