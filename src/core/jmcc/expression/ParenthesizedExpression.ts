import { Value, ValueType } from '../value/Value';

class ParenthesizedExpression extends Value {
  constructor(public expression: Value) {
    super();
  }

  get ctor(): ValueType {
    return this.expression.ctor;
  }

  toDebug() {
    return this.expression.toDebug();
  }

  toString(): string {
    return this.expression.toString();
  }

  toJson(): object {
    return this.expression.toJson();
  }
}

export default ParenthesizedExpression;
