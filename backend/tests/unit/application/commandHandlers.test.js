const { CreateTicketCommandHandler } = require('../../../src/application/handlers/CreateTicketCommandHandler');
const { TransitionTicketCommandHandler } = require('../../../src/application/handlers/TransitionTicketCommandHandler');
const { CreateTicketCommand } = require('../../../src/application/commands/CreateTicketCommand');
const { SubmitTicketCommand } = require('../../../src/application/commands/SubmitTicketCommand');
const { ForwardToManagerCommand } = require('../../../src/application/commands/ForwardToManagerCommand');
const { ReturnForReworkCommand } = require('../../../src/application/commands/ReturnForReworkCommand');
const { ApproveTicketCommand } = require('../../../src/application/commands/ApproveTicketCommand');
const { RejectTicketCommand } = require('../../../src/application/commands/RejectTicketCommand');
const { InMemoryTicketRepository } = require('../../../src/infrastructure/repositories/inMemoryTicketRepository');
const { TicketStatus } = require('../../../src/domain/value-objects/TicketStatus');
const { UserRole } = require('../../../src/domain/value-objects/UserRole');

/**
 * Мок-репозиторий с предзагруженной заявкой для тестов переходов
 */
function createRepositoryWithTicket(ticketOverrides = {}) {
  const repo = new InMemoryTicketRepository();
  const handler = new CreateTicketCommandHandler({ ticketRepository: repo });

  const ticket = handler.execute(new CreateTicketCommand({
    type: 'purchase',
    formData: { itemName: 'Laptop', quantity: 2, price: 50000, reason: 'New hire' },
    createdBy: 'user-1',
    ...ticketOverrides
  }));

  return { repo, ticket, handler };
}

describe('CreateTicketCommandHandler', () => {
  let handler;
  let repo;

  beforeEach(() => {
    repo = new InMemoryTicketRepository();
    handler = new CreateTicketCommandHandler({ ticketRepository: repo });
  });

  it('should create a ticket with valid data', () => {
    const command = new CreateTicketCommand({
      type: 'purchase',
      formData: { itemName: 'Laptop', quantity: 2, price: 50000, reason: 'New hire' },
      createdBy: 'user-1'
    });

    const ticket = handler.execute(command);

    expect(ticket.id).toBeDefined();
    expect(ticket.type).toBe('purchase');
    expect(ticket.status).toBe(TicketStatus.DRAFT);
    expect(ticket.createdBy).toBe('user-1');
    expect(ticket.formData.itemName).toBe('Laptop');
  });

  it('should create a vacation ticket', () => {
    const command = new CreateTicketCommand({
      type: 'vacation',
      formData: { startDate: '2024-06-01', endDate: '2024-06-14', reason: 'Vacation' },
      createdBy: 'user-2'
    });

    const ticket = handler.execute(command);

    expect(ticket.type).toBe('vacation');
    expect(ticket.status).toBe(TicketStatus.DRAFT);
  });

  it('should throw for missing required fields', () => {
    const command = new CreateTicketCommand({
      type: 'purchase',
      formData: { itemName: 'Laptop' }, // missing quantity, price, reason
      createdBy: 'user-1'
    });

    expect(() => handler.execute(command)).toThrow('Missing required fields');
  });

  it('should throw for wrong command type', () => {
    expect(() => handler.execute({})).toThrow('instance of CreateTicketCommand');
  });
});

describe('TransitionTicketCommandHandler', () => {
  let repo;
  let handler;
  let ticket;

  beforeEach(() => {
    const setup = createRepositoryWithTicket();
    repo = setup.repo;
    ticket = setup.ticket;
    handler = new TransitionTicketCommandHandler({ ticketRepository: repo });
  });

  // ─── Полный цикл: создание → подача → передача → согласование ──────

  describe('Full happy path: purchase ticket', () => {
    it('should complete full approval cycle', () => {
      // Submit
      const submitted = handler.execute(new SubmitTicketCommand({
        ticketId: ticket.id,
        actorId: 'user-1',
        actorRole: UserRole.REQUESTER
      }));
      expect(submitted.status).toBe(TicketStatus.PENDING_OPERATOR);

      // Forward to manager
      const forwarded = handler.execute(new ForwardToManagerCommand({
        ticketId: ticket.id,
        actorId: 'operator-1',
        actorRole: UserRole.OPERATOR
      }));
      expect(forwarded.status).toBe(TicketStatus.PENDING_MANAGER);

      // Approve
      const approved = handler.execute(new ApproveTicketCommand({
        ticketId: ticket.id,
        actorId: 'manager-1',
        actorRole: UserRole.MANAGER
      }));
      expect(approved.status).toBe(TicketStatus.APPROVED);
    });

    it('should complete full rejection cycle', () => {
      // Submit
      handler.execute(new SubmitTicketCommand({
        ticketId: ticket.id,
        actorId: 'user-1',
        actorRole: UserRole.REQUESTER
      }));

      // Forward
      handler.execute(new ForwardToManagerCommand({
        ticketId: ticket.id,
        actorId: 'operator-1',
        actorRole: UserRole.OPERATOR
      }));

      // Reject
      const rejected = handler.execute(new RejectTicketCommand({
        ticketId: ticket.id,
        actorId: 'manager-1',
        actorRole: UserRole.MANAGER,
        comment: 'Budget constraints'
      }));
      expect(rejected.status).toBe(TicketStatus.REJECTED);
    });
  });

  // ─── Цикл с доработкой ─────────────────────────────────────────────

  describe('Rework cycle', () => {
    it('should return ticket for rework and resubmit', () => {
      // Submit
      handler.execute(new SubmitTicketCommand({
        ticketId: ticket.id,
        actorId: 'user-1',
        actorRole: UserRole.REQUESTER
      }));

      // Return for rework
      const reworked = handler.execute(new ReturnForReworkCommand({
        ticketId: ticket.id,
        actorId: 'operator-1',
        actorRole: UserRole.OPERATOR,
        comment: 'Missing justification'
      }));
      expect(reworked.status).toBe(TicketStatus.REWORK);

      // Resubmit
      const resubmitted = handler.execute(new SubmitTicketCommand({
        ticketId: ticket.id,
        actorId: 'user-1',
        actorRole: UserRole.REQUESTER
      }));
      expect(resubmitted.status).toBe(TicketStatus.PENDING_OPERATOR);
    });
  });

  // ─── Ошибки валидации ──────────────────────────────────────────────

  describe('Validation errors', () => {
    it('should throw when wrong role performs action', () => {
      expect(() =>
        handler.execute(new ApproveTicketCommand({
          ticketId: ticket.id,
          actorId: 'user-1',
          actorRole: UserRole.REQUESTER
        }))
      ).toThrow('cannot perform action');
    });

    it('should throw when operator tries to approve', () => {
      expect(() =>
        handler.execute(new ApproveTicketCommand({
          ticketId: ticket.id,
          actorId: 'operator-1',
          actorRole: UserRole.OPERATOR
        }))
      ).toThrow('cannot perform action');
    });

    it('should throw when trying invalid transition from DRAFT', () => {
      expect(() =>
        handler.execute(new ForwardToManagerCommand({
          ticketId: ticket.id,
          actorId: 'operator-1',
          actorRole: UserRole.OPERATOR
        }))
      ).toThrow('Invalid transition');
    });

    it('should throw when trying to reject without comment', () => {
      // First submit and forward
      handler.execute(new SubmitTicketCommand({
        ticketId: ticket.id,
        actorId: 'user-1',
        actorRole: UserRole.REQUESTER
      }));
      handler.execute(new ForwardToManagerCommand({
        ticketId: ticket.id,
        actorId: 'operator-1',
        actorRole: UserRole.OPERATOR
      }));

      // Try reject without comment - RejectTicketCommand requires comment in constructor
      expect(() =>
        new RejectTicketCommand({
          ticketId: ticket.id,
          actorId: 'manager-1',
          actorRole: UserRole.MANAGER,
          comment: ''
        })
      ).toThrow('comment is required');
    });

    it('should throw for non-existent ticket', () => {
      expect(() =>
        handler.execute(new SubmitTicketCommand({
          ticketId: 'non-existent-id',
          actorId: 'user-1',
          actorRole: UserRole.REQUESTER
        }))
      ).toThrow('not found');
    });

    it('should throw for wrong command type', () => {
      expect(() => handler.execute({})).toThrow('instance of TransitionTicketCommand');
    });
  });

  // ─── Терминальные статусы ──────────────────────────────────────────

  describe('Terminal statuses', () => {
    it('should not allow transitions from APPROVED status', () => {
      // Submit → Forward → Approve
      handler.execute(new SubmitTicketCommand({
        ticketId: ticket.id,
        actorId: 'user-1',
        actorRole: UserRole.REQUESTER
      }));
      handler.execute(new ForwardToManagerCommand({
        ticketId: ticket.id,
        actorId: 'operator-1',
        actorRole: UserRole.OPERATOR
      }));
      handler.execute(new ApproveTicketCommand({
        ticketId: ticket.id,
        actorId: 'manager-1',
        actorRole: UserRole.MANAGER
      }));

      // Try to submit approved ticket
      expect(() =>
        handler.execute(new SubmitTicketCommand({
          ticketId: ticket.id,
          actorId: 'user-1',
          actorRole: UserRole.REQUESTER
        }))
      ).toThrow('terminal status');
    });

    it('should not allow transitions from REJECTED status', () => {
      // Submit → Forward → Reject
      handler.execute(new SubmitTicketCommand({
        ticketId: ticket.id,
        actorId: 'user-1',
        actorRole: UserRole.REQUESTER
      }));
      handler.execute(new ForwardToManagerCommand({
        ticketId: ticket.id,
        actorId: 'operator-1',
        actorRole: UserRole.OPERATOR
      }));
      handler.execute(new RejectTicketCommand({
        ticketId: ticket.id,
        actorId: 'manager-1',
        actorRole: UserRole.MANAGER,
        comment: 'Denied'
      }));

      // Try to submit rejected ticket
      expect(() =>
        handler.execute(new SubmitTicketCommand({
          ticketId: ticket.id,
          actorId: 'user-1',
          actorRole: UserRole.REQUESTER
        }))
      ).toThrow('terminal status');
    });
  });

  // ─── История переходов ─────────────────────────────────────────────

  describe('History tracking', () => {
    it('should record history entries for each transition', () => {
      // Submit
      handler.execute(new SubmitTicketCommand({
        ticketId: ticket.id,
        actorId: 'user-1',
        actorRole: UserRole.REQUESTER,
        comment: 'Ready for review'
      }));

      const updated = repo.findById(ticket.id);
      expect(updated.history).toHaveLength(1);
      expect(updated.history[0].actorId).toBe('user-1');
      expect(updated.history[0].action).toBe('submit');
      expect(updated.history[0].toStatus).toBe(TicketStatus.PENDING_OPERATOR);
      expect(updated.history[0].comment).toBe('Ready for review');
    });

    it('should accumulate history across multiple transitions', () => {
      handler.execute(new SubmitTicketCommand({
        ticketId: ticket.id,
        actorId: 'user-1',
        actorRole: UserRole.REQUESTER
      }));
      handler.execute(new ForwardToManagerCommand({
        ticketId: ticket.id,
        actorId: 'operator-1',
        actorRole: UserRole.OPERATOR
      }));

      const updated = repo.findById(ticket.id);
      expect(updated.history).toHaveLength(2);
      expect(updated.history[0].action).toBe('submit');
      expect(updated.history[1].action).toBe('forward');
    });
  });
});