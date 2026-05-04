const {
  validateRoleForAction,
  validateCommentForAction,
  validateRequiredFields,
  validateActionContext
} = require('../../../src/domain/rules/ValidationRules');
const { UserRole } = require('../../../src/domain/value-objects/UserRole');
const { Action } = require('../../../src/domain/value-objects/Action');
const { TicketType } = require('../../../src/domain/value-objects/TicketType');

describe('ValidationRules', () => {
  describe('validateRoleForAction', () => {
    it('should allow REQUESTER to SUBMIT', () => {
      expect(() =>
        validateRoleForAction({ action: Action.SUBMIT, actorRole: UserRole.REQUESTER })
      ).not.toThrow();
    });

    it('should allow OPERATOR to FORWARD_TO_MANAGER', () => {
      expect(() =>
        validateRoleForAction({ action: Action.FORWARD_TO_MANAGER, actorRole: UserRole.OPERATOR })
      ).not.toThrow();
    });

    it('should allow OPERATOR to RETURN_FOR_REWORK', () => {
      expect(() =>
        validateRoleForAction({ action: Action.RETURN_FOR_REWORK, actorRole: UserRole.OPERATOR })
      ).not.toThrow();
    });

    it('should allow MANAGER to APPROVE', () => {
      expect(() =>
        validateRoleForAction({ action: Action.APPROVE, actorRole: UserRole.MANAGER })
      ).not.toThrow();
    });

    it('should allow MANAGER to REJECT', () => {
      expect(() =>
        validateRoleForAction({ action: Action.REJECT, actorRole: UserRole.MANAGER })
      ).not.toThrow();
    });

    it('should deny REQUESTER from APPROVE', () => {
      expect(() =>
        validateRoleForAction({ action: Action.APPROVE, actorRole: UserRole.REQUESTER })
      ).toThrow('cannot perform action');
    });

    it('should deny REQUESTER from REJECT', () => {
      expect(() =>
        validateRoleForAction({ action: Action.REJECT, actorRole: UserRole.REQUESTER })
      ).toThrow('cannot perform action');
    });

    it('should deny OPERATOR from APPROVE', () => {
      expect(() =>
        validateRoleForAction({ action: Action.APPROVE, actorRole: UserRole.OPERATOR })
      ).toThrow('cannot perform action');
    });

    it('should deny MANAGER from SUBMIT', () => {
      expect(() =>
        validateRoleForAction({ action: Action.SUBMIT, actorRole: UserRole.MANAGER })
      ).toThrow('cannot perform action');
    });

    it('should throw for unknown action', () => {
      expect(() =>
        validateRoleForAction({ action: 'unknown_action', actorRole: UserRole.REQUESTER })
      ).toThrow('Unknown action');
    });
  });

  describe('validateCommentForAction', () => {
    it('should pass for REWORK with comment', () => {
      expect(() =>
        validateCommentForAction({ action: Action.RETURN_FOR_REWORK, comment: 'Needs revision' })
      ).not.toThrow();
    });

    it('should pass for REJECT with comment', () => {
      expect(() =>
        validateCommentForAction({ action: Action.REJECT, comment: 'Not approved' })
      ).not.toThrow();
    });

    it('should throw for REWORK without comment', () => {
      expect(() =>
        validateCommentForAction({ action: Action.RETURN_FOR_REWORK, comment: '' })
      ).toThrow('Comment is required');
    });

    it('should throw for REJECT without comment', () => {
      expect(() =>
        validateCommentForAction({ action: Action.REJECT, comment: null })
      ).toThrow('Comment is required');
    });

    it('should pass for SUBMIT without comment', () => {
      expect(() =>
        validateCommentForAction({ action: Action.SUBMIT, comment: null })
      ).not.toThrow();
    });

    it('should pass for APPROVE without comment', () => {
      expect(() =>
        validateCommentForAction({ action: Action.APPROVE, comment: null })
      ).not.toThrow();
    });
  });

  describe('validateRequiredFields', () => {
    it('should pass for PURCHASE with all fields', () => {
      expect(() =>
        validateRequiredFields({
          ticketType: TicketType.PURCHASE,
          formData: { itemName: 'Laptop', quantity: 2, price: 50000, reason: 'New hire' }
        })
      ).not.toThrow();
    });

    it('should pass for VACATION with all fields', () => {
      expect(() =>
        validateRequiredFields({
          ticketType: TicketType.VACATION,
          formData: { startDate: '2024-06-01', endDate: '2024-06-14', reason: 'Vacation' }
        })
      ).not.toThrow();
    });

    it('should throw for PURCHASE with missing fields', () => {
      expect(() =>
        validateRequiredFields({
          ticketType: TicketType.PURCHASE,
          formData: { itemName: 'Laptop' }
        })
      ).toThrow('Missing required fields');
    });

    it('should throw for VACATION with missing fields', () => {
      expect(() =>
        validateRequiredFields({
          ticketType: TicketType.VACATION,
          formData: { startDate: '2024-06-01' }
        })
      ).toThrow('Missing required fields');
    });

    it('should throw for unsupported ticket type', () => {
      expect(() =>
        validateRequiredFields({
          ticketType: 'unknown_type',
          formData: {}
        })
      ).toThrow('Unsupported ticket type');
    });
  });

  describe('validateActionContext', () => {
    it('should pass for valid context', () => {
      expect(() =>
        validateActionContext({
          action: Action.SUBMIT,
          actorRole: UserRole.REQUESTER,
          comment: null
        })
      ).not.toThrow();
    });

    it('should throw for invalid role', () => {
      expect(() =>
        validateActionContext({
          action: Action.APPROVE,
          actorRole: UserRole.REQUESTER,
          comment: null
        })
      ).toThrow('cannot perform action');
    });

    it('should throw for missing required comment', () => {
      expect(() =>
        validateActionContext({
          action: Action.REJECT,
          actorRole: UserRole.MANAGER,
          comment: ''
        })
      ).toThrow('Comment is required');
    });
  });
});