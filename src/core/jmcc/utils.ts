import chalk from 'chalk';
import ErrorTraceable, { TracedParsingError } from './ErrorTraceable';
import ParenthesizedExpression from './expression/ParenthesizedExpression';
import NumberConstant from './value/constants/NumberConstant';
import Internal from './value/Internal';
import MathExpression from './value/MathExpression';
import { Value } from './value/Value';
import Variable from './value/Variable';
import GameValue from './value/GameValue';
import { DynamicValue } from './value/DynamicValue';

/**
 * Возвращает тип элемента массива
 */
export type ElementOf<Array extends readonly unknown[]> =
  Array extends readonly (infer Element)[] ? Element : never;

type KeysOfType<T, SelectedType> = {
  [key in keyof T]: SelectedType extends T[key] ? key : never;
}[keyof T];

type Optional<T> = Partial<Pick<T, KeysOfType<T, undefined>>>;

type Required<T> = Omit<T, KeysOfType<T, undefined>>;

/**
 * Преобразует параметры, которым возможно присвоить undefined, в опциональные
 */
export type OptionalUndefined<T> = Optional<T> & Required<T>;

type Assert = (
  condition: unknown,
  message: string | Error
) => asserts condition;
type AssertType<T> = (value: any) => asserts value is T;
type AssertValueType<T extends Value> = (value: Value) => asserts value is T;

const assert: Assert = (condition, message: string | Error) => {
  if (!condition) throw message;
};

export const assertValue: AssertType<Value> = (value: ErrorTraceable) => {
  assert(
    value instanceof Value,
    new TracedParsingError(
      value,
      'Данное выражение не имеет значения и не может быть использовано как значение'
    )
  );
};

export const isGameValue = (argument: any): argument is GameValue<any> =>
  argument?.constructor.name === 'GameValue';

const isNumberValue = (value: any): boolean =>
  value instanceof MathExpression ||
  value instanceof NumberConstant ||
  value instanceof Variable ||
  value instanceof DynamicValue ||
  (isGameValue(value) && value.type === NumberConstant) ||
  (value instanceof ParenthesizedExpression && isNumberValue(value.expression));

export const assertNumberValue: AssertValueType<
  MathExpression | NumberConstant | Variable
> = (value) => {
  assertValue(value);
  assert(
    isNumberValue(value),
    new TracedParsingError(
      value,
      `Ожидал ${chalk.cyan('число')}, но получил ${value.toDebug()}`
    )
  );
};

export const isVariable = (value: any): value is Variable =>
  value instanceof Variable;

export const assertVariableValue: AssertValueType<Variable> = (value) => {
  assertValue(value);
  assert(
    isVariable(value),
    new TracedParsingError(
      value,
      `Ожидал ${chalk.cyan('переменную')}, но получил ${value.toDebug()}`
    )
  );
};

type BaseCallArgument = {
  value: Value;
};

type NamedCallArgument = BaseCallArgument & {
  name: string;
};

export type CallArgument = BaseCallArgument | NamedCallArgument;

type NormalizedCallArguments = {
  [key: string]: Value;
};

export const normalizeCallArguments = (
  args: Internal<CallArgument>[],
  argSchema: string[]
): NormalizedCallArguments => {
  if (args.length > argSchema.length)
    throw `Передано слишком много аргументов (нужно: ${argSchema.length}, передано: ${args.length})`;

  const result: NormalizedCallArguments = {};
  let namedMode = false;

  args.forEach((argument, idx) => {
    assertValue(argument.value.value);

    if ('name' in argument.value) {
      if (!argSchema.includes(argument.value.name))
        throw new TracedParsingError(
          argument,
          `Неизвестный аргумент '${argument.value.name}'`
        );

      namedMode = true;
      return (result[argument.value.name] = argument.value.value.setNode(
        argument.node!
      ));
    }

    if (namedMode)
      throw new TracedParsingError(
        argument,
        'Нельзя использовать позиционные аргументы после именных'
      );

    result[argSchema[idx]] = argument.value.value.setNode(argument.node!);
  });

  return result;
};
