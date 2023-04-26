import TextConstant from '../../value/constants/TextConstant';
import CodeAction from '../action/CodeAction';
import CodeContainingAction from '../action/CodeContainingAction';
import Actions from '../action/defined/Actions';
import codeActions from '../action/defined/CodeActions';
import CodeFunction from './CodeFunction';
import CodeHandler from './CodeHandler';
import CodeProcess from './CodeProcess';

class Handlers {
  protected values: CodeHandler[] = [];

  get initial(): CodeHandler {
    return this.values[0];
  }

  add(handler: CodeHandler) {
    this.values.push(handler);
  }

  importVariables(other: Handlers) {
    this.initial.localVariables = [
      ...other.initial.localVariables,
      ...this.initial.localVariables,
    ];
  }

  append(other: Handlers) {
    this.importVariables(other);
    this.values = [...this.values, ...other.values.slice(1)];
    this.initial.actions = [...this.initial.actions, ...other.initial.actions];
  }

  private built: boolean = false;
  build() {
    if (this.built) return;
    this.built = true;

    let functionId = 0;
    let position = 0;
    const result = this.values;

    for (let i = 0; i < result.length; i++) {
      let handler = result[i];
      if (
        handler.length === 0 &&
        !(handler instanceof CodeFunction || handler instanceof CodeProcess)
      ) {
        result.splice(i--, 1);
        continue;
      }

      handler.position = position++;

      // Хендлер размером с одну строчку кода
      if (handler.length <= CodeHandler.MAX_LENGTH) continue;

      let idx = 0,
        maxLength = CodeHandler.MAX_LENGTH;

      const walk = (container: CodeContainingAction | CodeHandler) => {
        for (
          let actionIdx = 0;
          actionIdx < container.actions.length;
          actionIdx++
        ) {
          const action = container.actions[actionIdx];
          const isContainer = action instanceof CodeContainingAction;
          const actionLength = isContainer
            ? CodeContainingAction.LENGTH
            : CodeAction.LENGTH;
          const newIdx = idx + actionLength;
          const next = container.actions[actionIdx + 1];
          const hasNext = !!next;
          const hasContents = isContainer && action.actions.length > 0;

          const reserved = (() => {
            let reserved = 0;
            if (hasNext) reserved += 1;
            if (hasContents) reserved += 1;

            // If next action is else
            if (!hasNext) return reserved;
            if (!isContainer) return reserved;
            if (next.id !== codeActions.ELSE.id) return reserved;
            if (!(next instanceof CodeContainingAction)) return reserved;

            reserved += 2;
            if (next.actions.length > 0) reserved += 1;
            if (!!container.actions[actionIdx + 2]) reserved += 1;
            return reserved;
          })();

          const containerMaxLength = maxLength - reserved;
          if (newIdx > containerMaxLength) {
            const name = `jmcc.f${functionId++}`;
            const func = new CodeFunction(name);
            func.actions = container.actions.splice(
              actionIdx,
              Infinity,
              Actions.from(codeActions.CALL_FUNCTION, {
                function_name: new TextConstant(name),
              })
            );
            result.push(func);
            idx += 1;
            break;
          }

          idx = newIdx;

          if (isContainer) {
            maxLength -= reserved;
            walk(action);
            maxLength += reserved;
          }
        }
      };

      walk(handler);
    }

    this.values = result;
  }

  toJson() {
    this.build();

    return {
      handlers: this.values.map((handler) => handler.toJson()),
    };
  }
}

export default Handlers;
