import { ParserRuleContext } from 'antlr4ts';

abstract class ErrorTraceable {
  /**
   * Нода парсера, которая создала это значение
   */
  public node: ParserRuleContext | undefined;

  /**
   * Выражение парсера, которое создало это значение
   */
  public statement: ParserRuleContext | undefined;

  setNode(node: ParserRuleContext) {
    this.node = node;

    return this;
  }

  setStatement(statement: ParserRuleContext) {
    this.statement = statement;

    return this;
  }
}

export abstract class ParsingError extends Error {}

export class SourceParsingError extends ParsingError {
  constructor(message: string, public line: number, public char: number) {
    super(message);

    Object.setPrototypeOf(this, SourceParsingError.prototype);
  }

  toString() {
    return this.message;
  }
}

export class TracedParsingError extends Error {
  constructor(public traced: ErrorTraceable, message: string) {
    super(message);

    Object.setPrototypeOf(this, TracedParsingError.prototype);
  }

  toString() {
    return this.message;
  }
}

export default ErrorTraceable;
