class InMemoryTicketRepository {
    constructor() {
        this._tickets = new Map();
    }

    save(ticket) {
        this._tickets.set(ticket.id, ticket);
        return ticket;
    }

    findById(id) {
        return this._tickets.get(id) || null;
    }

    findAll() {
        return Array.from(this._tickets.values());
    }
}

module.exports = { InMemoryTicketRepository };