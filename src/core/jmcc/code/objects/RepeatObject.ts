import NamedObject from './NamedObject';
import { dummyProperties } from '../properties/Properties';
import repeatActions from '../action/defined/RepeatActions';

class RepeatObject extends NamedObject {
  public readonly actions = repeatActions;
  public readonly properties = dummyProperties;

  constructor() {
    super('repeat');
  }
}

const repeatObject = new RepeatObject();

export default repeatObject;
