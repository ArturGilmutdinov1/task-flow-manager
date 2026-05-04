const { handleError } = require('../errors');

/**
 * Контроллер пользователей
 * Обрабатывает HTTP-запросы, связанные с пользователями
 */
class UserController {
  /**
   * @param {Object} dependencies
   * @param {Object} dependencies.userService - Сервис пользователей
   */
  constructor({ userService }) {
    if (!userService) {
      throw new Error('UserController: userService is required');
    }
    this._userService = userService;
  }

  /**
   * POST /api/users — Создание пользователя
   */
  create = (req, res) => {
    try {
      const { name, role } = req.body;
      const { user, created } = this._userService.signIn({ name, role });
      return res.status(created ? 201 : 200).json(user.toJSON());
    } catch (error) {
      return handleError(error, res);
    }
  };

  /**
   * GET /api/users — Список пользователей
   */
  list = (_req, res) => {
    try {
      const users = this._userService.listUsers();
      return res.json({ items: users.map((u) => u.toJSON()) });
    } catch (error) {
      return handleError(error, res);
    }
  };

  /**
   * GET /api/users/:id — Получение пользователя по ID
   */
  getById = (req, res) => {
    try {
      const user = this._userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'NotFoundError', message: `User with id "${req.params.id}" not found` });
      }
      return res.json(user.toJSON());
    } catch (error) {
      return handleError(error, res);
    }
  };
}

module.exports = { UserController };