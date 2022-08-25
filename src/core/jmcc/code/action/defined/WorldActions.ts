import Actions from './Actions';

const WORLD_ACTIONS_SELECTION: string[] = [];

class WorldActions extends Actions {
  constructor() {
    super(WORLD_ACTIONS_SELECTION);
  }
}

const worldActions = new WorldActions();

export default worldActions;
