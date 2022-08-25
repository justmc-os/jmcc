import NamedObject from './NamedObject';
import { dummyProperties } from '../properties/Properties';
import worldActions from '../action/defined/WorldActions';

class WorldObject extends NamedObject {
  public readonly actions = worldActions;
  public readonly properties = dummyProperties;

  constructor() {
    super('world');
  }
}

const worldObject = new WorldObject();

export default worldObject;
