const { User } = require('../domain/entities/User');

class UserService {
  constructor({ userRepository } = {}) {
    if (!userRepository) {
      throw new Error('userRepository is required');
    }

    this._userRepository = userRepository;
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
