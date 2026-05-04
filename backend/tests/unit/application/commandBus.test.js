const { CommandBus } = require('../../../src/application/CommandBus');
const { CreateTicketCommand } = require('../../../src/application/commands/CreateTicketCommand');
const { SubmitTicketCommand } = require('../../../src/application/commands/SubmitTicketCommand');

describe('CommandBus', () => {
  describe('register', () => {
    it('should register a handler for a command type', () => {
      const bus = new CommandBus();
      const handler = { execute: () => {} };
      
      expect(() => bus.register(CreateTicketCommand, handler)).not.toThrow();
    });

    it('should throw if CommandClass is not a function', () => {
      const bus = new CommandBus();
      const handler = { execute: () => {} };
      
      expect(() => bus.register('not-a-class', handler)).toThrow('CommandClass must be a constructor');
    });

    it('should throw if handler has no execute method', () => {
      const bus = new CommandBus();
      
      expect(() => bus.register(CreateTicketCommand, {})).toThrow('handler must have an execute method');
    });

    it('should throw if handler is null', () => {
      const bus = new CommandBus();
      
      expect(() => bus.register(CreateTicketCommand, null)).toThrow('handler must have an execute method');
    });
  });

  describe('dispatch', () => {
    it('should dispatch command to the registered handler', () => {
      const bus = new CommandBus();
      let executedCommand = null;
      const handler = {
        execute: (cmd) => { executedCommand = cmd; return 'result'; }
      };
      bus.register(CreateTicketCommand, handler);

      const command = new CreateTicketCommand({
        type: 'purchase',
        formData: { itemName: 'Test' },
        createdBy: 'user-1'
      });

      const result = bus.dispatch(command);
      expect(result).toBe('result');
      expect(executedCommand).toBe(command);
    });

    it('should throw if no handler registered for command type', () => {
      const bus = new CommandBus();
      const command = new CreateTicketCommand({
        type: 'purchase',
        formData: { itemName: 'Test' },
        createdBy: 'user-1'
      });

      expect(() => bus.dispatch(command)).toThrow('no handler registered');
    });

    it('should dispatch different command types to different handlers', () => {
      const bus = new CommandBus();
      const createResults = [];
      const submitResults = [];

      bus.register(CreateTicketCommand, {
        execute: (cmd) => { createResults.push(cmd); return 'created'; }
      });
      bus.register(SubmitTicketCommand, {
        execute: (cmd) => { submitResults.push(cmd); return 'submitted'; }
      });

      const createCmd = new CreateTicketCommand({
        type: 'purchase',
        formData: { itemName: 'Test' },
        createdBy: 'user-1'
      });
      const submitCmd = new SubmitTicketCommand({
        ticketId: 'ticket-1',
        actorId: 'user-1',
        actorRole: 'requester'
      });

      expect(bus.dispatch(createCmd)).toBe('created');
      expect(bus.dispatch(submitCmd)).toBe('submitted');
      expect(createResults).toHaveLength(1);
      expect(submitResults).toHaveLength(1);
    });
  });

  describe('hasHandler', () => {
    it('should return true if handler is registered', () => {
      const bus = new CommandBus();
      bus.register(CreateTicketCommand, { execute: () => {} });

      expect(bus.hasHandler(CreateTicketCommand)).toBe(true);
    });

    it('should return false if handler is not registered', () => {
      const bus = new CommandBus();

      expect(bus.hasHandler(CreateTicketCommand)).toBe(false);
    });
  });
});