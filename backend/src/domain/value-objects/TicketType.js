/**
* Типы заявок
 * Определяет набор полей и маршрут согласования
 */
const TicketType = {
  // Закупка оборудования или ПО
  PURCHASE: 'purchase',
  
  // Заявление на отпуск
  VACATION: 'vacation'
};

// Человекочитаемые названия (для UI)
const TicketTypeLabels = {
  [TicketType.PURCHASE]: 'Закупка',
  [TicketType.VACATION]: 'Отпуск'
};

// Какие поля обязательны для каждого типа
const RequiredFieldsByType = {
  [TicketType.PURCHASE]: ['itemName', 'quantity', 'price', 'reason'],
  [TicketType.VACATION]: ['startDate', 'endDate', 'reason']
};

// Подписи полей для формы (для UI)
const FieldLabels = {
  itemName: 'Наименование товара',
  quantity: 'Количество',
  price: 'Цена',
  reason: 'Причина/Обоснование',
  startDate: 'Дата начала',
  endDate: 'Дата окончания'
};

module.exports = {
  TicketType,
  TicketTypeLabels,
  RequiredFieldsByType,
  FieldLabels
};