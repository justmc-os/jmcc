import Actions from './Actions';

const SELECT_ACTIONS_SELECTION: string[] = [];

class SelectActions extends Actions {
  constructor() {
    super(SELECT_ACTIONS_SELECTION);
  }
}

const selectActions = new SelectActions();

export default selectActions;
