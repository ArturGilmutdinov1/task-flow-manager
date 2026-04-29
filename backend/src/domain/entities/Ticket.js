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
    this._id = data.id;
    this._type = data.type;
    this._status = data.status;
    this._createdBy = data.createdBy;
    this._createdAt = data.createdAt || new Date();
    this._updatedAt = data.updatedAt || new Date();
    this._formData = { ...(data.formData || {}) };
  }

  // Геттеры
  get id() { return this._id; }
  get type() { return this._type; }
  get status() { return this._status; }
  get createdBy() { return this._createdBy; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }
  get formData() { return { ...this._formData }; }
}