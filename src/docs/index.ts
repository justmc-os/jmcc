/**
 * Генератор документации
 */

import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import chalk from 'chalk';
import { FlatProperties, parse } from '@js.properties/properties';

export const DOCS_DIR = path.resolve(__dirname, '../../docs');

import generateGameValueDocs from './properties';
import generateEventsDocs from './events';
import generateFactoriesDocs from './factories';
import generateActionsDocs from './actions';
import bootstrap from '../core/jmcc/Bootstrap';
import checkForUpdates from '../checkForUpdates';

if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR);

const projectDataFolder = path.resolve(__dirname, '../../data');
const actions = JSON.parse(
  fs.readFileSync(path.resolve(projectDataFolder, 'actions.json'), 'utf-8')
);
const values = JSON.parse(
  fs.readFileSync(path.resolve(projectDataFolder, 'values.json'), 'utf-8')
);
const events = JSON.parse(
  fs.readFileSync(path.resolve(projectDataFolder, 'events.json'), 'utf-8')
);

bootstrap.load(actions, values, events);

const URL =
  'https://gitlab.com/justmc/justmc-localization/-/raw/master/creative_plus/ru_RU.properties';

const getProperties = async () => {
  const result = await fetch(URL).then((r) => r.text());
  const properties = parse(result) as FlatProperties;

  return properties;
};

const info = (text: string) => console.log(chalk.blue('info'), text);
const success = (text: string) => console.log(chalk.green('success'), text);

(async () => {
  const promise = checkForUpdates();
  const properties = await getProperties();

  info('Генерирую документацию действий...');
  await generateActionsDocs(properties);
  info('Генерирую документацию игровых значений...');
  await generateGameValueDocs(properties);
  info('Генерирую документацию событий...');
  await generateEventsDocs(properties);
  info('Генерирую документацию фабрик...');
  await generateFactoriesDocs(properties);
  success('Сгенерировал всю документацию');

  await promise;
})();
