import { FieldErrors } from '../validators';

export class LoadEntityError extends Error {
  constructor(public error: FieldErrors, message?: string) {
    super(message ?? 'Entity not loaded');
    this.name = 'LoadEntityError';
  }
}
