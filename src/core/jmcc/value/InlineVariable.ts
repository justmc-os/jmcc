import { Value } from './Value';
import Variable, { VariableScope } from './Variable';

class InlineVariable extends Variable {
  constructor(name: string, public value: Value) {
    super(name, VariableScope.GAME);
  }
}

export default InlineVariable;
