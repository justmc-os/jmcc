import NamedObject from './NamedObject';
import { dummyProperties } from '../properties/Properties';
import selectActions from '../action/defined/SelectActions';

class SelectObject extends NamedObject {
  public readonly actions = selectActions;
  public readonly properties = dummyProperties;

  constructor() {
    super('select');
  }
}

const selectObject = new SelectObject();

export default selectObject;
