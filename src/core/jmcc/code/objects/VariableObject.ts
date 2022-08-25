import NamedObject from './NamedObject';
import variableActions from '../action/defined/VariableActions';
import { dummyProperties } from '../properties/Properties';

class VariableObject extends NamedObject {
  public readonly actions = variableActions;
  public readonly properties = dummyProperties;

  constructor() {
    super('variable');
  }
}

const variableObject = new VariableObject();

export default variableObject;
