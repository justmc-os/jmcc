import { CValue } from '../Value';

class TextConstant extends CValue('text', 'текст') {
  constructor(public text: string) {
    super();
  }

  toString(): string {
    return this.text;
  }

  toJson(): object {
    return {
      ...super.toJson(),
      text: this.text,
    };
  }
}

export default TextConstant;
