import { ClassValidatorFields } from '../validators/class-validator-fields';
import { FieldErrors } from '../validators/validator-fields-interface';
import { isMatch as testMatch } from 'lodash';

type Expected = {
  validator: ClassValidatorFields<any>;
  data: any;
};

expect.extend({
  containErrorMessages(expected: Expected, received: FieldErrors) {
    const { validator, data } = expected;
    const isValid = validator.validate(data);

    if (isValid) {
      return {
        pass: false,
        message: () => `Data is valid: ${JSON.stringify(data)}`,
      };
    }

    const isMatch = testMatch(validator.errors ?? {}, received);

    return isMatch
      ? {
          pass: true,
          message: () => '',
        }
      : {
          pass: false,
          message: () =>
            `The validation errors not contains ${JSON.stringify(
              received
            )}. Current: ${JSON.stringify(expected)}`,
        };
  },
});
