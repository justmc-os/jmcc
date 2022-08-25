import CodeAssigningAction from '../code/action/CodeAssigningAction';
import Variable, { VariableScope } from './Variable';
import CodeModule from '../code/CodeModule';
import CValue from './Value';

export class DynamicValue extends CValue('dynamic', 'динамическое значение') {
  public action: CodeAssigningAction;
  static id = 0;

  constructor(action: CodeAssigningAction) {
    super();
    this.action = action;
  }

  private module!: CodeModule;
  setStack(module: CodeModule) {
    this.module = module;
    return this;
  }

  private declared: Variable | null = null;
  toVariable(): Variable {
    if (this.declared) return this.declared;
    const assigned = this.action.args[this.action.assigning];
    if (assigned && assigned instanceof Variable) return assigned;

    const variable = new Variable(
      DynamicValue.getNextName(),
      VariableScope.LOCAL
    );

    this.module.declareVariable(variable);
    this.declared = variable;
    this.action.args[this.action.assigning] = variable;
    this.module.addAction(this.action);

    return variable;
  }

  assignTo(variable: Variable): void {
    if (!this.declared) this.toVariable();

    const index = this.module.actions.indexOf(this.action);
    this.module.actions[index].args[this.action.assigning] = variable;
  }

  toString(): string {
    return this.toVariable().toString();
  }

  static getNextName() {
    return `jmcc.${DynamicValue.id++}`;
  }
}

export const CDynamicValue = (type: string, text: string) => {
  return class extends DynamicValue {
    static type: string = type;
    static text: string = text;
  };
};

export default CDynamicValue;
