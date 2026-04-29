const express = require("express");
const { createHttpRouter } = require("./http/routers");
const { UserService } = require("./application/UserService");
const { TicketService } = require("./application/TicketService");
const { InMemoryUserRepository } = require("./infrastructure/repositories/InMemoryUserRepository");
const { InMemoryTicketRepository } = require("./infrastructure/repositories/inMemoryTicketRepository");

const app = express();
const PORT = process.env.PORT || 3000;
const userRepository = new InMemoryUserRepository();
const ticketRepository = new InMemoryTicketRepository();
const userService = new UserService({ userRepository });
const ticketService = new TicketService({ ticketRepository });

app.use(express.json());
app.use(createHttpRouter({ userService, ticketService }));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend is running on http://localhost:${PORT}`);
});
