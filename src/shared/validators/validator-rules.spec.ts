import { ValidationError } from 'shared/errors/validation.error';
import { ValidatorRules } from './validator-rules';

type Values = {
  value: any;
  property: string;
};

type ExpectedRule = {
  value: any;
  property: string;
  rule: keyof ValidatorRules;
  error: ValidationError;
  params?: any[];
};

function runRule({
  value,
  property,
  rule,
  params = [],
}: Omit<ExpectedRule, 'error'>) {
  const validator = ValidatorRules.values(value, property);
  const method = validator[rule] as (...args: any[]) => ValidatorRules;
  method.apply(validator, params);
}

function assertIsInvalid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).toThrow(expected.error);
}

function assertIsValid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).not.toThrow(expected.error);
}

describe('ValidatorRules unit tests', () => {
  describe('values method', () => {
    it('should return instance of ValidatorRules', () => {
      const validator = ValidatorRules.values('value', 'prop');
      expect(validator).toBeInstanceOf(ValidatorRules);
    });

    it('should set value and property', async () => {
      const validator = ValidatorRules.values('some value', 'prop');
      expect(validator['value']).toBe('some value');
      expect(validator['property']).toBe('prop');
    });
  });

  describe('required method', () => {
    it('should throw error', () => {
      const arrange: Values[] = [
        { value: null, property: 'field' },
        { value: undefined, property: 'field' },
        { value: '', property: 'field' },
      ];
      const error = new ValidationError('The field is required');
      arrange.forEach((item) => {
        assertIsInvalid({
          value: item.value,
          property: item.property,
          rule: 'required',
          error,
        });
      });
    });

    it('should be valid', () => {
      const arrange: Values[] = [
        { value: 5, property: 'field' },
        { value: 0, property: 'field' },
        { value: -1, property: 'field' },
        { value: 'some value', property: 'field' },
        { value: 'null', property: 'field' },
        { value: false, property: 'field' },
      ];
      const error = new ValidationError('The field is required');
      arrange.forEach((item) => {
        assertIsValid({
          value: item.value,
          property: item.property,
          rule: 'required',
          error,
        });
      });
    });
  });

  describe('string method', () => {
    it('should throw error', () => {
      const arrange: Values[] = [
        { value: 10, property: 'field' },
        { value: true, property: 'field' },
        { value: {}, property: 'field' },
      ];
      const error = new ValidationError('The field must be a string');
      arrange.forEach((item) => {
        assertIsInvalid({
          value: item.value,
          property: item.property,
          rule: 'string',
          error,
        });
      });
    });

    it('should be valid', () => {
      const arrange: Values[] = [
        { value: '10', property: 'field' },
        { value: 'true', property: 'field' },
        { value: null, property: 'field' },
        { value: undefined, property: 'field' },
      ];
      const error = new ValidationError('The field must be a string');
      arrange.forEach((item) => {
        assertIsValid({
          value: item.value,
          property: item.property,
          rule: 'string',
          error,
        });
      });
    });
  });

  describe('maxLength method', () => {
    it('should throw error', () => {
      const arrange: Values[] = [{ value: '123456', property: 'field' }];
      const error = new ValidationError(
        'The field must be less or equal than 5 characters'
      );
      arrange.forEach((item) => {
        assertIsInvalid({
          value: item.value,
          property: item.property,
          rule: 'maxLength',
          error,
          params: [5],
        });
      });
    });

    it('should be valid', () => {
      const arrange: Values[] = [
        { value: '12345', property: 'field' },
        { value: null, property: 'field' },
        { value: undefined, property: 'field' },
      ];
      const error = new ValidationError(
        'The field must less or equal than 5 characters'
      );
      arrange.forEach((item) => {
        assertIsValid({
          value: item.value,
          property: item.property,
          rule: 'maxLength',
          error,
          params: [5],
        });
      });
    });
  });

  describe('boolean method', () => {
    it('should throw error', () => {
      const arrange: Values[] = [
        { value: {}, property: 'field' },
        { value: 5, property: 'field' },
        { value: 'true', property: 'field' },
      ];
      const error = new ValidationError('The field must be a boolean');
      arrange.forEach((item) => {
        assertIsInvalid({
          value: item.value,
          property: item.property,
          rule: 'boolean',
          error,
        });
      });
    });

    it('should be valid', () => {
      const arrange: Values[] = [
        { value: false, property: 'field' },
        { value: true, property: 'field' },
        { value: null, property: 'field' },
        { value: undefined, property: 'field' },
      ];
      const error = new ValidationError('The field must be a boolean');
      arrange.forEach((item) => {
        assertIsValid({
          value: item.value,
          property: item.property,
          rule: 'boolean',
          error,
        });
      });
    });
  });

  it('should throw error when combine two or more validations', () => {
    let validator = ValidatorRules.values(null, 'field');
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow('The field is required');

    validator = ValidatorRules.values(5, 'field');
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow(new ValidationError('The field must be a string'));

    validator = ValidatorRules.values('123456', 'field');
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow(
      new ValidationError('The field must be less or equal than 5 characters')
    );

    validator = ValidatorRules.values(null, 'field');
    expect(() => {
      validator.required().boolean();
    }).toThrow(new ValidationError('The field is required'));

    validator = ValidatorRules.values([], 'field');
    expect(() => {
      validator.required().boolean();
    }).toThrow(new ValidationError('The field must be a boolean'));
  });

  it('should not throw error when combine correctly two or moree validation rules', () => {
    expect.assertions(0);

    ValidatorRules.values('test', 'field').required().string();
    ValidatorRules.values('12345', 'field').required().string().maxLength(5);
    ValidatorRules.values(null, 'field').string().maxLength(5);
    ValidatorRules.values(true, 'field').required().boolean();
    ValidatorRules.values(false, 'field').required().boolean();
  });
});
