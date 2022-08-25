import { TracedParsingError } from '../../ErrorTraceable';
import { ElementOf } from '../../utils';
import Any from '../../value/Any';
import ArrayConstant from '../../value/constants/ArrayConstant';
import EnumConstant from '../../value/constants/EnumConstant';
import { Value, ValueType } from '../../value/Value';
import {
  argumentToString,
  ArgumentType,
  ArrayArgument,
  EnumArgument,
  isArray,
  isEnum,
  isValue,
} from '../action/defined/Actions';

export type RequiredArgument<T extends ValueType = ValueType> = {
  argument: T;
  required: true;
};
export const isRequired = (argument: any): argument is RequiredArgument =>
  'required' in argument;

type FactoryArgumentType = ArgumentType | RequiredArgument;
type FactoryArgumentTypes = {
  [key: string]: FactoryArgumentType;
};

export type FactoryArguments<T extends typeof Factory, A = T['args']> = {
  [key in keyof A]: A[key] extends ValueType
    ? InstanceType<A[key]> | undefined
    : // Если аргумент это перечисление
    A[key] extends EnumArgument<infer X>
    ? ElementOf<X> | undefined
    : // Если аргумент - список
    A[key] extends ArrayArgument<infer X>
    ? ArrayConstant<X> | undefined
    : A[key] extends RequiredArgument<infer X>
    ? InstanceType<X>
    : Value | undefined;
};

const equals = (value: Value, argument: FactoryArgumentType) => {
  // Если значение равно типу аргумента
  if (isValue(argument) && value instanceof argument) return true;

  // Если аргумент обязателен и значение равно типу
  if (isRequired(argument) && value instanceof argument.argument) return true;

  // Если значение и аргумент являются списками и их типы равны
  if (
    isArray(argument) &&
    value instanceof ArrayConstant &&
    equals(value.type, argument.argument)
  )
    return true;

  // Если значение не является списком и аргумент принимает любой тип значений
  if (
    isValue(argument) &&
    !(value instanceof ArrayConstant) &&
    argument === Any
  )
    return true;

  // Если аргумент является перечислением и содержит значение
  if (
    isEnum(argument) &&
    value instanceof EnumConstant &&
    argument.enum.includes(value.value)
  )
    return true;

  return false;
};

export abstract class Factory {
  static identifier: string;
  static args: FactoryArgumentTypes = {};

  get ctor() {
    return this.constructor as typeof Factory;
  }

  abstract create(args: FactoryArguments<typeof Factory>): Value;

  static validate(factory: Factory, args: FactoryArguments<typeof Factory>) {
    const actionArguments = Object.keys(factory.ctor.args);
    const providedArguments = Object.keys(args);

    const unknownArgument = providedArguments.find(
      (arg) => !actionArguments.includes(arg)
    );
    if (unknownArgument) throw `Неизвестный аргумент ${unknownArgument}`;

    actionArguments.forEach((key) => {
      const argument = factory.ctor.args[key];

      let provided = args[key];
      if (provided === undefined) {
        // Если нужный аргумент отсутствует в переданных
        if (isRequired(argument))
          throw `Не было передано значение для аргумента '${key}'`;

        return;
      }

      if (!equals(provided, argument))
        throw new TracedParsingError(
          provided,
          `Аргумент с типом ${provided.toDebug()} не может быть установлен параметру с типом ${argumentToString(
            argument
          )}`
        );
    });

    return args;
  }
}

const CFactory = (identifier: string) => {
  return class extends Factory {
    static identifier: string = identifier;

    create(
      args: FactoryArguments<typeof Factory, FactoryArgumentTypes>
    ): Value {
      throw new Error('Method not implemented.');
    }
  };
};

export const required = <T extends ValueType>(
  argument: T
): RequiredArgument<T> => ({
  argument,
  required: true,
});

export default CFactory;
