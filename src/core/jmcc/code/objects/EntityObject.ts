import NamedObject from './NamedObject';
import { dummyProperties } from '../properties/Properties';
import entityActions from '../action/defined/EntityActions';

class EntityObject extends NamedObject {
  public readonly actions = entityActions;
  public readonly properties = dummyProperties;

  constructor() {
    super('entity');
  }
}

const entityObject = new EntityObject();

export default entityObject;
