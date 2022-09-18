import { ValidationError } from 'shared/errors/validation.error';

export class ValidatorRules {
  private constructor(private value: any, private property: string) {}

  static values(value: any, property: string) {
    return new ValidatorRules(value, property);
  }

  required(): Omit<this, 'required'> {
    if (this.value === null || this.value === undefined || this.value === '') {
      throw new ValidationError(`The ${this.property} is required`);
    }
    return this;
  }

  string(): Omit<this, 'string'> {
    if (!this.isEmpty() && typeof this.value !== 'string') {
      throw new ValidationError(`The ${this.property} must be a string`);
    }
    return this;
  }

  maxLength(max: number): Omit<this, 'maxLength'> {
    if (!this.isEmpty() && this.value.length > max) {
      throw new ValidationError(
        `The ${this.property} must be less or equal than ${max} characters`
      );
    }
    return this;
  }

  boolean(): Omit<this, 'boolean'> {
    if (!this.isEmpty() && typeof this.value !== 'boolean') {
      throw new ValidationError(`The ${this.property} must be a boolean`);
    }
    return this;
  }

  private isEmpty() {
    return this.value === undefined || this.value === null;
  }
}
