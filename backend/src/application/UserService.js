const { User } = require('../domain/entities/User');

function normalizeLoginName(name) {
  return String(name ?? '').trim().toLowerCase();
}

class UserService {
  constructor({ userRepository } = {}) {
    if (!userRepository) {
      throw new Error('userRepository is required');
    }

    this._userRepository = userRepository;
  }

  /**
   * Вход по логину (имя) и роли: одна учётная запись на имя (без учёта регистра).
   * Повторный вход с другой ролью обновляет роль у того же пользователя (тот же id).
   * @returns {{ user: User, created: boolean }}
   */
  signIn({ name, role }) {
    const trimmedName = String(name ?? '').trim();
    if (!trimmedName) {
      throw new Error('Name is required');
    }

    const key = normalizeLoginName(trimmedName);
    const existing = this._userRepository
      .findAll()
      .find((u) => normalizeLoginName(u.name) === key);

    if (existing) {
      if (existing.role !== role) {
        existing.changeRole(role);
        this._userRepository.save(existing);
      }
      return { user: existing, created: false };
    }

    const user = User.create({ name: trimmedName, role });
    if (this._userRepository.findById(user.id)) {
      throw new Error(`User with id "${user.id}" already exists`);
    }

    return { user: this._userRepository.save(user), created: true };
  }

  createUser(data) {
    const user = User.create(data);
    const existingUser = this._userRepository.findById(user.id);

    if (existingUser) {
      throw new Error(`User with id "${user.id}" already exists`);
    }

    return this._userRepository.save(user);
  }

  getUserById(id) {
    return this._userRepository.findById(id);
  }

  listUsers() {
    return this._userRepository.findAll();
  }
}

module.exports = { UserService };
