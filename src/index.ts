#!/usr/bin/env node

import path from 'path';
import chalk from 'chalk';
import { Command, Help } from 'commander';
import { promises as fsp } from 'fs';
import fetch from 'node-fetch';

import jmccPackage from '../package.json';
import JMCC from './core';
import checkForUpdates from './checkForUpdates';
import bootstrap from './core/jmcc/Bootstrap';

const DOMAIN = 'https://m.justmc.ru';

const error = (message: string) => {
  return `${chalk.bgRed.black(' Ошибка ')} ${message}`;
};

const program = new Command();

program
  .name(jmccPackage.name)
  .description(
    `${chalk.cyan(jmccPackage.name.toUpperCase())}\n${jmccPackage.description}`
  )
  .version(jmccPackage.version, '-v, --version', 'Выводит текущую версию JMCC')
  .helpOption('-h, --help', 'Выводит помощь о команде')
  .addHelpCommand('help [command]', 'Выводит помощь о команде');

program
  .configureHelp({
    formatHelp: (cmd, helper) => {
      const originalHelp = new Help();
      return originalHelp
        .formatHelp(cmd, helper)
        .replace('Arguments:', chalk.cyan`Аргументы:`)
        .replace('Commands:', chalk.cyan`Команды:`)
        .replace('Options:', chalk.cyan`Опции:`)
        .replace('Usage:', chalk.bgYellow.black` Использование: `);
    },
  })
  .configureOutput({
    outputError: (str, write) => {
      write(
        error(
          str
            .replace(
              'error: missing required argument',
              'Не указан обязательный аргумент'
            )
            .replace('error: unknown option', 'Неизвестная опция')
            .replace('error: too many arguments', 'Слишком много аргументов')
            .replace('error: unknown command', 'Неизвестная команда')
            .replace('(Did you mean', chalk.black`(Возможно, вы имели ввиду`)
            .replace('Expected', 'Ожидал')
            .replace('arguments', 'аргументов')
            .replace('argument', 'аргумент')
            .replace('but got', 'но получил')
        )
      );
    },
  });

program.showHelpAfterError(
  chalk.black`(добавьте --help для подробной информации о команде)`
);

program
  .command('compile')
  .description(
    'Компилирует выбранный файл в JSON файл, используемый на сервере'
  )
  .argument('<path>', 'путь к файлу')
  .option('-o, --output <путь>', 'путь для создания JSON файла')
  .option('-d, --debug', 'компиляция в режиме дебага')
  .option(
    '-s, --silent',
    'отключает создания файла и выводит результат в stdout'
  )
  .option('-u, --upload', 'загружает скомпилированный файл на хостинг')
  .action(async (_path: string, options) => {
    if (!bootstrap.hasLocalData()) {
      await bootstrap.loadRemote();
    }

    const jmcc = new JMCC();
    const promise = checkForUpdates();

    let file: string | false;
    try {
      file = jmcc.resolveFile(process.cwd(), _path);
    } catch (e: any) {
      await promise;
      return console.error(error(e));
    }

    const result = jmcc.compileFileToJson(file, {
      debug: options.debug,
    });

    if (options.silent) return console.dir(result, { depth: Infinity });
    if (options.upload) {
      await promise;
      const response = await fetch(`${DOMAIN}/api/upload`, {
        method: 'POST',
        body: JSON.stringify(result),
      }).then((r) => r.json());
      if ('error' in response) return console.log(error(response.error));

      console.log(chalk.bgGreen.black(' Успех '), 'Файл загружен');
      console.log();
      console.log(
        chalk.gray(
          ' Используйте данную команду на сервере для загрузки модуля:'
        )
      );
      console.log(chalk.blue(` /module load-url ${DOMAIN}/api/${response.id}`));
      console.log();
      console.log(
        chalk.bgYellow.black(' Важно '),
        `Модуль по ссылке удалится через ${chalk.red('3 минуты!')}`
      );
      console.log(
        '        Успейте использовать команду на сервере за данное время'
      );
      return;
    }

    const output = options.output || `${file.replace(/\.jc$/g, '')}.json`;

    await fsp.writeFile(path.resolve(output), JSON.stringify(result, null, 2), {
      encoding: 'utf-8',
    });
    await promise;
  });

program
  .command('fetch')
  .description('Обновляет данные о коде')
  .action(async (_path: string, options) => {
    await bootstrap.loadRemote();
    console.log(chalk.bgGreen.black(' Успех '), 'Данные обновлены');
  });

program.parse();