import { CValue } from '../Value';

class EnumConstant extends CValue('enum', 'перечисление') {
  constructor(public value: string) {
    super();
  }

  toString(): string {
    return this.value;
  }

  toJson(): object {
    return {
      ...super.toJson(),
      enum: this.value,
    };
  }
}

export class BooleanConstant extends EnumConstant {
  static text = 'булеан';

  constructor(value: boolean) {
    super(value ? 'TRUE' : 'FALSE');
  }

  static from(text: string) {
    return new BooleanConstant(text === 'true');
  }
}

export default EnumConstant;
