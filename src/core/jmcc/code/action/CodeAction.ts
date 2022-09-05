import { Value } from '../../value/Value';
import CodeBlock from '../CodeBlock';

export type CodeActionArguments = {
  [key: string]: Value;
};

abstract class CodeAction extends CodeBlock {
  /**
   * Длина действия в строчке кода
   */
  static LENGTH = 1;

  get length() {
    return CodeAction.LENGTH;
  }

  constructor(
    public id: string,
    public args: CodeActionArguments = {},
    public origin?: string,
    public selection: string | null = null,
    public conditional?: CodeAction
  ) {
    super();
  }

  valuesToJson() {
    return Object.keys(this.args).map((key) => ({
      name: key,
      value: this.args[key].toJson(),
    }));
  }

  toJson() {
    const selection = this.selection
      ? {
          selection: {
            type: this.selection,
          },
        }
      : {};

    const conditional: object = this.conditional
      ? {
          conditional: this.conditional.toJson(),
          values: this.conditional.valuesToJson(),
        }
      : {};

    return {
      action: this.id,
      values: this.valuesToJson(),
      ...selection,
      ...conditional,
    };
  }
}

export default CodeAction;
