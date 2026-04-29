class InMemoryUserRepository {
  constructor() {
    this._users = new Map();
  }

  save(user) {
    this._users.set(user.id, user);
    return user;
  }

  findById(id) {
    return this._users.get(id) || null;
  }

  findAll() {
    return Array.from(this._users.values());
  }
}

module.exports = { InMemoryUserRepository };
