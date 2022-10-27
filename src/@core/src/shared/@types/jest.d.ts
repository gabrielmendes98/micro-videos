import { FieldErrors } from '#shared/domain';

declare global {
  declare namespace jest {
    interface Matchers<R> {
      toContainErrorMessages: (expected: FieldErrors) => R;
    }
  }
}

export {};
