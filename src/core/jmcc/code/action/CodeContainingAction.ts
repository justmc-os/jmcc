import Variable from '../../value/Variable';
import CodeAction, { CodeActionArguments } from './CodeAction';

export enum ActionContainerType {
  BASE = 'base',
  LAMBDA = 'lambda',
  PREDICATE = 'predicate',
}

class CodeContainingAction extends CodeAction {
  /**
   * Длина действия со скобками
   * Скобки занимают дополнительный блок, поэтому длина равна 2.
   */
  static LENGTH = 2;

  public actions: CodeAction[] = [];
  public localVariables: Variable[] = [];
  public isInverted: boolean = false;

  constructor(
    action: string,
    public type: ActionContainerType,
    public lambda?: string[],
    args: CodeActionArguments = {},
    origin?: string,
    selection: string | null = null
  ) {
    super(action, args, origin, selection);
  }

  get length() {
    return this.actions.reduce(
      (acc, v) => acc + v.length,
      CodeContainingAction.LENGTH
    );
  }

  toJson() {
    return {
      ...super.toJson(),
      is_inverted: this.isInverted,
      operations: this.actions.map((action) => action.toJson()),
    };
  }
}

export default CodeContainingAction;
