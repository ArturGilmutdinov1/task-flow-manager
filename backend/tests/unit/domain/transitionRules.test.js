const { getNextStatus, canTransition, getTransitionsForType } = require('../../../src/domain/rules/TransitionRules');
const { TicketType } = require('../../../src/domain/value-objects/TicketType');
const { TicketStatus } = require('../../../src/domain/value-objects/TicketStatus');
const { Action } = require('../../../src/domain/value-objects/Action');

describe('TransitionRules', () => {
  describe('getNextStatus', () => {
    // ─── Закупка: допустимые переходы ─────────────────────────────────

    describe('Purchase: valid transitions', () => {
      it('should transition from DRAFT to PENDING_OPERATOR on SUBMIT', () => {
        const result = getNextStatus({
          ticketType: TicketType.PURCHASE,
          fromStatus: TicketStatus.DRAFT,
          action: Action.SUBMIT
        });
        expect(result).toBe(TicketStatus.PENDING_OPERATOR);
      });

      it('should transition from PENDING_OPERATOR to PENDING_MANAGER on FORWARD_TO_MANAGER', () => {
        const result = getNextStatus({
          ticketType: TicketType.PURCHASE,
          fromStatus: TicketStatus.PENDING_OPERATOR,
          action: Action.FORWARD_TO_MANAGER
        });
        expect(result).toBe(TicketStatus.PENDING_MANAGER);
      });

      it('should transition from PENDING_OPERATOR to REWORK on RETURN_FOR_REWORK', () => {
        const result = getNextStatus({
          ticketType: TicketType.PURCHASE,
          fromStatus: TicketStatus.PENDING_OPERATOR,
          action: Action.RETURN_FOR_REWORK
        });
        expect(result).toBe(TicketStatus.REWORK);
      });

      it('should transition from PENDING_MANAGER to APPROVED on APPROVE', () => {
        const result = getNextStatus({
          ticketType: TicketType.PURCHASE,
          fromStatus: TicketStatus.PENDING_MANAGER,
          action: Action.APPROVE
        });
        expect(result).toBe(TicketStatus.APPROVED);
      });

      it('should transition from PENDING_MANAGER to REJECTED on REJECT', () => {
        const result = getNextStatus({
          ticketType: TicketType.PURCHASE,
          fromStatus: TicketStatus.PENDING_MANAGER,
          action: Action.REJECT
        });
        expect(result).toBe(TicketStatus.REJECTED);
      });

      it('should transition from REWORK to PENDING_OPERATOR on SUBMIT', () => {
        const result = getNextStatus({
          ticketType: TicketType.PURCHASE,
          fromStatus: TicketStatus.REWORK,
          action: Action.SUBMIT
        });
        expect(result).toBe(TicketStatus.PENDING_OPERATOR);
      });
    });

    // ─── Отпуск: допустимые переходы ──────────────────────────────────

    describe('Vacation: valid transitions', () => {
      it('should transition from DRAFT to PENDING_OPERATOR on SUBMIT', () => {
        const result = getNextStatus({
          ticketType: TicketType.VACATION,
          fromStatus: TicketStatus.DRAFT,
          action: Action.SUBMIT
        });
        expect(result).toBe(TicketStatus.PENDING_OPERATOR);
      });

      it('should transition from PENDING_OPERATOR to PENDING_MANAGER on FORWARD_TO_MANAGER', () => {
        const result = getNextStatus({
          ticketType: TicketType.VACATION,
          fromStatus: TicketStatus.PENDING_OPERATOR,
          action: Action.FORWARD_TO_MANAGER
        });
        expect(result).toBe(TicketStatus.PENDING_MANAGER);
      });

      it('should transition from REWORK to PENDING_OPERATOR on SUBMIT', () => {
        const result = getNextStatus({
          ticketType: TicketType.VACATION,
          fromStatus: TicketStatus.REWORK,
          action: Action.SUBMIT
        });
        expect(result).toBe(TicketStatus.PENDING_OPERATOR);
      });
    });

    // ─── Недопустимые переходы ────────────────────────────────────────

    describe('Invalid transitions', () => {
      it('should throw on SUBMIT from PENDING_OPERATOR', () => {
        expect(() =>
          getNextStatus({
            ticketType: TicketType.PURCHASE,
            fromStatus: TicketStatus.PENDING_OPERATOR,
            action: Action.SUBMIT
          })
        ).toThrow('Invalid transition');
      });

      it('should throw on APPROVE from DRAFT', () => {
        expect(() =>
          getNextStatus({
            ticketType: TicketType.PURCHASE,
            fromStatus: TicketStatus.DRAFT,
            action: Action.APPROVE
          })
        ).toThrow('Invalid transition');
      });

      it('should throw on REJECT from PENDING_OPERATOR', () => {
        expect(() =>
          getNextStatus({
            ticketType: TicketType.PURCHASE,
            fromStatus: TicketStatus.PENDING_OPERATOR,
            action: Action.REJECT
          })
        ).toThrow('Invalid transition');
      });

      it('should throw on FORWARD_TO_MANAGER from DRAFT', () => {
        expect(() =>
          getNextStatus({
            ticketType: TicketType.VACATION,
            fromStatus: TicketStatus.DRAFT,
            action: Action.FORWARD_TO_MANAGER
          })
        ).toThrow('Invalid transition');
      });

      it('should throw on transition from terminal status APPROVED', () => {
        expect(() =>
          getNextStatus({
            ticketType: TicketType.PURCHASE,
            fromStatus: TicketStatus.APPROVED,
            action: Action.SUBMIT
          })
        ).toThrow('terminal status');
      });

      it('should throw on transition from terminal status REJECTED', () => {
        expect(() =>
          getNextStatus({
            ticketType: TicketType.PURCHASE,
            fromStatus: TicketStatus.REJECTED,
            action: Action.SUBMIT
          })
        ).toThrow('terminal status');
      });

      it('should throw for unsupported ticket type', () => {
        expect(() =>
          getNextStatus({
            ticketType: 'unknown_type',
            fromStatus: TicketStatus.DRAFT,
            action: Action.SUBMIT
          })
        ).toThrow('Unsupported ticket type');
      });
    });
  });

  describe('canTransition', () => {
    it('should return true for valid transition', () => {
      expect(
        canTransition({
          ticketType: TicketType.PURCHASE,
          fromStatus: TicketStatus.DRAFT,
          action: Action.SUBMIT
        })
      ).toBe(true);
    });

    it('should return false for invalid transition', () => {
      expect(
        canTransition({
          ticketType: TicketType.PURCHASE,
          fromStatus: TicketStatus.DRAFT,
          action: Action.APPROVE
        })
      ).toBe(false);
    });

    it('should return false for terminal status', () => {
      expect(
        canTransition({
          ticketType: TicketType.PURCHASE,
          fromStatus: TicketStatus.APPROVED,
          action: Action.SUBMIT
        })
      ).toBe(false);
    });
  });

  describe('getTransitionsForType', () => {
    it('should return transitions for purchase type', () => {
      const transitions = getTransitionsForType(TicketType.PURCHASE);
      expect(transitions).toBeDefined();
      expect(transitions[TicketStatus.DRAFT]).toBeDefined();
    });

    it('should return transitions for vacation type', () => {
      const transitions = getTransitionsForType(TicketType.VACATION);
      expect(transitions).toBeDefined();
      expect(transitions[TicketStatus.DRAFT]).toBeDefined();
    });

    it('should return null for unknown type', () => {
      const transitions = getTransitionsForType('unknown');
      expect(transitions).toBeNull();
    });
  });
});