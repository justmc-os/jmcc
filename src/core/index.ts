import { CharStreams, CommonTokenStream } from 'antlr4ts';
import * as fs from 'fs';
import path from 'path';
import minecraftData, { IndexedData, Particle } from 'minecraft-data';

type FullIndexedData = IndexedData & {
  particles: Particle[];
  particlesByName: { [name: string]: Particle };
};

export const data = minecraftData('1.18') as FullIndexedData;

import CodeVisitor from './jmcc/CodeVisitor';
import { JustCodeLexer } from './grammar/.compiled/JustCodeLexer';
import { JustCodeParser } from './grammar/.compiled/JustCodeParser';
import bootstrap from './jmcc/Bootstrap';

export type ParseMode = {
  path: string;
  inline?: boolean;
  debug?: boolean;
};

const INLINE_PATH = path.resolve(process.cwd(), '[inline]');

class JMCC {
  public stack: string[] = [];

  constructor() {
    bootstrap.loadLocal();
  }

  compile(
    source: string,
    initial: boolean = false,
    mode: ParseMode = { path: INLINE_PATH, inline: true }
  ) {
    if (initial) {
      this.stack = [mode.path];
      bootstrap.reload();
    }

    const inputStream = CharStreams.fromString(source);
    const lexer = new JustCodeLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new JustCodeParser(tokenStream);

    const tree = parser.file();

    const visitor = new CodeVisitor(mode, this, [...this.stack]);
    visitor.visit(tree);

    return visitor.module;
  }

  compileToJson(
    source: string,
    mode: ParseMode = { path: INLINE_PATH, inline: true }
  ) {
    return this.compile(source, true, mode).toJson();
  }

  compileFile(
    filePath: string,
    initial: boolean = false,
    options = { debug: false }
  ) {
    const source = fs.readFileSync(filePath, { encoding: 'utf-8' });

    return this.compile(source, initial, {
      path: path.relative(process.cwd(), filePath),
      debug: options.debug,
    });
  }

  compileFileToJson(filePath: string, options = { debug: false }) {
    return this.compileFile(filePath, true, options).toJson();
  }

  import(filePath: string, mode: ParseMode) {
    const file = this.resolveFile(mode.path, `../${filePath}`);
    if (this.stack.includes(file)) throw 'Circular import';
    this.stack.push(file);

    const other = this.compileFile(file, false, {
      debug: mode.debug ?? false,
    });

    return other;
  }

  resolveFile(fromFile: string, filePath: string) {
    const resolved =
      this.fileExists(path.resolve(fromFile, filePath)) ||
      this.fileExists(path.resolve(fromFile, `${filePath}.jc`));

    if (!resolved) throw `Файл по указанном пути не найден`;

    return resolved;
  }

  private fileExists(_path: string): string | false {
    try {
      const stat = fs.lstatSync(_path);
      return stat.isFile() ? _path : false;
    } catch (e) {
      return false;
    }
  }
}

export default JMCC;
