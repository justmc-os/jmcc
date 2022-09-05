import { ParserRuleContext } from 'antlr4ts';
import { Interval } from 'antlr4ts/misc/Interval';
import chalk from 'chalk';

import { ParseMode } from '..';
import ErrorTraceable, {
  ParsingError,
  SourceParsingError,
  TracedParsingError,
} from './ErrorTraceable';

const reportTypes = {
  WARNING: {
    color: chalk.bgYellow.black,
    text: 'Предупреждение',
  },
  ERROR: {
    color: chalk.bgRed.black,
    text: 'Ошибка',
  },
};

type ReportType = keyof typeof reportTypes;

class Reporter {
  constructor(private mode: ParseMode) {}

  public statement?: ParserRuleContext = undefined;
  public nodes: ParserRuleContext[] = [];
  public level: number = 0;

  private thrown: ParsingError | null = null;

  report(error: string | ParsingError) {
    const node =
      error instanceof TracedParsingError
        ? error.traced.node || this.getCurrentNode()
        : this.getCurrentNode();
    if (!node) return;
    if (this.thrown) throw this.thrown;
    const nodeLine = node.start.line;
    const char = node.start.charPositionInLine;

    if (this.mode.inline) {
      throw new SourceParsingError(error.toString(), nodeLine, char);
    }

    this.reportTemplate(node, error.toString(), 'ERROR');
    process.exit(1);
  }

  reportErrorAt(node: ParserRuleContext, error: string) {
    throw new TracedParsingError(
      new (class extends ErrorTraceable {})().setNode(node),
      error
    );
  }

  reportWarningAt(node: ParserRuleContext, warning: string) {
    this.reportTemplate(node, warning, 'WARNING');
  }

  private reportTemplate(
    node: ParserRuleContext,
    text: string,
    type: ReportType
  ) {
    const statement = this.statement;
    if (!statement || !node) return;

    const statementText = this.getFullText(statement).split('\n');
    const statementLine = statement.start.line;
    const nodeLine = node.start.line;
    const char = node.start.charPositionInLine;

    console.log(
      `${chalk.gray('В файле')} ${chalk.blueBright(
        this.mode.path.replace('./', '')
      )}:${chalk.yellow(nodeLine)}:${chalk.yellow(char)} `
    );
    console.log();

    const maxLine = nodeLine.toString().length;
    const nodeText = statementText[nodeLine - statementLine].trim();
    console.log(
      this.getLineText(maxLine, nodeLine),
      ' '.repeat(
        statementLine === nodeLine ? statement.start.charPositionInLine : char
      ) + nodeText
    );
    console.log(
      this.getLineText(maxLine),
      ' '.repeat(char) +
        chalk.redBright(
          '~'.repeat(
            statementLine === nodeLine
              ? this.getFullText(node).length
              : nodeText.length
          )
        )
    );

    console.log();
    console.log(
      reportTypes[type].color(` ${reportTypes[type].text} `),
      chalk.gray(text)
    );
  }

  private getLineText(maxLineLength: number, line?: number) {
    const text = ` ${line ?? '~'} `;

    return chalk.bgWhite.black(
      ' '.repeat(maxLineLength - (text.length - 2)) + text
    );
  }

  private getCurrentNode() {
    return this.nodes[this.level] || this.nodes[this.level - 1];
  }

  private getFullText(node: ParserRuleContext) {
    const start = node.start.startIndex;
    const end = node.stop?.stopIndex;
    const stream = node.start.inputStream;

    if (!end || !stream || start < 0 || end < 0) return node.text;

    return stream.getText(Interval.of(start, end));
  }
}

export default Reporter;
