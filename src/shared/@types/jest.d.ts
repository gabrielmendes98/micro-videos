import { FieldErrors } from 'shared/domain/validators/validator-fields-interface';

declare global {
  declare namespace jest {
    interface Matchers<R> {
      containErrorMessages: (expected: FieldErrors) => R;
    }
  }
}

export {};
