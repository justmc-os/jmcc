import path from 'path';
import fs from 'fs';
import markdownTable from 'markdown-table';
import stripAnsi from 'strip-ansi';
import { FlatProperties } from '@js.properties/properties';

import { DOCS_DIR } from '.';
import { argumentToString } from '../core/jmcc/code/action/defined/Actions';
import CodeModule from '../core/jmcc/code/CodeModule';

const FILE = path.resolve(DOCS_DIR, 'factories.md');
const FACTORY_PREFIX = 'creative_plus.argument.';

const generateFactoriesDocs = async (properties: FlatProperties) => {
  const table = markdownTable([
    ['**Имя**', '**Название**', '**Аргументы**'],
    ...CodeModule.FACTORIES.map((factory) => {
      const name =
        properties[`${FACTORY_PREFIX}${factory.ctor.identifier}.name`];

      const args = Object.entries(factory.ctor.args)
        .map(
          ([key, argument]) =>
            `\`${key}\`: ${stripAnsi(argumentToString(argument)).replace(
              '?',
              '<b>?</b>'
            )}`
        )
        .join(', ');

      return [`\`${factory.ctor.identifier}()\``, name, `(${args})`];
    }),
  ]);

  const result = `
## Фабрики

Пример использования:
\`\`\`ts
var a = location(1, 2, 3);
var b = vector(1, 2, 3);
var c = item("stone");
\`\`\`

### Типы фабрик

Аргументы показывают на типы значений, которые вы должны передать фабрики для получения значения.
Те аргументы, которые заканчиваются на \`?\`, указывать не обязательно.

${table}

`.trim();

  fs.writeFileSync(FILE, result, { encoding: 'utf8' });
};

export default generateFactoriesDocs;
