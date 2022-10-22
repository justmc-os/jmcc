import path from 'path';
import fs from 'fs';
import markdownTable from 'markdown-table';
import stripAnsi from 'strip-ansi';
import { FlatProperties } from '@js.properties/properties';

import { DOCS_DIR } from '.';
import { argumentToString } from '../core/jmcc/code/action/defined/Actions';
import gameValues from '../core/jmcc/code/properties/GameValues';

const FILE = path.resolve(DOCS_DIR, 'properties.md');
const GAME_VALUE_PREFIX = 'creative_plus.game_value.';
const SELECTION_PREFIX = 'creative_plus.game_value.selection.';

const generateGameValueDocs = async (properties: FlatProperties) => {
  const selectionTable = markdownTable([
    ['**Имя**', '**Описание**'],
    ...gameValues.selection.map((selector) => {
      const description = properties[`${SELECTION_PREFIX}${selector}.name`];
      return [`\`<${selector}>\``, description];
    }),
  ]);

  const table = markdownTable([
    ['**Имя**', '**Тип**', '**Описание**'],
    ...gameValues.properties.map((property) => {
      const description = properties[`${GAME_VALUE_PREFIX}${property.id}.name`];

      return [
        `\`value::${property.name}\``,
        stripAnsi(argumentToString(property.type)),
        description,
      ];
    }),
  ]);

  const result = `
## Игровые значения

Пример использования:
\`\`\`ts
var a = value::location
var b = value::health<default_entity>
\`\`\`

### Доступные селекторы

**Важно:** эти селекторы доступны только для игровых значений.\
Действия имеют свои собственные селекторы, которые вы должны смотреть на их страницах.

${selectionTable}

### Значения

${table}

`.trim();

  fs.writeFileSync(FILE, result, { encoding: 'utf8' });
};

export default generateGameValueDocs;
