import path from 'path';
import fs from 'fs';
import markdownTable from 'markdown-table';
import { FlatProperties } from '@js.properties/properties';

import { DOCS_DIR } from '.';
import CodeEvent from '../core/jmcc/code/handler/CodeEvent';

const FILE = path.resolve(DOCS_DIR, 'events.md');
const EVENT_PREFIX = 'creative_plus.trigger.';

const generateEventsDocs = async (properties: FlatProperties) => {
  const table = markdownTable([
    ['**Имя**', '**Название**'],
    ...CodeEvent.EVENTS.map((event) => {
      const description = properties[`${EVENT_PREFIX}${event}.name`];

      return [`\`event<${event}>\``, description];
    }),
  ]);

  const result = `
## События

Пример использования:
\`\`\`ts
event<player_join> {
  player::message("Приветствую в мире!")
}
\`\`\`

${table}

`.trim();

  fs.writeFileSync(FILE, result, { encoding: 'utf8' });
};

export default generateEventsDocs;
