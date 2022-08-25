import CodeHandler from './CodeHandler';

class CodeEvent extends CodeHandler {
  constructor(public event: string) {
    super('event');
  }

  toJson(): object {
    return {
      ...super.toJson(),
      event: this.event,
    };
  }

  static EVENTS: string[] = [];
}

export default CodeEvent;
