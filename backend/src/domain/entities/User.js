const { UserRole, isValidUserRole } = require('../value-objects/UserRole');
const { randomUUID } = require('node:crypto');

class User {
  /**
   * @param {Object} data - Данные пользователя
   * @param {string} data.id - Уникальный идентификатор
   * @param {string} data.name - имя пользователя
   * @param {string} data.role - роль пользователя
   */
  constructor(data) {
    if (!data?.id) {
      throw new Error('User id is required');
    }
    if (!data?.name) {
      throw new Error('User name is required');
    }
    if (!isValidUserRole(data?.role)) {
      throw new Error(`Invalid user role: ${data?.role}`);
    }

    this._id = data.id;
    this._name = data.name;
    this._role = data.role;
  }

  static create(data) {
    return new User({
      id: data?.id || randomUUID(),
      name: data?.name,
      role: data?.role
    });
  }

  get id() { return this._id; }
  get name() { return this._name; }
  get role() { return this._role; }

  changeRole(role) {
    if (!isValidUserRole(role)) {
      throw new Error(`Invalid user role: ${role}`);
    }
    this._role = role;
  }

  hasRole(role) {
    return this._role === role;
  }

  isRequester() {
    return this.hasRole(UserRole.REQUESTER);
  }

  isOperator() {
    return this.hasRole(UserRole.OPERATOR);
  }

  isManager() {
    return this.hasRole(UserRole.MANAGER);
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      role: this._role
    };
  }
}

module.exports = { User };