import ParenthesizedExpression from '../expression/ParenthesizedExpression';
import { assertNumberValue } from '../utils';
import NumberConstant from './constants/NumberConstant';
import { DynamicValue } from './DynamicValue';
import CValue, { Value } from './Value';
import Variable from './Variable';

enum AdditiveOperator {
  ADD = '+',
  SUB = '-',
}

enum MultiplicativeOperator {
  DIV = '/',
  MOD = '%',
  MULT = '*',
}

class MathExpression extends CValue('text', 'текст') {
  public value: string | number;

  constructor(value: Value) {
    super();
    this.value = MathExpression.expand(value);
  }

  apply(operator: string, next: Value) {
    const value = MathExpression.expand(next);

    if (typeof value === 'string' || typeof this.value === 'string') {
      this.value = `${this.value}${operator}${value}`;
      return;
    }

    if (operator === AdditiveOperator.ADD) this.value += value;
    if (operator === AdditiveOperator.SUB) this.value -= value;
    if (operator === MultiplicativeOperator.MULT) this.value *= value;
    if (operator === MultiplicativeOperator.DIV) this.value /= value;
    if (operator === MultiplicativeOperator.MOD) this.value %= value;
  }

  toString() {
    if (typeof this.value !== 'string') return this.value.toString();

    return `%math(${this.value})`;
  }

  toJson(): object {
    return {
      ...super.toJson(),
      text: this.toString(),
    };
  }

  static expand(value: Value): string | number {
    assertNumberValue(value);

    if (value instanceof NumberConstant) return value.number;
    if (value instanceof Variable) return value.toString();
    if (value instanceof DynamicValue) return value.toVariable().toString();
    if (value instanceof ParenthesizedExpression) {
      if (
        value.expression instanceof MathExpression &&
        typeof value.expression.value === 'number'
      )
        return value.expression.value;

      return `(${this.expand(value.expression)})`;
    }

    return (value as MathExpression).value;
  }

  static evaluate(expression: (Value | string)[]) {
    const value = expression[0] as Value;
    if (expression.length === 1) return value;
    const mathExpr = new MathExpression(value);

    for (let i = 1; i < expression.length; i++) {
      const operator = expression[i] as string;
      const nextNode = expression[++i] as Value;

      mathExpr.apply(operator, nextNode);
    }

    return mathExpr;
  }

  static parseFunction(name: string, args: Value[]): MathExpression | null {
    const func = this.functions[name];
    if (!func) return null;
    if (args.length > func)
      throw `Передано слишком много аргументов (нужно: ${func}, передано: ${args.length})`;
    if (args.length < func)
      throw `Передано недостаточно аргументов (нужно: ${func}, передано: ${args.length})`;

    const values = args.map((value) => this.expand(value));
    const expr = new MathExpression(args[0]);
    expr.value = `${name}(${values.join(',')})`;

    return expr;
  }

  /**
   * @see https://github.com/cregus/expression-evaluator/blob/master/src/main/kotlin/pl/kremblewski/expressionevaluator/Tokenizer.kt
   */
  static functions: {
    [name: string]: number; // Parameters
  } = {
    abs: 1,
    sqrt: 1,
    cbrt: 1,
    ceil: 1,
    floor: 1,
    sin: 1,
    cos: 1,

    round: 2,
    pow: 2,
    min: 2,
    max: 2,
  };
}

export default MathExpression;
