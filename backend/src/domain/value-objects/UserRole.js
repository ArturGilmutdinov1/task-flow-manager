/**
 * Роли пользователей в системе
 * От роли зависит, какие действия доступны
 */
const UserRole = {
  // Заявитель — создаёт заявки
  REQUESTER: 'requester',
  
  // Оператор — проверяет и направляет
  OPERATOR: 'operator',
  
  // Руководитель — принимает финальное решение
  MANAGER: 'manager'
};

const USER_ROLES = Object.values(UserRole);

// Человекочитаемые названия (для UI)
const UserRoleLabels = {
  [UserRole.REQUESTER]: 'Заявитель',
  [UserRole.OPERATOR]: 'Оператор',
  [UserRole.MANAGER]: 'Руководитель'
};

// Какие роли могут видеть какие заявки
const TicketsVisibilityByRole = {
  [UserRole.REQUESTER]: 'own',      // только свои
  [UserRole.OPERATOR]: 'pending_operator',  // требующие оператора
  [UserRole.MANAGER]: 'pending_manager'     // требующие руководителя
};

function isValidUserRole(role) {
  return USER_ROLES.includes(role);
}

module.exports = {
  UserRole,
  USER_ROLES,
  isValidUserRole,
  UserRoleLabels,
  TicketsVisibilityByRole
};