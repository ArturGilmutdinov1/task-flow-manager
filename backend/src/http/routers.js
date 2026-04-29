const express = require("express");

function createHttpRouter({ userService, ticketService } = {}) {
  const router = express.Router();

  router.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "task-flow-manager-backend" });
  });

  router.get("/api/requests", (_req, res) => {
    res.json({
      items: [],
      message: "Requests API skeleton is ready"
    });
  });

  router.get("/api/users", (_req, res) => {
    if (!userService) {
      return res.status(500).json({ message: "UserService is not configured" });
    }

    return res.json({
      items: userService.listUsers().map((user) => user.toJSON())
    });
  });

  router.get("/api/tickets", (_req, res) => {
    if (!ticketService) {
      return res.status(500).json({ message: "TicketService is not configured" });
    }

    return res.json({
      items: ticketService.listTickets().map((ticket) => ticket.toJSON())
    });
  });

  return router;
}

module.exports = {
  createHttpRouter
};
