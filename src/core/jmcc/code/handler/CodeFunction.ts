import CodeHandler from './CodeHandler';

class CodeFunction extends CodeHandler {
  public isHidden = false;

  constructor(public name: string) {
    super('function');
  }

  toJson(): object {
    return {
      ...super.toJson(),
      is_hidden: this.isHidden,
      name: this.name,
    };
  }
}

export default CodeFunction;
