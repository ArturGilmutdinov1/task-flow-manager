/**
 * Команда создания новой заявки
 */
class CreateTicketCommand {
  /**
   * @param {Object} params
   * @param {string} params.type - Тип заявки (purchase/vacation)
   * @param {Object} params.formData - Данные формы
   * @param {string} params.createdBy - ID заявителя
   */
  constructor({ type, formData, createdBy }) {
    if (!type) {
      throw new Error('CreateTicketCommand: type is required');
    }
    if (!formData || typeof formData !== 'object') {
      throw new Error('CreateTicketCommand: formData is required and must be an object');
    }
    if (!createdBy) {
      throw new Error('CreateTicketCommand: createdBy is required');
    }

    this.type = type;
    this.formData = formData;
    this.createdBy = createdBy;
  }
}

module.exports = { CreateTicketCommand };