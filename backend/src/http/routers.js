const express = require("express");
const { UserController } = require("./controllers/UserController");
const { TicketController } = require("./controllers/TicketController");

/**
 * Создаёт HTTP-роутер приложения
 * @param {Object} dependencies
 * @param {Object} dependencies.userService - Сервис пользователей
 * @param {Object} dependencies.ticketService - Сервис заявок
 * @returns {express.Router}
 */
function createHttpRouter({ userService, ticketService } = {}) {
  const router = express.Router();

  // Инициализация контроллеров
  const userController = new UserController({ userService });
  const ticketController = new TicketController({ ticketService });

  // ─── Health check ───────────────────────────────────────────────────
  router.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "task-flow-manager-backend" });
  });

  // ─── Users ─────────────────────────────────────────────────────────
  router.post("/api/users", userController.create);
  router.get("/api/users", userController.list);
  router.get("/api/users/:id", userController.getById);

  // ─── Tickets ───────────────────────────────────────────────────────
  router.post("/api/tickets", ticketController.create);
  router.get("/api/tickets", ticketController.list);
  router.get("/api/tickets/:id", ticketController.getById);

  // ─── Ticket actions (переходы состояний) ────────────────────────────
  router.post("/api/tickets/:id/submit", ticketController.submit);
  router.post("/api/tickets/:id/forward", ticketController.forward);
  router.post("/api/tickets/:id/rework", ticketController.rework);
  router.post("/api/tickets/:id/approve", ticketController.approve);
  router.post("/api/tickets/:id/reject", ticketController.reject);

  return router;
}

module.exports = { createHttpRouter };