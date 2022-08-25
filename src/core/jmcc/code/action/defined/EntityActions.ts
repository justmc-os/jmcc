import Actions from './Actions';

const ENTITY_ACTIONS_SELECTION: string[] = [];

class EntityActions extends Actions {
  constructor() {
    super(ENTITY_ACTIONS_SELECTION);
  }
}

const entityActions = new EntityActions();

export default entityActions;
