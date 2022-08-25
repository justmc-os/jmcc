import CodeHandler from './CodeHandler';

class CodeProcess extends CodeHandler {
  public isHidden = false;

  constructor(public name: string) {
    super('process');
  }

  toJson(): object {
    return {
      ...super.toJson(),
      is_hidden: this.isHidden,
      name: this.name,
    };
  }
}

export default CodeProcess;
