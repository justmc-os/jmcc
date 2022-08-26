import envPaths from 'env-paths';
import * as fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import mkdirp from 'mkdirp';

import {
  number,
  text,
  vector,
  potion,
  particle,
  item,
  any,
  array,
  boolean,
  enumof,
  ActionArgumentTypes,
  location,
  ActionRegisterOptions,
  sound,
  variable,
  map,
} from './code/action/defined/Actions';
import CodeModule from './code/CodeModule';
import CodeHandler from './code/handler/CodeHandler';
import { DynamicValue } from './value/DynamicValue';

import { ActionData } from '../../../data/action';
import { ValueData } from '../../../data/value';
import gameValues from './code/properties/GameValues';
import CodeEvent from './code/handler/CodeEvent';

class Bootstrap {
  reload() {
    DynamicValue.id = 0;
    CodeHandler._naive_position = 0;
  }

  private typeByName(name: string) {
    if (name === 'number') return number;
    if (name === 'text') return text;
    if (name === 'location') return location;
    if (name === 'vector') return vector;
    if (name === 'potion') return potion;
    if (name === 'particle') return particle;
    if (name === 'block') return item;
    if (name === 'item') return item;
    if (name === 'sound') return sound;
    if (name === 'variable') return variable;

    return any;
  }

  private loaded = false;
  load(actions: ActionData[], values: ValueData[], events: string[]) {
    if (this.loaded) return;
    this.loaded = true;
    CodeModule.OBJECTS.forEach((object) => (object.actions.actions = []));

    actions.forEach((action) => {
      const object = CodeModule.OBJECTS.find(
        (_object) => _object.name === action.object
      );

      if (!object)
        throw `Неизвестный объект действия '${action.id}': '${action.object}'`;

      const args = action.args.reduce((acc, argument) => {
        acc[argument.name] = this.typeByName(argument.type);

        if (argument.array)
          acc[argument.name] = array(
            this.typeByName(argument.type),
            argument.length!
          );

        if (argument.type === 'boolean')
          acc[argument.name] = boolean(argument.defaultBooleanValue);

        if (argument.type === 'enum')
          acc[argument.name] = enumof(...argument.enum!);

        return acc;
      }, {} as ActionArgumentTypes);

      object.actions.register(
        action.id,
        action.name,
        args,
        action as ActionRegisterOptions
      );
    });

    values.forEach((value) => {
      const type =
        value.type === 'array'
          ? array(this.typeByName(value.array!.type), value.array!.length)
          : value.type === 'map'
          ? map(
              this.typeByName(value.map!.key),
              this.typeByName(value.map!.value)
            )
          : this.typeByName(value.type);

      gameValues.register(value.id, value.name, type);
    });

    CodeEvent.EVENTS = events;
  }

  async loadRemote() {
    const events = await this.getRemoteDataFile('events.json');
    const actions = await this.getRemoteDataFile('actions.json');
    const values = await this.getRemoteDataFile('values.json');
    const version = await this.getRemoteDataFile('version.json');

    this.load(actions, values, events);

    await mkdirp(Bootstrap.DATA_FOLDER);
    this.writeLocalDataFile('events.json', events);
    this.writeLocalDataFile('actions.json', actions);
    this.writeLocalDataFile('values.json', values);
    this.writeLocalDataFile('version', version.data);
  }

  loadLocal() {
    const events = this.getLocalDataFile('events.json');
    const actions = this.getLocalDataFile('actions.json');
    const values = this.getLocalDataFile('values.json');

    this.load(actions, values, events);
  }

  async getRemoteDataFile(name: string) {
    const r = await fetch(`${Bootstrap.REMOTE_DATA}/${name}`);
    return await r.json();
  }

  private getLocalDataFile(name: string) {
    return JSON.parse(
      fs.readFileSync(path.resolve(Bootstrap.DATA_FOLDER, name), 'utf-8')
    );
  }

  private writeLocalDataFile(name: string, content: any) {
    fs.writeFileSync(
      path.resolve(Bootstrap.DATA_FOLDER, name),
      JSON.stringify(content)
    );
  }

  getLocalDataVersion() {
    return +this.getLocalDataFile('version');
  }

  hasLocalData() {
    return fs.existsSync(path.resolve(Bootstrap.DATA_FOLDER, 'version'));
  }

  static DATA_FOLDER = envPaths('jmcc', { suffix: '' }).data;
  static REMOTE_DATA =
    'https://raw.githubusercontent.com/justmc-c/jmcc/main/data';
}

const bootstrap = new Bootstrap();

export default bootstrap;
