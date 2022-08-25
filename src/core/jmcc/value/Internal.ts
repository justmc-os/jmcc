import ErrorTraceable from '../ErrorTraceable';

class Internal<T extends object> extends ErrorTraceable {
  constructor(public value: T) {
    super();
  }
}

export default Internal;
