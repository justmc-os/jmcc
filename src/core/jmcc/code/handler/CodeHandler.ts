import CodeBlock from '../CodeBlock';
import CodeAction from '../action/CodeAction';
import Variable from '../../value/Variable';

abstract class CodeHandler extends CodeBlock {
  /**
   * Максимальная длина строчки кода
   */
  static MAX_LENGTH = 43;
  static _naive_position = 0;

  public actions: CodeAction[] = [];
  public localVariables: Variable[] = [];
  public position: number = CodeHandler._naive_position++;

  get length() {
    return this.actions.reduce((acc, v) => acc + v.length, 0);
  }

  constructor(public type: string) {
    super();
  }

  toJson(): object {
    return {
      type: this.type,
      position: this.position,
      operations: this.actions.map((action) => action.toJson()),
    };
  }

  static is(value: any): value is CodeHandler {
    return 'position' in value;
  }
}

export default CodeHandler;
