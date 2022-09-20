import { validateSync } from 'class-validator';
import {
  FieldErrors,
  ValidatorFieldsInterface,
} from './validator-fields-interface';

export abstract class ClassValidatorFields<PropsValidated>
  implements ValidatorFieldsInterface<PropsValidated>
{
  errors: FieldErrors | null = null;
  validatedData: PropsValidated | null = null;

  validate(data: PropsValidated | null): boolean {
    const errors = validateSync(data as object);
    if (errors.length) {
      this.errors = {};
      for (const error of errors) {
        const field = error.property;
        this.errors[field] = Object.values(error.constraints ?? {});
      }
    } else {
      this.validatedData = data;
    }

    return !errors.length;
  }
}
