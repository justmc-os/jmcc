import chalk from 'chalk';

import CodeBasicAction from '../CodeBasicAction';
import { ElementOf, isGameValue, OptionalUndefined } from '../../../utils';
import CodeAssigningAction from '../CodeAssigningAction';
import CodeContainingAction, {
  ActionContainerType,
} from '../CodeContainingAction';
import { Value, ValueType } from '../../../value/Value';
import TextConstant from '../../../value/constants/TextConstant';
import EnumConstant from '../../../value/constants/EnumConstant';
import Variable, { VariableScope } from '../../../value/Variable';
import NumberConstant from '../../../value/constants/NumberConstant';
import ItemConstant from '../../../value/constants/ItemConstant';
import Any from '../../../value/Any';
import MathExpression from '../../../value/MathExpression';
import ArrayConstant from '../../../value/constants/ArrayConstant';
import type GameValue from '../../../value/GameValue';
import { TracedParsingError } from '../../../ErrorTraceable';
import EmptyValue from '../../../value/EmptyValue';
import PotionConstant from '../../../value/constants/PotionConstant';
import SoundConstant from '../../../value/constants/SoundConstant';
import VectorConstant from '../../../value/constants/VectorConstant';
import LocationConstant from '../../../value/constants/LocationConstant';
import ParticleConstant from '../../../value/constants/ParticleConstant';
import ParenthesizedExpression from '../../../expression/ParenthesizedExpression';
import { RequiredArgument } from '../../factory/Factory';
import { DynamicValue } from '../../../value/DynamicValue';

type ActionRegisterBaseOptions = {
  selection?: string[];
  origin?: string;
  conditional?: boolean;
};

export type ActionRegisterContainingOptions = ActionRegisterBaseOptions & {
  containing?: ActionContainerType;
  lambda?: string[];
  assigning?: never;
};

export type ActionRegisterAssigningOptions = ActionRegisterBaseOptions & {
  assigning?: string;
  containing?: never;
  lambda?: never;
};

export type ActionRegisterOptions =
  | ActionRegisterAssigningOptions
  | ActionRegisterContainingOptions;

export type ArrayArgument<T extends ValueType = ValueType> = {
  argument: T;
  array: true;
  length: number;
};

export type MapArgument<
  K extends ValueType = ValueType,
  V extends ValueType = ValueType
> = {
  key: K;
  value: V;
  map: true;
};

export type EnumArgument<T extends readonly string[]> = {
  argument: typeof EnumConstant;
  enum: T;
  defaultValue?: ElementOf<T>;
  optional: boolean;
};

export type ArgumentType =
  | ValueType
  | ArrayArgument
  | MapArgument
  | EnumArgument<any>;

export type ActionArgumentTypes = {
  [key: string]: ArgumentType;
};

export type ActionArguments = {
  [key: string]: InstanceType<ValueType> | ArrayConstant<any>;
};

export type BaseAction<T extends ActionArgumentTypes = ActionArgumentTypes> = {
  id: string;
  name: string;
  arguments: T;
  selection: string[];
  origin?: string;
  conditional?: boolean;
};

export type AssigningAction<
  T extends ActionArgumentTypes = ActionArgumentTypes
> = BaseAction<T> & {
  assigning: string;
  origin?: string;
};

export const isAssigningAction = (
  action: BaseAction
): action is AssigningAction => 'assigning' in action;

export type ContainingAction<
  T extends ActionArgumentTypes = ActionArgumentTypes
> = BaseAction<T> & {
  containing: ActionContainerType;
  lambda?: string[];
};

export const isContainingAction = (
  action: BaseAction | ContainingAction
): action is ContainingAction => 'containing' in action;

export type ActionFromOptions<
  T extends ActionRegisterOptions | undefined,
  K extends ActionArgumentTypes = ActionArgumentTypes
> = T extends undefined
  ? BaseAction<K>
  : T extends ActionRegisterAssigningOptions
  ? AssigningAction<K>
  : T extends ActionRegisterContainingOptions
  ? ContainingAction<K>
  : BaseAction<K>;

export type ActualAction<T extends BaseAction> = T extends AssigningAction
  ? CodeAssigningAction
  : T extends ContainingAction
  ? CodeContainingAction
  : CodeBasicAction;

type VariableArgument<T extends ValueType> =
  | InstanceType<T>
  | Variable
  | GameValue<T>;

type SupportedValues<T extends ValueType> = T extends typeof Variable // Переменные не поддерживают игровые значения
  ? InstanceType<T>
  : T extends typeof NumberConstant | typeof ItemConstant // Числа и предметы поддерживают текстовые значения
  ? VariableArgument<T | typeof TextConstant | typeof MathExpression>
  : T extends typeof Any // Any поддерживает любое значение
  ? Value
  : VariableArgument<T>;

export type ActionArgumentsFromAction<T> = OptionalUndefined<{
  // Если аргумент определён напрямую
  [key in keyof T]: T[key] extends ValueType
    ? SupportedValues<T[key]>
    : // Если аргумент это перечисление
    T[key] extends EnumArgument<infer X>
    ? ElementOf<X> | undefined
    : // Если аргумент - список
    T[key] extends ArrayArgument<infer X>
    ? SupportedValues<X>[] | SupportedValues<X> | ArrayConstant<X>
    : Value;
}>;
export const isArray = (argument: any): argument is ArrayArgument =>
  'array' in argument;
export const isMap = (argument: any): argument is MapArgument =>
  'map' in argument;
export const isEnum = (argument: any): argument is EnumArgument<any> =>
  'enum' in argument;
export const isValue = (argument: any): argument is ValueType =>
  !('argument' in argument);

const equals = (value: Value, argument: ArgumentType) => {
  // Если аргумент принимает предмет, но было передано значение текста
  if (isValue(argument) && argument === item && value instanceof TextConstant)
    return true;

  // Если аргумент принимает число, но было передано значение математического выражения
  if (
    isValue(argument) &&
    argument === number &&
    value instanceof MathExpression
  )
    return true;

  // Если значение равно типу аргумента
  if (isValue(argument) && value instanceof argument) return true;

  // Если значение и аргумент являются списками и их типы равны
  if (
    isArray(argument) &&
    value instanceof ArrayConstant &&
    equals(value.type, argument.argument)
  )
    return true;

  // Если аргумент является перечислением и содержит значение
  if (
    isEnum(argument) &&
    value instanceof EnumConstant &&
    argument.enum.includes(value.value)
  )
    return true;

  // Если значение не является списком и аргумент принимает любой тип значений
  if (
    isValue(argument) &&
    !(value instanceof ArrayConstant) &&
    value !== undefined &&
    argument === Any
  )
    return true;

  // Если значение является переменной
  if (value instanceof Variable) return true;

  // Если значение является переменной

  // Если значение является игровым значением и тип значения равен типу аргумента
  if (isGameValue(value)) {
    const _value = value as GameValue<any>;

    if (
      (isArray(_value.type) &&
        isArray(argument) &&
        _value.type.argument === argument.argument) ||
      _value.type === argument
    )
      return true;

    if (argument === Variable) return true;
  }

  return false;
};

class Actions {
  public actions: BaseAction[] = [];
  constructor(public selection: string[]) {}

  register<
    T extends ActionRegisterOptions | undefined = undefined,
    K extends ActionArgumentTypes = {}
  >(id: string, action: string, args: K, options?: T): ActionFromOptions<T, K> {
    const value = {
      id,
      name: action,
      arguments: args,
      selection: this.selection,
      ...options,
    } as any;

    this.actions.push(value);
    return value;
  }

  get(
    action: string
  ): BaseAction | AssigningAction | ContainingAction | undefined {
    return this.actions.find(({ name }) => name === action);
  }

  /**
   * Проверяет переданные действию аргументы и выборку (и нормализирует их)
   */
  static validate(action: BaseAction, args: ActionArguments) {
    const actionArguments = Object.keys(action.arguments);

    actionArguments.forEach((key) => {
      const argument = action.arguments[key];

      // Если действие присваивает значение, то игнорируем аргумент для переменной
      // ведь его устанавливает AnonymousVariable
      if (isAssigningAction(action) && key === action.assigning) return;

      let provided = args[key];

      // Если действие принимает перечисление, но аргумента для него не было
      // передано, то берём первое возможное значение из перечисления аргумента действия
      if (isEnum(argument) && provided === undefined)
        provided = args[key] = new EnumConstant(
          argument.defaultValue || argument.enum[0]
        );

      if (provided === undefined) return;

      // Если аргумент в скобках, то вынимаем его из скобок
      if (provided instanceof ParenthesizedExpression)
        provided = args[key] = provided.expression;

      // Если аргумент динамическое значение
      if (provided instanceof DynamicValue && !isGameValue(provided))
        provided = args[key] = provided.toVariable();

      // Если действие принимает список аргументов, но был передан один аргумент
      // то сворачиваем аргумент в список
      if (isArray(argument) && equals(provided, argument.argument))
        provided = args[key] = new ArrayConstant(provided, [provided]);

      // Если действие принимает перечисление и аргумент был передан как
      // текст, то проверяем на наличие такого ключа в перечислении и устанавливаем его
      if (isEnum(argument) && provided instanceof TextConstant) {
        if (!(argument.enum as string[]).includes(provided.text)) {
          const boolean =
            argument.enum.includes('TRUE') && argument.enum.includes('FALSE');

          const expected = boolean
            ? "'true' или 'false'"
            : `(${argument.enum.join(' или ')})`;

          throw new TracedParsingError(
            provided,
            `Неизвестный ключ перечисления '${provided.text}', ожидал ${expected}`
          );
        }

        provided = args[key] = new EnumConstant(provided.text);
      }

      // Если значение требует переменную, но передан массив
      if (provided instanceof ArrayConstant && argument === Variable) {
        const variable = new Variable(
          DynamicValue.getNextName(),
          VariableScope.LOCAL
        );
        CodeVisitor.currentModule.assignVariable(variable, provided);
        provided = args[key] = variable;
      }

      if (!equals(provided, argument))
        throw new TracedParsingError(
          provided,
          `Аргумент с типом ${provided.toDebug()} не может быть установлен параметру с типом ${argumentToString(
            argument
          )}`
        );

      if (provided instanceof ArrayConstant && isArray(argument)) {
        if (provided.values.length > argument.length)
          throw new TracedParsingError(
            provided,
            `Максимальное количество значений для данного аргумента - ${argument.length}`
          );

        provided.values = Array(argument.length)
          .fill(null)
          .map(
            (_, idx) =>
              (provided as ArrayConstant<any>).values[idx] || new EmptyValue()
          );
      }
    });

    return args;
  }

  static from<T extends BaseAction | ContainingAction | AssigningAction>(
    action: T,
    args: ActionArgumentsFromAction<T['arguments']>,
    selection: string | null = null
  ): ActualAction<T> {
    const _args: ActionArguments = args;
    Object.entries(args).forEach(([key, value]) => {
      // Преобразует строки в перечисления
      if (typeof value === 'string')
        return (_args[key] = new EnumConstant(value));

      // Преобразует массив аргументов в список
      if (isArray(action.arguments[key]) && Array.isArray(value))
        _args[key] = new ArrayConstant(value[0] || new Any(), value);
    });

    const validatedArgs: ActionArguments = Actions.validate(action, _args);

    if (isContainingAction(action))
      return new CodeContainingAction(
        action.id,
        action.containing,
        action.lambda,
        validatedArgs,
        action.origin,
        selection
      ) as any;
    else if (isAssigningAction(action))
      return new CodeAssigningAction(
        action.id,
        action.assigning,
        validatedArgs,
        action.origin,
        selection
      ) as any;

    return new CodeBasicAction(
      action.id,
      validatedArgs,
      action.origin,
      selection
    ) as any;
  }
}

/**
 * Аргумент, поддерживающий список значений
 */
export const array = <T extends ValueType>(
  argument: T,
  length: number
): ArrayArgument<T> => ({
  argument,
  array: true,
  length,
});

/**
 * Аргумент словаря
 */
export const map = <K extends ValueType, V extends ValueType>(
  key: K,
  value: V
): MapArgument<K, V> => ({
  key,
  value,
  map: true,
});

/**
 * Аргумент перечисления
 */
export const enumof = <T extends string>(
  ...enumeration: readonly T[]
): EnumArgument<readonly T[]> => ({
  argument: EnumConstant,
  enum: enumeration,
  optional: true,
});

export const enumWithDefaultValue = <T extends string>(
  defaultValue: T,
  ...enumeration: readonly T[]
): EnumArgument<readonly T[]> => ({
  argument: EnumConstant,
  enum: enumeration,
  defaultValue,
  optional: true,
});

export const boolean = (defaultValue?: boolean) =>
  defaultValue !== undefined
    ? enumWithDefaultValue(defaultValue ? 'TRUE' : 'FALSE', 'TRUE', 'FALSE')
    : enumof('TRUE', 'FALSE');

export const number = NumberConstant;
export const text = TextConstant;
export const potion = PotionConstant;
export const sound = SoundConstant;
export const variable = Variable;
export const vector = VectorConstant;
export const item = ItemConstant;
export const location = LocationConstant;
export const particle = ParticleConstant;
export const any = Any;

export const argumentToString = (argument: ArgumentType | RequiredArgument) => {
  const result = (() => {
    if (isEnum(argument))
      return `перечисление (${(argument.enum as string[]).join(' или ')})`;
    if (isArray(argument)) return `список[${argument.argument.text}]`;
    if (isMap(argument))
      return `словарь{${argument.key.text}: ${argument.value.text}}`;
    if ('required' in argument) return `${argument.argument.text}*`;

    return argument.text;
  })();

  return chalk.cyan(result);
};

export const dummyActions = new Actions([]);

export default Actions;

import CodeVisitor from '../../../CodeVisitor';
import MapConstant from '../../../value/constants/MapConstant';
