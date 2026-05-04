/**
 * Доменные ошибки приложения
 * Используются для различения бизнес-ошибок от технических
 */
class DomainError extends Error {
  /**
   * @param {string} message - Описание ошибки
   * @param {number} statusCode - HTTP-код ответа
   */
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'DomainError';
    this.statusCode = statusCode;
  }
}

class NotFoundError extends DomainError {
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

class ValidationError extends DomainError {
  constructor(message) {
    super(message, 422);
    this.name = 'ValidationError';
  }
}

class ForbiddenError extends DomainError {
  constructor(message) {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

/**
 * Преобразует доменную ошибку в HTTP-ответ
 * @param {Error} error
 * @param {import('express').Response} res
 */
function handleError(error, res) {
  if (error instanceof DomainError) {
    return res.status(error.statusCode).json({
      error: error.name,
      message: error.message
    });
  }

  // Если ошибка пришла из домена/валидации (не DomainError, но содержит известные сообщения)
  const message = error.message || 'Internal server error';

  // Определяем тип ошибки по содержимому
  if (message.includes('not found')) {
    return res.status(404).json({ error: 'NotFoundError', message });
  }
  if (message.includes('Invalid transition') || message.includes('cannot perform action') || message.includes('forbidden')) {
    return res.status(403).json({ error: 'ForbiddenError', message });
  }
  if (message.includes('required') || message.includes('Missing') || message.includes('Unsupported') || message.includes('Unknown action')) {
    return res.status(422).json({ error: 'ValidationError', message });
  }

  // Неизвестная ошибка
  // eslint-disable-next-line no-console
  console.error('Unhandled error:', error);
  return res.status(500).json({ error: 'InternalServerError', message: 'Internal server error' });
}

module.exports = {
  DomainError,
  NotFoundError,
  ValidationError,
  ForbiddenError,
  handleError
};