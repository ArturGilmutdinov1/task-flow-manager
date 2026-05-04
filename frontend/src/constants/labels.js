export const ROLE_LABELS = {
  requester: "Заявитель",
  operator: "Оператор",
  manager: "Руководитель"
};

export const TYPE_LABELS = {
  purchase: "Закупка",
  vacation: "Отпуск"
};

export const STATUS_LABELS = {
  draft: "Черновик",
  pending_operator: "У оператора",
  pending_manager: "У руководителя",
  rework: "На доработке",
  approved: "Согласовано",
  rejected: "Отклонено"
};

/** Значения `action` в истории заявки (как на бэкенде) */
export const ACTION_LABELS = {
  create: "Создание",
  submit: "Подача на рассмотрение",
  approve: "Согласование",
  reject: "Отклонение",
  rework: "Возврат на доработку",
  forward: "Передача руководителю"
};

export function labelRole(role) {
  return ROLE_LABELS[role] || role;
}

export function labelType(type) {
  return TYPE_LABELS[type] || type;
}

export function labelStatus(status) {
  return STATUS_LABELS[status] || status;
}

export function labelAction(action) {
  return ACTION_LABELS[action] || action;
}
