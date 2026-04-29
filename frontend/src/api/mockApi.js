export class MockApi {
  constructor(state) {
    this.state = state;
  }

  login({ name, role }) {
    const user = {
      id: `u-${Date.now()}`,
      name,
      role
    };
    this.state.currentUser = user;
    return user;
  }

  listTickets() {
    return [...this.state.tickets];
  }

  createTicket({ type, reason }) {
    const ticket = {
      id: `t-${this.state.nextTicketId++}`,
      type,
      status: "draft",
      createdBy: this.state.currentUser?.id,
      formData: { reason }
    };
    this.state.tickets.push(ticket);
    return ticket;
  }

  createDemoTicket() {
    return this.createTicket({
      type: "purchase",
      reason: "Demo item"
    });
  }
}
