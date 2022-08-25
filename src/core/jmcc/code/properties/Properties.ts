import { ArgumentType } from '../action/defined/Actions';

export type Property<T extends ArgumentType> = {
  id: string;
  name: string;
  type: T;
  selection: string[];
};

class Properties {
  public properties: Property<any>[] = [];
  constructor(public selection: string[]) {}

  register<T extends ArgumentType>(id: string, name: string, type: T) {
    this.properties.push({ id, name, type, selection: this.selection });
  }

  get(action: string): Property<any> | undefined {
    return this.properties.find(({ name }) => name === action);
  }
}

export const dummyProperties = new Properties([]);

export default Properties;
