import chalk from 'chalk';

import { CValue, ValueType } from '../Value';

class ArrayConstant<T extends ValueType> extends CValue('array', 'список') {
  constructor(public type: InstanceType<T>, public values: InstanceType<T>[]) {
    super();
  }

  toString(): string {
    return `[${this.values.join(', ')}]`;
  }

  toJson(): object {
    return {
      ...super.toJson(),
      values: this.values.map((value) => value.toJson()),
    };
  }

  toDebug(): string {
    return chalk.cyan`список[${this.type.toDebug()}]`;
  }
}

export default ArrayConstant;
