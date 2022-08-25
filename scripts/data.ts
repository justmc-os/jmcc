/**
 * Генератор данных
 */

import 'dotenv/config';

import path from 'path';
import fs from 'fs';
import { Gitlab } from '@gitbeaker/node';
import chalk from 'chalk';

import { ActionData, ActionDataArgument } from '../data/action';

type ActionDataEnum = {
  name: string;
  values: string[];
};

const PROJECT_ID = 21858804;
const API = new Gitlab({
  token: process.env.GITLAB_TOKEN,
  requestTimeout: 10_000,
});

const DATA_DIR = path.resolve(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const EVENTS_FILE = path.resolve(DATA_DIR, 'events.json');
const EVENTS_PATH =
  'justmc-creative-plus/src/main/kotlin/ru/justmc/creativeplus/core/trigger/Triggers.kt';

const GAME_VALUES_FILE = path.resolve(DATA_DIR, 'values.json');
const GAME_VALUES_PATH =
  'justmc-creative-plus/src/main/kotlin/ru/justmc/creativeplus/core/value/GameValue.kt';

const ACTIONS_FILE = path.resolve(DATA_DIR, 'actions.json');
const IGNORED_ACTIONS = [
  'Actions.kt',
  'EmptyAction.kt',
  'DummyAction.kt',
  'SetVariableParseNumberFromTextAction.kt',
];
const ACTIONS_PATH =
  'justmc-creative-plus/src/main/kotlin/ru/justmc/creativeplus/action';

const ENUM_MAP = path.resolve(DATA_DIR, 'enum.map.json');
const enumMap = JSON.parse(
  fs.readFileSync(ENUM_MAP, { encoding: 'utf-8' })
) as {
  [key: string]: string[];
};
const ACTIONS_MAP = path.resolve(DATA_DIR, 'actions.map.json');
const actionsMap = JSON.parse(
  fs.readFileSync(ACTIONS_MAP, { encoding: 'utf-8' })
) as {
  [key: string]: {
    assigning?: string;
    origin?: string;
  };
};
const GAME_VALUES_MAP = path.resolve(DATA_DIR, 'values.map.json');
const gameValuesMap = JSON.parse(
  fs.readFileSync(GAME_VALUES_MAP, { encoding: 'utf-8' })
) as {
  [key: string]: {
    assigning?: string;
    origin?: string;
  };
};

const GAME_VALUE_REGEX =
  /val\s*[A-Z_]+\s*=\s*register\("(.*)",\s*ValueTypes.([A-Z_a-z]*)/gm;

const STRING_REGEX = /"(.*)"/;
const STRING_GLOBAL_REGEX = /"(.*)"/g;
const PARSING_SLOTS_REGEX = /(?:\(?([\d]+)\.\.([\d]+)\)?)|([\d]+)/g;

const COMMENT_REGEX = /\/\/.*/g;
const ARGS_REGEX =
  /by (.*)\("(.*?)"(?:(?:,\s*(false))|(?:.*))\)(?:.|\n)*?parsing\s*=\s*(.*)/g;

const ENUM_TYPE_REGEX = /enum<(.*)>/;
const ENUM_REGEX = /enum\s*?class\s*(.*?)(?:\(.*?\))?\s*\{(.*?)\}(?!\))/gms;
const ENUM_MEMBER_REGEX = /(?:(?:^|,)\s*)(?:\b([A-Z_][\w]*)\b(?:\(.*?\))?)/gm;

const ACTION_PREFIXES = {
  player: 'player',
  if_player: 'player',
  entity: 'entity',
  if_entity: 'entity',
  game: 'world',
  if_game: 'world',
  set_variable: 'variable',
  if_variable: 'variable',
  select: 'select',
  control: 'code',
  repeat: 'repeat',
};

const info = (text: string) => console.log(chalk.blue('info'), text);
const success = (text: string) => console.log(chalk.green('success'), text);
const error = (text: string) => console.log(chalk.red('error'), text);

const toJson = (any: any) => JSON.stringify(any, null, 2);
const getFile = async (path: string) => {
  return await API.RepositoryFiles.showRaw(PROJECT_ID, path);
};

const getArgumentType = (type: string) => {
  if (
    ['float', 'double', 'int', 'long', 'decimal'].some((number) =>
      type.startsWith(number)
    )
  )
    return 'number';
  if (type.startsWith('item')) return 'item';
  if (type.startsWith('block')) return 'item';
  if (type.startsWith('array')) return 'variable';
  if (type.startsWith('map')) return 'variable';
  if (type.startsWith('variable')) return 'variable';
  if (type.startsWith('string')) return 'text';
  if (type.startsWith('location')) return 'location';
  if (type.startsWith('vector')) return 'vector';
  if (type.startsWith('sound')) return 'sound';
  if (type.startsWith('particle')) return 'particle';
  if (type.startsWith('potion')) return 'potion';
  if (type.startsWith('enum')) return 'enum';
  if (type.startsWith('boolean')) return 'boolean';
  if (type.startsWith('any')) return 'any';
};

const getActionName = (id: string) => {
  const prefix = Object.keys(ACTION_PREFIXES).find((prefix) =>
    id.startsWith(prefix)
  );

  if (!prefix)
    return {
      name: id,
      object: 'code',
    };

  return {
    name: id.replace(`${prefix}_`, ''),
    object: ACTION_PREFIXES[prefix] as string,
  };
};

const getActionEnums = (source: string) => {
  const enumMatches = Array.from(source.matchAll(ENUM_REGEX));

  const enums = enumMatches.map(
    ([, name, body]) =>
      ({
        name,
        values: Array.from(body.split(';')[0].matchAll(ENUM_MEMBER_REGEX)).map(
          ([, match]) => match
        ),
      } as ActionDataEnum)
  );

  return enums;
};

const getArgument = (
  file: string,
  enums: ActionDataEnum[],
  [, type, name, defaultBooleanValue, parsing]: RegExpMatchArray
) => {
  const argumentType = getArgumentType(type);
  const result: ActionDataArgument = {
    type: argumentType,
    name,
  };

  if (defaultBooleanValue !== undefined) result.defaultBooleanValue = false;
  if (type.endsWith('List')) {
    result.array = true;

    result.length = Array.from(parsing.matchAll(PARSING_SLOTS_REGEX)).reduce(
      (acc, [_, number, other]) => acc + (other ? +other - +number + 1 : 1),
      0
    );
  }

  if (argumentType === 'enum') {
    const enumName = type.match(ENUM_TYPE_REGEX)[1];
    const enumValue =
      enums.find((_enum) => _enum.name === enumName)?.values ||
      enumMap[Object.keys(enumMap).find((key) => key === enumName)];

    if (!enumValue) {
      error(`Не смог найти значение для перечисления ${enumName} в ${file}`);
      return result;
    }

    result.enum = enumValue;
  }

  return result;
};

(async () => {
  info('Загружаю события...');

  const eventsFile = await getFile(EVENTS_PATH);
  const events = Array.from(eventsFile.matchAll(STRING_GLOBAL_REGEX))
    .map(([, match]) => match)
    .filter((event) => !event.includes('dummy'));

  fs.writeFileSync(EVENTS_FILE, toJson(events), {
    encoding: 'utf-8',
  });

  info('Загружаю игровые значения...');

  const gameValueFile = await getFile(GAME_VALUES_PATH);
  const gameValues = Array.from<string[]>(
    gameValueFile.matchAll(GAME_VALUE_REGEX)
  ).map(([, id, type]) => [id, type.toLowerCase()] as const);

  const gameValuesData = gameValues.map(([id, type]) => {
    const result = {
      id,
      type,
      name: id,
      ...gameValuesMap[id],
    };

    if (['array', 'map'].includes(type) && !gameValuesMap[id])
      error(`Не найден подробный тип ${id}`);

    return result;
  });

  fs.writeFileSync(GAME_VALUES_FILE, toJson(gameValuesData), {
    encoding: 'utf-8',
  });

  info('Загружаю действия...');

  const actionFiles = (
    await API.Repositories.tree(PROJECT_ID, {
      path: ACTIONS_PATH,
      recursive: true,
    })
  ).filter(
    (file) =>
      file.type === 'blob' &&
      !IGNORED_ACTIONS.some((ignored) => file.path.endsWith(ignored))
  );

  info('Загружаю файлы действий...');

  const actions = (
    await Promise.all(actionFiles.map((file) => getFile(file.path)))
  ).map((file) => file.replace(COMMENT_REGEX, ''));

  info('Загружаю данные действий...');

  const actionsData = actions.map((action, idx) => {
    const id = action.match(STRING_REGEX)[1];
    const { name, object } = getActionName(id);
    const enums = getActionEnums(action);
    const args = Array.from(action.matchAll(ARGS_REGEX)).map((matches) =>
      getArgument(actionFiles[idx].name, enums, matches)
    );

    let result: ActionData = {
      id,
      name,
      object,
      args,
    };

    if (id.startsWith('repeat')) result.containing = 'lambda';
    if (id.startsWith('else')) result.containing = 'base';
    if (id.startsWith('if')) result.containing = 'predicate';
    if (id.endsWith('conditional')) result.conditional = true;

    if (actionsMap[id]) result = { ...result, ...actionsMap[id] };

    return result;
  });

  fs.writeFileSync(ACTIONS_FILE, toJson(actionsData), {
    encoding: 'utf-8',
  });

  success('Сохранил все данные');
})();
