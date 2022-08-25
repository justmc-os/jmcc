import path from 'path';
import fs from 'fs';
import markdownTable from 'markdown-table';
import { FlatProperties } from '@js.properties/properties';
import stripAnsi from 'strip-ansi';

import { DOCS_DIR } from '.';
import CodeModule from '../core/jmcc/code/CodeModule';
import NamedObject from '../core/jmcc/code/objects/NamedObject';
import {
  any,
  argumentToString,
  ArgumentType,
  AssigningAction,
  BaseAction,
  ContainingAction,
  isArray,
  isAssigningAction,
  isContainingAction,
  isEnum,
  item,
  location,
  number,
  particle,
  potion,
  sound,
  text,
  variable,
  vector,
} from '../core/jmcc/code/action/defined/Actions';
import { ActionContainerType } from '../core/jmcc/code/action/CodeContainingAction';

const ACTION_PREFIX = 'creative_plus.action.';
const DIR = path.resolve(DOCS_DIR, 'actions');
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR);

const getActions = (object: NamedObject) =>
  object.actions.actions.filter((action) => action.id !== 'else');

const getExampleArgumentType = (argument: ArgumentType): string => {
  if (isEnum(argument)) return `"${argument.enum[0]}"`;
  if (isArray(argument)) {
    const argumentExample = getExampleArgumentType(argument.argument);
    return `[${argumentExample}, ${argumentExample}]`;
  }

  if (argument === number) return '0';
  if (argument === text) return '"текст"';
  if (argument === item) return 'item("stone")';
  if (argument === sound) return 'sound("entity.zombie.hurt")';
  if (argument === particle) return 'particle("fire")';
  if (argument === vector) return 'vector(0, 0, 0)';
  if (argument === location) return 'location(0, 0, 0)';
  if (argument === potion) return 'potion("slow_falling")';
  if (argument === any) return '"любое значение"';
  if (argument === variable) return 'переменная';

  return 'ужасный баг такого никогда не бывает';
};

const getExampleArguments = <
  T extends BaseAction | ContainingAction | AssigningAction
>(
  action: T,
  exclude?: string[]
) => {
  const args = Object.keys(action.arguments).filter(
    (argument) => !exclude?.includes(argument)
  );

  return args
    .map((key) => getExampleArgumentType(action.arguments[key]))
    .join(', ');
};

const getExample = (objectName: string, action: BaseAction) => {
  if (isAssigningAction(action))
    return `
\`\`\`ts
var a = ${objectName}::${action.name}(${getExampleArguments(action, [
      action.assigning,
    ])})${
      action.origin
        ? `

// или от переменной:

var b = ${getExampleArgumentType(action.arguments[action.origin])}
var c = b.${action.name}(${getExampleArguments(action, [
            action.assigning,
            action.origin,
          ])})`
        : ''
    }
\`\`\`
    `.trim();

  if (
    isContainingAction(action) &&
    action.containing === ActionContainerType.LAMBDA
  )
    return `
  \`\`\`ts${
    action.conditional
      ? `
  var a = 1`
      : ''
  }
  ${objectName}::${action.name}(${
      action.conditional
        ? 'a.less(10)'
        : getExampleArguments(action, action.lambda)
    }) { ${
      action.lambda
        ?.map((_, idx) => 'abcdef'[idx])
        .join(', ')
        .concat(' ->') || ''
    }
    player::message("Повторение");
    code::wait(1);
  }

  player::message("Конец повторения");
  \`\`\`
        `.trim();

  if (isContainingAction(action))
    return `
\`\`\`ts
if (${objectName}::${action.name}(${getExampleArguments(action)})) {
  player::message("Условие правдиво")
}${
      action.origin
        ? `

// или от переменной:

var a = ${getExampleArgumentType(action.arguments[action.origin])}
if (a.${action.name}(${getExampleArguments(action, [action.origin])})) {
  player::message("Условие правдиво")
}`
        : ''
    }
\`\`\`
      `.trim();

  return `
\`\`\`ts
${objectName}::${action.name}(${getExampleArguments(action)})${
    action.origin
      ? `

// или от переменной:

var a = ${getExampleArgumentType(action.arguments[action.origin])}
a.${action.name}(${getExampleArguments(action, [action.origin])})`
      : ''
  }
\`\`\`
  `.trim();
};

const generateActionsDocs = async (properties: FlatProperties) => {
  const _objects = CodeModule.OBJECTS.filter(
    (object) => object.name !== 'value'
  );

  const contentTable = _objects
    .map((object) => {
      return `
- **[${object.name}](./${object.name})**
  ${getActions(object)
    .map(
      (action) =>
        `- [*:: ${action.name}() [ ${
          properties[`${ACTION_PREFIX}${action.id}.name`]
        } ]*](./${object.name}#${action.id})`
    )
    .join('\n  ')}
    `.trim();
    })
    .join('\n');

  _objects.forEach((object) => {
    const actions = getActions(object);

    const actionsText = actions
      .map((action) => {
        const args = action.arguments;
        const entries = Object.entries(args);

        return `
<h3 id=${action.id}>
  <code>${object.name}::${action.name}</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** ${properties[`${ACTION_PREFIX}${action.id}.name`]}\\
**Тип:** ${
          isAssigningAction(action)
            ? 'Действие, устанавливающее значение'
            : isContainingAction(action) &&
              action.containing === ActionContainerType.PREDICATE
            ? 'Действие, проверяющее условие'
            : 'Действие без значения'
        }\\
**Пример использования:**
${getExample(object.name, action)}

${entries.length > 0 ? '**Аргументы:**' : '**Без аргументов**'}
${
  entries.length > 0
    ? markdownTable([
        ['**Имя**', '**Тип**', '**Описание**'],
        ...entries.map(([key, value]) => {
          const name =
            properties[`${ACTION_PREFIX}${action.id}.argument.${key}.name`];

          if (!isEnum(value))
            return [`\`${key}\``, stripAnsi(argumentToString(value)), name];

          return [
            `\`${key}\``,
            `
перечисление:<br/>${value.enum
              .map((member: string) => {
                const memberName =
                  properties[
                    `${ACTION_PREFIX}${
                      action.id
                    }.argument.${key}.enum.${member.toLowerCase()}.name`
                  ];
                return `**${member}** - ${memberName}`;
              })
              .join('<br/>')}

`.trim(),
            name,
          ];
        }),
      ])
    : ''
}
        `.trim();
      })
      .join('\n');

    const text = `
<h2 id=${object.name}>
  <code>${object.name}</code>
  <a href="./actions" style="font-size: 14px; margin-left:">↩️</a>
</h2>

${actionsText}
    `.trim();

    fs.writeFileSync(path.resolve(DIR, `${object.name}.md`), text, {
      encoding: 'utf-8',
    });
  });

  const result = `
## Действия

Пример использования:

\`\`\`ts
player::message("hello!");

var a = 1.3
if (a.in_range(1, 2)) {
  player::message("
    Переменная \`a\` находится
    в границе от 1 до 2!
  ")
};
\`\`\`

Список действий:

${contentTable}`.trim();

  fs.writeFileSync(path.resolve(DIR, 'actions.md'), result, {
    encoding: 'utf8',
  });
};

export default generateActionsDocs;
