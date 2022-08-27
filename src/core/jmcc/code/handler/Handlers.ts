import TextConstant from '../../value/constants/TextConstant';
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

    const walk = (
      container: CodeContainingAction | CodeHandler,
      maxLength: number
    ) => {
      let length = 0;
      for (let k = 0; k < container.actions.length; k++) {
        const action = container.actions[k];
        const isActionContaining = action instanceof CodeContainingAction;
        const nextAction = container.actions[k + 1];
        const isNextActionElse =
          nextAction instanceof CodeContainingAction &&
          nextAction.id === codeActions.ELSE.id;

        // Если действие может хранить другие действия и пустое
        if (
          isActionContaining &&
          action.actions.length === 0 &&
          // Если следующее действие не равно ветке ИНАЧЕ
          !isNextActionElse
        ) {
          container.actions.splice(k, 1);
          continue;
        }

        let currentMaxLength = maxLength;
        if (isActionContaining && isNextActionElse) {
          if (length + action.length > maxLength - 4) currentMaxLength -= 4;
        }

        if (length + action.length > currentMaxLength) {
          if (
            !isActionContaining ||
            maxLength - length < CodeContainingAction.LENGTH + 2
          ) {
            const removeAt = isActionContaining ? k : k - 1;
            const actions = container.actions.slice(removeAt);
            if (
              actions.length === 1 &&
              !(actions[0] instanceof CodeContainingAction)
            )
              break;

            const name = `jmcc.f${functionId++}`;
            const func = new CodeFunction(name);
            func.actions = actions;
            result.push(func);

            container.actions = container.actions.slice(0, removeAt);
            container.actions.push(
              Actions.from(codeActions.CALL_FUNCTION, {
                function_name: new TextConstant(name),
              })
            );

            break;
          } else {
            walk(
              action,
              currentMaxLength -
                length -
                CodeContainingAction.LENGTH -
                (nextAction ? 1 : 0)
            );
            length = currentMaxLength - 1;
          }
        } else length += action.length;
      }

      return container;
    };

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

      walk(handler, CodeHandler.MAX_LENGTH) as CodeHandler;
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
