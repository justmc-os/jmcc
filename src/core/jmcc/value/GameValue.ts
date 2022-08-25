import chalk from 'chalk';

import Actions, {
  ArgumentType,
  argumentToString,
} from '../code/action/defined/Actions';
import CodeAssigningAction from '../code/action/CodeAssigningAction';
import variableActions from '../code/action/defined/VariableActions';
import CDynamicValue from './DynamicValue';
import Variable from './Variable';

export class GameValue<T extends ArgumentType> extends CDynamicValue(
  'game_value',
  'игровое значение'
) {
  static DEFAULT_SELECTION = 'default';

  constructor(
    public type: T,
    public value: string,
    public selection: string = GameValue.DEFAULT_SELECTION
  ) {
    super(null as unknown as CodeAssigningAction);

    this.action = Actions.from(variableActions.SET, {
      variable: null as unknown as Variable,
      value: this,
    });
  }

  toDebug(): string {
    return chalk.cyan`игровое значение (${argumentToString(this.type)})`;
  }

  toJson(): object {
    return {
      ...super.toJson(),
      game_value: this.value,
      // Зачем-то значение селектора встраивается как строка
      selection: JSON.stringify({
        type: this.selection,
      }),
    };
  }
}

export default GameValue;
