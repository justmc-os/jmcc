import { CValue } from '../Value';

class NumberConstant extends CValue('number', 'число') {
  constructor(public number: number) {
    super();
  }

  toString(): string {
    return this.number.toString();
  }

  toJson(): object {
    return {
      ...super.toJson(),
      number: this.number,
    };
  }
}

export default NumberConstant;
