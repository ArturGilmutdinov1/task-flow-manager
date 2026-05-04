const express = require("express");
const { createHttpRouter } = require("./http/routers");
const { UserService } = require("./application/UserService");
const { TicketService } = require("./application/TicketService");
const { CommandBus } = require("./application/CommandBus");
const { CreateTicketCommandHandler } = require("./application/handlers/CreateTicketCommandHandler");
const { TransitionTicketCommandHandler } = require("./application/handlers/TransitionTicketCommandHandler");
const { InMemoryUserRepository } = require("./infrastructure/repositories/InMemoryUserRepository");
const { InMemoryTicketRepository } = require("./infrastructure/repositories/InMemoryTicketRepository");
const { CreateTicketCommand } = require("./application/commands/CreateTicketCommand");
const { SubmitTicketCommand } = require("./application/commands/SubmitTicketCommand");
const { ForwardToManagerCommand } = require("./application/commands/ForwardToManagerCommand");
const { ReturnForReworkCommand } = require("./application/commands/ReturnForReworkCommand");
const { ApproveTicketCommand } = require("./application/commands/ApproveTicketCommand");
const { RejectTicketCommand } = require("./application/commands/RejectTicketCommand");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Инфраструктура ─────────────────────────────────────────────────
const userRepository = new InMemoryUserRepository();
const ticketRepository = new InMemoryTicketRepository();

// ─── Шина команд ────────────────────────────────────────────────────
const commandBus = new CommandBus();

// Регистрация обработчиков
const createTicketHandler = new CreateTicketCommandHandler({ ticketRepository });
const transitionTicketHandler = new TransitionTicketCommandHandler({ ticketRepository });

commandBus.register(CreateTicketCommand, createTicketHandler);
commandBus.register(SubmitTicketCommand, transitionTicketHandler);
commandBus.register(ForwardToManagerCommand, transitionTicketHandler);
commandBus.register(ReturnForReworkCommand, transitionTicketHandler);
commandBus.register(ApproveTicketCommand, transitionTicketHandler);
commandBus.register(RejectTicketCommand, transitionTicketHandler);

// ─── Сервисы приложений ─────────────────────────────────────────────
const userService = new UserService({ userRepository });
const ticketService = new TicketService({ commandBus, ticketRepository });

// ─── HTTP ───────────────────────────────────────────────────────────
app.use(express.json());
app.use(createHttpRouter({ userService, ticketService }));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend is running on http://localhost:${PORT}`);
});

module.exports = { app };