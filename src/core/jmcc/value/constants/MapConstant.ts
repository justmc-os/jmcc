import chalk from 'chalk';

import { CValue, ValueType } from '../Value';

class MapConstant<K extends ValueType, V extends ValueType> extends CValue(
  'map',
  'словарь'
) {
  constructor(
    public key: InstanceType<K>,
    public value: InstanceType<V>,
    public values: Map<InstanceType<K>, InstanceType<V>>
  ) {
    if (key instanceof MapConstant || value instanceof MapConstant)
      throw 'Нельзя создавать вложенные словари';

    super();
  }

  toString(): string {
    return `{${Array.from(this.values.entries())
      .map(([key, value]) => `${key.toDebug()}: ${value.toDebug()}`)
      .join(', ')}}`;
  }

  toJson(): object {
    return {
      ...super.toJson(),
      values: Object.fromEntries(
        Array.from(this.values.entries()).map(([key, value]) => [
          key.toJson(),
          value.toJson(),
        ])
      ),
    };
  }

  toDebug(): string {
    return chalk.cyan`словарь[${this.key.toDebug()}, ${this.value.toDebug()}]`;
  }
}

export default MapConstant;
