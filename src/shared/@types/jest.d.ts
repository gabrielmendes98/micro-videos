import { FieldErrors } from 'shared/domain/validators/validator-fields-interface';

declare global {
  declare namespace jest {
    interface Matchers<R> {
      toContainErrorMessages: (expected: FieldErrors) => R;
    }
  }
}

export {};
