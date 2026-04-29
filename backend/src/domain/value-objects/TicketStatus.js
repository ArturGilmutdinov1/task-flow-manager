const TicketStatus = {
  // Начальный статус (черновик)
  DRAFT: 'draft',
  // Заявка на проверке у оператора
  PENDING_OPERATOR: 'pending_operator',
  // Заявка на согласовании у руководителя
  PENDING_MANAGER: 'pending_manager',
  // Заявка отправлена на доработку заявителю
  REWORK: 'rework',
  // Заявка согласована (финальный статус)
  APPROVED: 'approved',
  // Заявка отклонена (финальный статус)
  REJECTED: 'rejected'
};

// Статусы, после которых заявку нельзя изменить
const TerminalStatuses = [
  TicketStatus.APPROVED,
  TicketStatus.REJECTED
];

// Статусы, в которых заявка активна (ждёт действий)
const ActiveStatuses = [
  TicketStatus.PENDING_OPERATOR,
  TicketStatus.PENDING_MANAGER,
  TicketStatus.REWORK
];

module.exports = {
  TicketStatus,
  TerminalStatuses,
  ActiveStatuses
};