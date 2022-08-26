import Actions, {
  ActionArgumentsFromAction,
} from '../code/action/defined/Actions';
import variableActions from '../code/action/defined/VariableActions';
import CodeModule from '../code/CodeModule';
import { assertNumberValue, assertVariableValue } from '../utils';
import { DynamicValue } from '../value/DynamicValue';
import { Value } from '../value/Value';
import Variable from '../value/Variable';

enum AssignmentOperator {
  ASSIGNMENT = '=',
  ADD_ASSIGNMENT = '+=',
  SUB_ASSIGNMENT = '-=',
  MULT_ASSIGNMENT = '*=',
  DIV_ASSIGNMENT = '/=',
  MOD_ASSIGNMENT = '%=',
}

class AssignmentExpression {
  public value: Value;

  constructor(expression: (string | Value)[], module: CodeModule) {
    this.value = this.evaluate(expression, module);
  }

  evaluate(expression: (string | Value)[], module: CodeModule) {
    const value = expression[0] as Value;
    if (expression.length === 1) return value;

    let currentValue = expression[expression.length - 1] as Value;
    // Начинаем с предпоследнего элемента массива, и проходим по каждому
    // оператору и значению до его начала
    for (let i = expression.length - 2; i >= 0; i--) {
      const operator = expression[i] as string;
      const variable = expression[--i] as Value;

      if (variable instanceof DynamicValue) {
        currentValue = this.assignDynamicValue(variable, currentValue, module);
        continue;
      }

      assertVariableValue(variable);

      if (operator === AssignmentOperator.ASSIGNMENT) {
        module.assignVariable(variable, currentValue);
        currentValue = variable;
        continue;
      }

      // Все остальные действия требуют чтобы значение было числовым
      assertNumberValue(currentValue);

      if (operator === AssignmentOperator.ADD_ASSIGNMENT)
        module.addAction(
          Actions.from(variableActions.INCREMENT, {
            variable,
            number: currentValue,
          })
        );

      if (operator === AssignmentOperator.SUB_ASSIGNMENT)
        module.addAction(
          Actions.from(variableActions.DECREMENT, {
            variable,
            number: currentValue,
          })
        );

      if (operator === AssignmentOperator.MULT_ASSIGNMENT)
        module.addAction(
          Actions.from(variableActions.MULTIPLY, {
            variable,
            value: [variable, currentValue],
          })
        );

      if (operator === AssignmentOperator.DIV_ASSIGNMENT)
        module.addAction(
          Actions.from(variableActions.DIVIDE, {
            variable,
            value: [variable, currentValue],
          })
        );

      if (operator === AssignmentOperator.MOD_ASSIGNMENT)
        module.addAction(
          Actions.from(variableActions.REMAINDER, {
            variable,
            dividend: variable,
            divisor: currentValue,
          })
        );

      currentValue = variable;
    }

    return currentValue;
  }

  /**
   * Устанавливает значение динамическому выражению
   */
  assignDynamicValue(
    value: DynamicValue,
    expression: Value,
    module: CodeModule
  ) {
    // Если выражение равно получению значения из списка
    if (value.action.id === variableActions.LIST_GET.id) {
      const args = value.action.args as ActionArgumentsFromAction<
        typeof variableActions['LIST_GET']['arguments']
      >;

      value.action = Actions.from(variableActions.SET_AT, {
        variable: args.list,
        list: args.list,
        number: args.number,
        value: expression,
      });

      module.addAction(value.action);
    }

    return value.toVariable();
  }
}

export default AssignmentExpression;
