import Actions from './Actions';

const REPEAT_ACTIONS_SELECTION: string[] = [];

class RepeatActions extends Actions {
  constructor() {
    super(REPEAT_ACTIONS_SELECTION);
  }
}

const repeatActions = new RepeatActions();

export default repeatActions;
