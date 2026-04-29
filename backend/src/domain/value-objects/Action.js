const { TicketStatus } = require('./TicketStatus');

/**
 * Действия, которые можно выполнить над заявкой
 */
const Action = {
  // Создать заявку
  CREATE: 'create',
  // Подать на рассмотрение (из черновика)
  SUBMIT: 'submit',
  // Согласовать (финальное решение)
  APPROVE: 'approve',
  // Отклонить (финальное решение)
  REJECT: 'reject',
  // Вернуть на доработку
  RETURN_FOR_REWORK: 'rework',
  // Передать руководителю
  FORWARD_TO_MANAGER: 'forward'
};

// Какому действию какой статус соответствует
const ActionToStatus = {
  [Action.CREATE]: TicketStatus.DRAFT,
  [Action.SUBMIT]: TicketStatus.PENDING_OPERATOR,
  [Action.APPROVE]: TicketStatus.APPROVED,
  [Action.REJECT]: TicketStatus.REJECTED,
  [Action.RETURN_FOR_REWORK]: TicketStatus.REWORK,
  [Action.FORWARD_TO_MANAGER]: TicketStatus.PENDING_MANAGER
};

// Человекочитаемые названия действий (для кнопок)
const ActionLabels = {
  [Action.CREATE]: 'Создать заявку',
  [Action.SUBMIT]: 'Подать на рассмотрение',
  [Action.APPROVE]: 'Согласовать',
  [Action.REJECT]: 'Отклонить',
  [Action.RETURN_FOR_REWORK]: 'Вернуть на доработку',
  [Action.FORWARD_TO_MANAGER]: 'Передать руководителю'
};

module.exports = {
  Action,
  ActionToStatus,
  ActionLabels
};