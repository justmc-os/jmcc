import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { RuleNode } from 'antlr4ts/tree/RuleNode';
import { ParserRuleContext } from 'antlr4ts';

import JMCC, { ParseMode } from '..';
import Reporter from './Reporter';

import * as JC from '../grammar/.compiled/JustCodeParser';
import { JustCodeParserVisitor } from '../grammar/.compiled/JustCodeParserVisitor';

import Any from './value/Any';
import Void from './value/Void';
import { Value } from './value/Value';
import Internal from './value/Internal';
import GameValue from './value/GameValue';
import { DynamicValue } from './value/DynamicValue';
import MathExpression from './value/MathExpression';
import InlineVariable from './value/InlineVariable';
import Variable, { VariableScope } from './value/Variable';
import { BooleanConstant } from './value/constants/EnumConstant';
import NumberConstant from './value/constants/NumberConstant';
import ArrayConstant from './value/constants/ArrayConstant';
import TextConstant from './value/constants/TextConstant';
import CodeModule, { FunctionArgument } from './code/CodeModule';
import CodeEvent from './code/handler/CodeEvent';
import Actions, {
  AssigningAction,
  BaseAction,
  ContainingAction,
  isAssigningAction,
  isContainingAction,
} from './code/action/defined/Actions';
import variableActions from './code/action/defined/VariableActions';
import ParenthesizedExpression from './expression/ParenthesizedExpression';
import codeActions from './code/action/defined/CodeActions';
import UnaryExpression from './expression/UnaryExpression';
import {
  assertNumberValue,
  assertValue,
  assertVariableValue,
  CallArgument,
  isVariable,
  normalizeCallArguments,
} from './utils';
import AssignmentExpression from './expression/AssignmentExpression';
import variableObject from './code/objects/VariableObject';
import { Factory } from './code/factory/Factory';
import { Property } from './code/properties/Properties';
import CodeContainingAction, {
  ActionContainerType,
} from './code/action/CodeContainingAction';
import CodeFunction from './code/handler/CodeFunction';
import CodeProcess from './code/handler/CodeProcess';

const INITIAL_OPTIONS = {
  flat: false,
  resolveIdentifiers: true,
};
export const getInitialHandler = () => new CodeEvent('world_start');
type VisitorOptions = typeof INITIAL_OPTIONS;

type ActionCall = {
  action: BaseAction | ContainingAction | AssigningAction;
  selection: string;
  origin?: Value;
};

type PropertyReference = {
  property: Property<any>;
  selection: string;
};

class CodeVisitor
  extends AbstractParseTreeVisitor<any>
  implements JustCodeParserVisitor<any>
{
  static currentModule: CodeModule;

  constructor(
    private mode: ParseMode,
    private compiler: JMCC,
    private stack: string[]
  ) {
    super();
    CodeVisitor.currentModule = this.module;
  }

  options: VisitorOptions = INITIAL_OPTIONS;
  module = new CodeModule(this.mode.path);
  reporter = new Reporter(this.mode);

  visit(tree: ParseTree): any {
    this.module.startBranch(getInitialHandler());
    tree.accept(this);
    this.module.endBranch();
  }

  defaultResult(): any {
    return undefined;
  }

  aggregateResult(aggregate: any, nextResult: any) {
    if (nextResult === undefined) return aggregate;
    if (this.options.flat) return nextResult;
    return [...(aggregate || []), nextResult];
  }

  // #region Imports
  visitImportHeader(context: JC.ImportHeaderContext) {
    this.reporter.statement = context;
    const path = this.visitString(context.string());
    if (this.mode.inline)
      throw 'Импортирование невозможно в режиме строчной компиляции';

    try {
      const module = this.compiler.import(path.text, this.mode);
      this.compiler.stack = [...this.stack];
      this.module.import(module);
    } catch (e: any) {
      return this.reporter.reportErrorAt(context.string(), e);
    }
  }
  // #endregion

  // #region Statements
  visitEventDeclaration(context: JC.EventDeclarationContext) {
    const event = this.visitIdentifier(context.identifier(), false) as string;
    if (!CodeEvent.EVENTS.includes(event))
      this.reporter.reportErrorAt(
        context.identifier(),
        `Неизвестное событие '${event}'`
      );

    this.module.startBranch(new CodeEvent(event));

    this.visitChildren(context, {
      resolveIdentifiers: false,
    });

    this.module.endBranch();
  }

  visitIfStatement(context: JC.IfStatementContext) {
    const expression: CodeContainingAction | Value = this.visitExpression(
      context.expression()
    );
    if (
      !(expression instanceof CodeContainingAction) ||
      (expression instanceof CodeContainingAction &&
        expression.type !== ActionContainerType.PREDICATE)
    )
      throw 'Данное выражение не может быть использовано в условии if-блока';

    const [ifBlock, elseBlock] = context.block();
    const not = !!context.NOT();
    expression.isInverted = not;
    this.module.addAction(expression);

    this.module.startBranch(expression);
    this.visitBlock(ifBlock);
    this.module.endBranch();

    if (elseBlock) {
      const elseAction = Actions.from(codeActions.ELSE, {});
      this.module.addAction(elseAction);

      this.module.startBranch(elseAction);
      this.visitBlock(elseBlock);
      this.module.endBranch();
    }
  }

  visitBlock(context: JC.BlockContext) {
    return this.visitChildren(context, { flat: false });
  }

  visitFunctionDeclaration(context: JC.FunctionDeclarationContext) {
    const process = !!context.PROCESS();
    const name = this.visitIdentifier(context.identifier(), false);
    const factory =
      this.module.resolveFactory(name) ||
      Object.keys(MathExpression.functions).includes(name);

    if (factory)
      this.reporter.reportErrorAt(
        context.identifier(),
        `Функция не может иметь название '${name}'`
      );

    const args = this.visitFunctionValueParameters(
      context.functionValueParameters()
    );

    this.module.functions.push({ name, args, process });
    this.module.startBranch(
      process ? new CodeProcess(name) : new CodeFunction(name)
    );
    args.forEach((argument) => {
      const variable = new Variable(argument.name, VariableScope.LOCAL);
      this.module.declareVariable(variable);
    });

    this.visitBlock(context.block());
    this.module.endBranch();
  }

  visitFunctionValueParameter(context: JC.FunctionValueParameterContext) {
    const name = this.visitIdentifier(context.identifier(), false);
    const expression = context.expression();
    if (!expression)
      return {
        name,
      };

    const defaultValue = this.visitExpression(expression);
    assertValue(defaultValue);

    return {
      name,
      defaultValue,
    };
  }

  visitFunctionValueParameters(
    context: JC.FunctionValueParametersContext
  ): FunctionArgument[] {
    return this.visitChildren(context, { flat: false }) || [];
  }

  visitLambdaStatement(context: JC.LambdaStatementContext) {
    const call = this.visitExpression(context.expression());
    if (
      !(call instanceof CodeContainingAction) ||
      (call as CodeContainingAction).type !== ActionContainerType.LAMBDA
    )
      return this.reporter.reportErrorAt(
        context.expression(),
        `Данное выражение не может быть использовано как лямбда-выражение`
      );

    const lambdaArguments = context.lambdaArguments();
    if (lambdaArguments) {
      const args = this.visitLambdaArguments(lambdaArguments);
      if (args.length > (call.lambda?.length || 0))
        return this.reporter.reportErrorAt(
          context.lambdaArguments()!,
          `Передано слишком много лямбда-аргументов (нужно: ${
            call.lambda?.length || 0
          }, передано: ${args.length})`
        );
      if (args.length === 0 || !call.lambda) return;

      call.lambda.forEach((lambdaArg, idx) => {
        if (!args[idx]) return;
        const variable = new Variable(args[idx], VariableScope.LOCAL);
        this.module.declareVariable(variable);
        call.args[lambdaArg] = variable;
      });
    }

    this.module.addAction(call);

    this.module.startBranch(call);
    this.visitStatement(context.statements());
    this.module.endBranch();
  }

  visitLambdaArguments(
    context: JC.LambdaArgumentsContext | undefined
  ): string[] {
    if (!context) return [];
    return (
      this.visitChildren(context, { flat: false, resolveIdentifiers: false }) ||
      []
    );
  }

  visitBreakStatement() {
    this.module.addAction(Actions.from(codeActions.BREAK, {}));
  }

  // #endregion

  // #region Variables
  visitVariableDeclaration(context: JC.VariableDeclarationContext) {
    let [modifier, name, expression] = this.visitChildren(context, {
      resolveIdentifiers: false,
    });

    if (!expression) {
      expression = name;
      name = modifier;
      modifier = VariableScope.LOCAL;
    }

    const inline = modifier === 'inline';
    if (inline) modifier = VariableScope.LOCAL;

    assertValue(expression);

    const variable = inline
      ? new InlineVariable(name, expression)
      : new Variable(name, modifier);

    this.module.declareVariable(variable);
    this.module.assignVariable(variable, expression);
  }

  visitVariableModifier(context: JC.VariableModifierContext) {
    return (context.GAME() || context.SAVE() || context.INLINE())!.text;
  }
  // #endregion

  // #region Expressions
  visitAdditiveExpression(context: JC.AdditiveExpressionContext) {
    return MathExpression.evaluate(this.visitChildren(context));
  }

  visitMultiplicativeExpression(context: JC.MultiplicativeExpressionContext) {
    return MathExpression.evaluate(this.visitChildren(context));
  }

  visitParenthesizedExpression(context: JC.ParenthesizedExpressionContext) {
    return new ParenthesizedExpression(this.visitChild(context));
  }

  visitExpression(context: JC.ExpressionContext) {
    return new AssignmentExpression(this.visitChildren(context), this.module)
      .value;
  }

  visitPrefixUnaryExpression(context: JC.PrefixUnaryExpressionContext) {
    const operator = context.unaryOperator();
    const expression = this.visitChild(context);

    if (!operator) return expression;

    return new UnaryExpression(
      expression,
      this.visitUnaryOperator(operator),
      this.module,
      false
    ).value;
  }

  visitPostfixUnaryExpression(context: JC.PostfixUnaryExpressionContext) {
    const postfix = context.postfixUnaryOperator();
    const expression = this.visitPostfixUnaryNavigatedExpression(
      context.postfixUnaryNavigatedExpression(),
      !postfix?.callSuffix()
    );

    if (!postfix) {
      if (expression instanceof Internal && 'property' in expression.value) {
        const { property, selection } = expression.value as PropertyReference;

        return new GameValue(property.type, property.id, selection).setStack(
          this.module
        );
      }

      return expression;
    }

    const operator = postfix.unaryOperator();
    if (operator)
      return new UnaryExpression(
        expression,
        this.visitUnaryOperator(operator),
        this.module,
        true
      ).value;

    const access = postfix.arrayAccess();
    if (access) {
      const index = this.visitExpression(access.expression());
      assertNumberValue(index);
      assertVariableValue(expression);

      return new DynamicValue(
        Actions.from(variableActions.LIST_GET, {
          variable: null as unknown as Variable,
          list: expression,
          number: index,
        })
      ).setStack(this.module);
    }

    const call = postfix.callSuffix();
    if (call) {
      const args: Internal<CallArgument>[] = this.visitCallSuffix(call) || [];

      if (typeof expression === 'string') {
        const factory = this.module.resolveFactory(expression);
        if (factory) {
          const argSchema = Object.keys(factory.ctor.args);
          const normalized = normalizeCallArguments(args, argSchema);
          Factory.validate(factory, normalized);

          return factory
            .create(normalized)
            .setNode(context.postfixUnaryNavigatedExpression());
        }

        const mathFunc = MathExpression.parseFunction(
          expression,
          args.map((internal) => internal.value.value)
        );
        if (mathFunc) return mathFunc;

        const func = this.module.resolveFunction(expression);
        if (func) {
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
            this.module.assignVariable(
              variable,
              argument || func.args[idx].defaultValue
            );

            return [variable, key] as [Variable, string];
          });

          const action = func.process
            ? Actions.from(codeActions.START_PROCESS, {
                process_name: new TextConstant(expression),
                local_variables_mode: 'COPY',
              })
            : Actions.from(codeActions.CALL_FUNCTION, {
                function_name: new TextConstant(expression),
              });

          this.module.addAction(action);

          // Устанавливаем после выполнения функции значения для переданных аргументов
          // Это позволяет изменять значения аргументов функции, не меняя
          // их имени или типа
          funcArgs.forEach((funcArg) => {
            if (!funcArg) return;

            const argument = normalized[funcArg[1]];
            if (argument && isVariable(argument))
              this.module.assignVariable(argument, funcArg[0]);
          });

          return new Void().setNode(context);
        }

        this.reporter.reportErrorAt(
          context.postfixUnaryNavigatedExpression(),
          `Неизвестная функция '${expression}'`
        );
      }

      if (expression instanceof Internal && 'action' in expression.value) {
        const { action, origin, selection } = expression.value as ActionCall;
        // Удаляет из схемы аргументов те аргументы, которым устанавливается значение...
        const argSchema = Object.keys(action.arguments).filter((key) => {
          if (isAssigningAction(action)) return key !== action.assigning;
          if (
            isContainingAction(action) &&
            action.containing === ActionContainerType.LAMBDA &&
            !!action.lambda
          )
            return !action.lambda.includes(key);

          return true;
        });

        // ...или из которых оно производится
        const originKey = origin && action.origin;
        if (originKey) argSchema.splice(argSchema.indexOf(originKey), 1);

        if (action.conditional) {
          const _action = Actions.from(action, {}, selection);
          const firstArgument = args[0];
          if (!firstArgument)
            return this.reporter.reportErrorAt(
              call,
              'Не был передан аргумент действия проверки'
            );

          const conditional = (
            firstArgument as Internal<{ value: Value | CodeContainingAction }>
          ).value.value;

          if (args.length > 1)
            return this.reporter.reportErrorAt(
              call,
              `Передано слишком много аргументов (нужно: 1, передано: ${args.length})`
            );

          if (
            !(conditional instanceof CodeContainingAction) ||
            conditional.type !== ActionContainerType.PREDICATE
          )
            return this.reporter.reportErrorAt(
              postfix.callSuffix()?.valueArgument()[0] || call,
              'Данное выражение не может использоваться как действие проверки'
            );

          _action.conditional = conditional;

          if (isContainingAction(action)) {
            // Действия, хранящие операции, должны быть дальше обработаны
            return _action;
          }

          this.module.addAction(_action);
          return new Void().setNode(context);
        }

        const normalized = normalizeCallArguments(args, argSchema);
        const actionArgs = {
          ...normalized,
          ...(originKey ? { [originKey]: origin } : {}),
        };

        if (isContainingAction(action)) {
          // Действия, хранящие операции, должны быть дальше обработаны
          return Actions.from(action, actionArgs, selection);
        }

        if (!isAssigningAction(action)) {
          this.module.addAction(Actions.from(action, actionArgs, selection));

          return new Void().setNode(context);
        }

        return new DynamicValue(Actions.from(action, actionArgs, selection))
          .setStack(this.module)
          .setNode(context);
      }
    }
  }

  visitValueArgument(context: JC.ValueArgumentContext) {
    const identifier = context.identifier();
    const value = this.visitExpression(context.expression());
    if (!identifier)
      return new Internal({
        value,
      }).setNode(context);

    return new Internal({
      name: this.visitIdentifier(identifier, false),
      value,
    }).setNode(context);
  }

  visitPostfixUnaryNavigatedExpression(
    context: JC.PostfixUnaryNavigatedExpressionContext,
    resolveIdentifiers: boolean = true
  ) {
    const identifierWithSelection = context.identifierWithSelection();
    if (!identifierWithSelection)
      return this.visitChildren(context.atomicExpression(), {
        flat: true,
        resolveIdentifiers,
      });

    const expression = this.visitChildren(context.atomicExpression(), {
      flat: true,
      resolveIdentifiers: false,
    });
    const property = this.visitIdentifierWithSelection(identifierWithSelection);

    const dot = context.DOT();
    if (dot) {
      const action = variableObject.actions.get(property.identifier);
      if (!action)
        throw `Неизвестный параметр переменной '${property.identifier}'`;
      if (!('origin' in action))
        throw `Функцию '${property.identifier}' нельзя использовать от переменной`;

      const origin =
        typeof expression === 'string'
          ? this.resolveIdentifier(expression, context.atomicExpression())
          : expression;

      return new Internal({
        action,
        origin,
        selection: property.selection,
      }).setNode(context.atomicExpression());
    }

    const value = this.module.resolveObject(expression);
    if (!value)
      return this.reporter.reportErrorAt(
        context.atomicExpression(),
        `Неизвестный объект '${expression.toString()}'`
      );

    const action = value.actions.get(property.identifier);
    if (action) {
      if (property.selection && !action.selection.includes(property.selection))
        return this.reporter.reportErrorAt(
          context.identifierWithSelection()!.identifier()[1],
          `Неизвестная цель параметра '${property.selection}'`
        );

      return new Internal({
        action,
        selection: property.selection,
      }).setNode(context.atomicExpression());
    }

    const _property = value.properties.get(property.identifier);
    if (_property) {
      if (
        property.selection &&
        !_property.selection.includes(property.selection)
      )
        return this.reporter.reportErrorAt(
          context.identifierWithSelection()!.identifier()[1],
          `Неизвестная цель параметра '${property.selection}'`
        );

      return new Internal({
        property: _property,
        selection: property.selection,
      }).setNode(context.atomicExpression());
    }

    throw `Неизвестный параметр '${property.identifier}'`;
  }
  // #endregion

  // #region Literals
  visitStringLiteral(context: JC.StringLiteralContext) {
    return new TextConstant((this.visitChildren(context) || []).join(''));
  }

  visitSqStringLiteral(context: JC.SqStringLiteralContext) {
    return new TextConstant((this.visitChildren(context) || []).join(''));
  }

  visitStringContent(context: JC.StringContentContext) {
    const reference = context.StringReference();
    if (!reference) return context.StringText()!.text;

    return this.resolveIdentifier(
      reference.text.substring(1),
      context
    ).toString();
  }

  visitSqStringContent(context: JC.SqStringContentContext) {
    const reference = context.SQStringReference();
    if (!reference) return context.SQStringText()!.text;

    return this.resolveIdentifier(
      reference.text.substring(1),
      context
    ).toString();
  }

  visitStringExpression(context: JC.StringExpressionContext) {
    const child: Value = this.visitChild(context);
    return child.toString();
  }

  visitSqStringExpression(context: JC.SqStringExpressionContext) {
    const child: Value = this.visitChild(context);
    return child.toString();
  }

  visitListLiteral(context: JC.ListLiteralContext) {
    const expressions = this.visitChildren(context) || [];
    const type = expressions[0] || new Any();

    return new ArrayConstant(type, expressions);
  }

  visitLiteralConstant(context: JC.LiteralConstantContext) {
    const boolean = context.BooleanLiteral();
    if (boolean) return BooleanConstant.from(boolean.text);

    const number = context.NumberLiteral();
    if (number) return new NumberConstant(+number.text);

    return this.visitChild(context);
  }
  // #endregion

  // #region Identifiers
  visitIdentifier(
    context: JC.IdentifierContext,
    expand = this.options.resolveIdentifiers
  ) {
    const text = (context.Identifier()?.text ||
      this.visitBacktickIdentifierLiteral(
        context.backtickIdentifierLiteral()!
      ))!;

    if (expand) return this.resolveIdentifier(text, context);
    else return text;
  }

  resolveIdentifier(text: string, node: ParserRuleContext): Value {
    const value = this.module.resolveVariable(text);
    if (!value)
      throw this.reporter.reportErrorAt(
        node,
        `Неизвестный идентификатор '${text}'`
      );
    return value;
  }

  visitBacktickIdentifierLiteral(context: JC.BacktickIdentifierLiteralContext) {
    return this.visitChildren(context).join('');
  }

  visitBacktickIdentifierContent(context: JC.BacktickIdentifierContentContext) {
    const reference = context.BacktickReference();
    if (!reference) return context.BacktickIdentifierText()!.text;

    return this.resolveIdentifier(
      reference.text.substring(1),
      context
    ).toString();
  }

  visitBacktickIdentifierExpression(
    context: JC.BacktickIdentifierExpressionContext
  ) {
    const child: Value = this.visitChild(context);
    return child.toString();
  }

  visitIdentifierWithSelection(context: JC.IdentifierWithSelectionContext) {
    const [identifier, selection]: [string, string | undefined] =
      this.visitChildren(context, {
        resolveIdentifiers: false,
      });

    return {
      identifier,
      selection,
    };
  }
  // #endregion

  // #region Operators
  visitUnaryOperator(context: JC.UnaryOperatorContext) {
    return (context.INCR() || context.DECR())!.text;
  }

  visitMultiplicativeOperator(context: JC.MultiplicativeOperatorContext) {
    return (context.DIV() || context.MOD() || context.MULT())!.text;
  }

  visitAdditiveOperator(context: JC.AdditiveOperatorContext) {
    return (context.ADD() || context.SUB())!.text;
  }

  visitAssignmentOperator(context: JC.AssignmentOperatorContext) {
    return (context.ASSIGNMENT() ||
      context.ADD_ASSIGNMENT() ||
      context.SUB_ASSIGNMENT() ||
      context.MULT_ASSIGNMENT() ||
      context.DIV_ASSIGNMENT() ||
      context.MOD_ASSIGNMENT())!.text;
  }
  // #endregion

  // #region Wrappers
  visitString = this.visitChild;
  visitCallSuffix = this.visitChildren;
  visitPostfixUnaryOperator = this.visitChild;
  visitArrayAccess = this.visitChild;
  visitAtomicExpression = this.visitChild;
  visitDeclaration = this.visitChild;
  visitStatement = this.visitChild;
  // #endregion

  // #region Utils
  visitChild<T extends RuleNode>(context: T) {
    return this.visitChildren(context, { flat: true });
  }

  visitChildren(
    node: RuleNode,
    options: Partial<VisitorOptions> = INITIAL_OPTIONS
  ) {
    let level = this.reporter.level;

    if (node instanceof JC.StatementContext) {
      level = this.reporter.level = 0;
      this.reporter.nodes = [];
      this.reporter.statement = node;
    }

    if (node instanceof ParserRuleContext) {
      this.reporter.nodes[level] = node;
      this.reporter.level++;
    }

    const original = { ...this.options };
    this.options = { ...INITIAL_OPTIONS, ...options };

    const visit = () => {
      const value = super.visitChildren(node);
      this.options = original;
      this.reporter.level = level;

      return value;
    };

    if (this.mode.debug) return visit();
    else
      try {
        return visit();
      } catch (e: any) {
        this.reporter.report(e);
      }
  }
  // #endregion
}

export default CodeVisitor;
