import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { ClassValidatorFields } from '../class-validator-fields';

class StubRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
}

class StubClassValidator extends ClassValidatorFields<StubRules> {
  validate(data: StubRules | null): boolean {
    return super.validate(new StubRules(data?.name as any, data?.price as any));
  }
}

describe('ClassValidatorFields integration tests', () => {
  it('should validate with errors', () => {
    const validator = new StubClassValidator();
    expect(validator.validate(null)).toBeFalsy();
    expect(validator.errors).toStrictEqual({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ],
      price: [
        'price should not be empty',
        'price must be a number conforming to the specified constraints',
      ],
    });
  });

  it('should validate without errors', () => {
    const validator = new StubClassValidator();
    expect(
      validator.validate({
        name: 'test value',
        price: 21312,
      })
    ).toBeTruthy();
    expect(validator.validatedData).toStrictEqual(
      new StubRules('test value', 21312)
    );
  });
});
