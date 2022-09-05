import Actions from './action/defined/Actions';
import Variable, { VariableScope } from '../value/Variable';
import CodeContainingAction from './action/CodeContainingAction';
import CodeHandler from './handler/CodeHandler';
import CodeAction from './action/CodeAction';
import locationFactory from './factory/LocationFactory';
import itemFactory from './factory/ItemFactory';
import InlineVariable from '../value/InlineVariable';
import Handlers from './handler/Handlers';
import { Value } from '../value/Value';
import ArrayConstant from '../value/constants/ArrayConstant';
import { DynamicValue } from '../value/DynamicValue';
import variableActions from './action/defined/VariableActions';
import { Factory } from './factory/Factory';
import NamedObject from './objects/NamedObject';
import soundFactory from './factory/SoundFactory';
import vectorFactory from './factory/VectorFactory';
import particleFactory from './factory/ParticleFactory';
import potionFactory from './factory/PotionFactory';
import playerObject from './objects/PlayerObject';
import variableObject from './objects/VariableObject';
import valueObject from './objects/ValueObject';
import codeObject from './objects/CodeObject';
import worldObject from './objects/WorldObject';
import { getInitialHandler } from '../CodeVisitor';
import entityObject from './objects/EntityObject';
import selectObject from './objects/SelectObject';
import repeatObject from './objects/RepeatObject';
import Internal from '../value/Internal';
import {
  assertValue,
  CallArgument,
  isVariable,
  normalizeCallArguments,
} from '../utils';
import TextConstant from '../value/constants/TextConstant';
import codeActions from './action/defined/CodeActions';
import { TracedParsingError } from '../ErrorTraceable';

type Branch = CodeContainingAction | CodeHandler;
type GlobalVariableScope = VariableScope.GAME | VariableScope.SAVE;
type GlobalVariables = { [key in GlobalVariableScope]: Variable[] };

export type FunctionArgument = {
  name: string;
  defaultValue?: Value;
};

type FunctionCall = Internal<{
  branch: Branch;
  name: string;
  args: Internal<CallArgument>[];
}>;

type Function = {
  name: string;
  args: FunctionArgument[];
  process?: boolean;
};

class CodeModule {
  constructor(public path: string) {}

  public handlers = new Handlers();
  public functions: Function[] = [];
  public variables: GlobalVariables = {
    game: [],
    save: [],
  };

  public children: CodeModule[] = [];

  static OBJECTS = [
    playerObject,
    variableObject,
    valueObject,
    codeObject,
    worldObject,
    entityObject,
    selectObject,
    repeatObject,
  ];

  static FACTORIES: Factory[] = [
    locationFactory,
    itemFactory,
    soundFactory,
    vectorFactory,
    particleFactory,
    potionFactory,
  ];

  private branches: Branch[] = [];
  get branch() {
    return this.branches[this.branches.length - 1];
  }

  get localVariables() {
    return this.branch.localVariables;
  }

  get actions() {
    return this.branch.actions;
  }

  addAction(action: CodeAction) {
    this.actions.push(action);
    this.addLateActions();
  }

  public lateActions: CodeAction[] = [];
  addLateActions() {
    this.actions.push(...this.lateActions);
    this.lateActions = [];
  }

  public lateFunctionCalls: FunctionCall[] = [];
  resolveLateFunctionCalls() {
    this.lateFunctionCalls.forEach((call) => {
      const func = this.functions.find((func) => func.name === call.value.name);

      if (!func)
        throw new TracedParsingError(
          call,
          `Неизвестная функция '${call.value.name}'`
        );

      const branch = this.branch;
      this.branches[this.branches.length - 1] = call.value.branch;
      this.callFunction(func, call.value.args);
      this.branches[this.branches.length - 1] = branch;
    });
  }

  startBranch(branch: Branch) {
    if (this.branch)
      branch.localVariables = branch.localVariables.concat(this.localVariables);
    if (CodeHandler.is(branch)) this.handlers.add(branch);

    this.branches.push(branch);
  }

  endBranch() {
    this.addLateActions();
    this.branches.pop();
  }

  declareVariable(variable: Variable) {
    const resolved = this.resolveVariableByScope(variable.name, variable.scope);
    if (resolved) throw `Переопределение переменной '${variable.name}'`;

    if (variable.scope !== VariableScope.LOCAL)
      this.variables[variable.scope].push(variable);
    else this.localVariables.push(variable);
  }

  assignArray(variable: Variable, array: Value[]) {
    const chunks = array.reduce((all, one, i) => {
      const chunk = Math.floor(
        i / variableActions.CREATE_LIST.arguments.values.length
      );
      all[chunk] = ([] as Value[]).concat(all[chunk] || [], one);

      return all;
    }, [] as Value[][]);

    // Первое действие - создание списка, последующие - добавления значений
    const action = Actions.from(variableActions.CREATE_LIST, {
      variable,
      values: chunks[0] || [],
    });

    // Список действий, которые нужны для создания списка
    const actions = chunks.slice(1).map((chunk) => {
      return Actions.from(variableActions.APPEND_VALUES, {
        variable,
        values: chunk,
      });
    });

    return [action, ...actions];
  }

  assignVariable(variable: Variable, expression: Value) {
    assertValue(expression);

    if (variable instanceof InlineVariable) {
      if (expression instanceof DynamicValue)
        throw 'Нельзя присвоить динамическое значение встроенной переменной';

      return (variable.value = expression);
    }

    if (expression instanceof DynamicValue) {
      return expression.assignTo(variable);
    }

    if (expression instanceof ArrayConstant) {
      return this.assignArray(variable, expression.values).forEach((action) =>
        this.addAction(action)
      );
    }

    return this.addAction(
      Actions.from(variableActions.SET, {
        variable: variable,
        value: expression,
      })
    );
  }

  resolveObject(reference: string): NamedObject | undefined {
    return CodeModule.OBJECTS.find((object) => object.name === reference);
  }

  resolveFactory(reference: string): Factory | undefined {
    return CodeModule.FACTORIES.find(
      (factory) => factory.ctor.identifier === reference
    );
  }

  callFunction(func: Function, args: Internal<CallArgument>[]) {
    const argSchema = func.args.map(
      ({ name }, idx) => [name, idx] as [string, number]
    );
    const normalized = normalizeCallArguments(
      args,
      argSchema.map(([a]) => a)
    );

    const funcArgs = argSchema.map(([key, idx]) => {
      if (
        !Object.keys(normalized).includes(key) &&
        func.args[idx].defaultValue === undefined
      )
        throw `Не было передано значение для аргумента '${key}'`;

      const argument = normalized[key];
      // Если в качестве аргумента функции передаётся локальная переменная,
      // имя которой равно имени аргумента, то игнорируем её
      // (она и так будет установлена)
      if (
        argument &&
        isVariable(argument) &&
        argument.name === key &&
        argument.scope === VariableScope.LOCAL
      )
        return;

      const variable = new Variable(key, VariableScope.LOCAL);
      this.assignVariable(variable, argument || func.args[idx].defaultValue);

      return [variable, key] as [Variable, string];
    });

    const action = func.process
      ? Actions.from(codeActions.START_PROCESS, {
          process_name: new TextConstant(func.name),
          local_variables_mode: 'COPY',
        })
      : Actions.from(codeActions.CALL_FUNCTION, {
          function_name: new TextConstant(func.name),
        });

    this.addAction(action);

    // Устанавливаем после выполнения функции значения для переданных аргументов
    // Это позволяет изменять значения аргументов функции, не меняя
    // их имени или типа
    funcArgs.forEach((funcArg) => {
      if (!funcArg) return;

      const argument = normalized[funcArg[1]];
      if (argument && isVariable(argument))
        this.assignVariable(argument, funcArg[0]);
    });
  }

  resolveFunction(reference: string) {
    return this.functions.find((func) => func.name === reference);
  }

  resolveVariable(reference: string) {
    const variable =
      this.resolveVariableByScope(reference, VariableScope.LOCAL) ||
      this.resolveVariableByScope(reference, VariableScope.GAME) ||
      this.resolveVariableByScope(reference, VariableScope.SAVE);

    if (variable instanceof InlineVariable) return variable.value;
    else if (variable) {
      const _variable = new Variable(reference, variable.scope);
      return _variable;
    }
  }

  resolveVariableByScope(name: string, type: VariableScope) {
    if (type === VariableScope.LOCAL)
      return this.localVariables.find(
        (variable) =>
          Variable.normalizeName(variable.name) === Variable.normalizeName(name)
      );

    return this.variables[type].find(
      (variable) =>
        Variable.normalizeName(variable.name) === Variable.normalizeName(name)
    );
  }

  contains(modulePath: string): boolean {
    return this.children.some(
      (child) => child.path === modulePath || child.contains(modulePath)
    );
  }

  import(other: CodeModule) {
    this.variables.game = this.variables.game.concat(other.variables.game);
    this.variables.save = this.variables.save.concat(other.variables.save);
    this.functions = this.functions.concat(other.functions);
    this.handlers.importVariables(other.handlers);

    this.children.push(other);
  }

  toJson() {
    const resolvedModules: string[] = [];
    const handlers = new Handlers();
    handlers.add(getInitialHandler());

    const walk = (module: CodeModule) => {
      module.children.forEach((child) => {
        walk(child);
        if (!resolvedModules.includes(child.path)) {
          handlers.append(child.handlers);
          resolvedModules.push(child.path);
        }
      });
    };

    walk(this);
    handlers.append(this.handlers);

    return handlers.toJson();
  }
}

export default CodeModule;
