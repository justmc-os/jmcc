import CValue from './Value';

export enum VariableScope {
  LOCAL = 'local',
  GAME = 'game',
  SAVE = 'save',
}

class Variable extends CValue('variable', 'переменная') {
  constructor(public name: string, public scope: VariableScope) {
    super();
  }

  toString() {
    if (this.scope === VariableScope.GAME) return `%var(${this.name})`;

    return `%var_${this.scope}(${this.name})`;
  }

  toJson() {
    return {
      ...super.toJson(),
      variable: this.name,
      scope: this.scope,
    };
  }

  static normalizeName(text: string) {
    return text.replace(
      /(%var(?:_local|_save)?\(.*\))|(%.*%)/g,
      '[placeholder]'
    );
  }
}

export default Variable;
