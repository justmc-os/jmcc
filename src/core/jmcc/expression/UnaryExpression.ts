import { Value } from '../value/Value';
import CodeModule from '../code/CodeModule';
import Variable from '../value/Variable';
import Actions from '../code/action/defined/Actions';
import variableActions from '../code/action/defined/VariableActions';
import { assertVariableValue } from '../utils';
import NumberConstant from '../value/constants/NumberConstant';

enum UnaryOperator {
  INCR = '++',
  DECR = '--',
}

class UnaryExpression {
  public value: Variable | UnaryExpression;

  constructor(
    expression: Value,
    operator: string,
    module: CodeModule,
    postfix: boolean
  ) {
    assertVariableValue(expression);
    this.value = this.evaluate(expression, operator, module, postfix);
  }

  evaluate(
    expression: Variable,
    operator: string,
    module: CodeModule,
    postfix: boolean
  ): Variable | UnaryExpression {
    const actionType =
      operator === UnaryOperator.INCR
        ? variableActions.INCREMENT
        : variableActions.DECREMENT;

    const action = Actions.from(actionType, {
      variable: expression,
      number: new NumberConstant(1),
    });

    // Если унарная функция постфиксальная, то добавляем
    // действие в стек поздних действий
    if (postfix) module.lateActions.push(action);
    else module.addAction(action);

    return expression as Variable;
  }
}

export default UnaryExpression;
