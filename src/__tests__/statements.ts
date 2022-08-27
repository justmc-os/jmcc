import JMCC from '../core';

const jmcc = new JMCC();

describe('события', () => {
  test('обычные', () => {
    const source = `
      event<player_join> {
        player::message("hello")
      }

      event<player_quit> {
        player::message("bye")
      }
    `;

    expect(jmcc.compileToJson(source)).toMatchSnapshot();
  });

  test('с break', () => {
    const source = `
      event<player_join> {
        player::message("hello")

        break
      }
    `;

    expect(jmcc.compileToJson(source)).toMatchSnapshot();
  });
});

describe('функции', () => {
  test('обычные', () => {
    const source = `
      function func() {}

      func()
    `;

    expect(jmcc.compileToJson(source)).toMatchSnapshot();
  });

  test('с аргументами', () => {
    const source = `
      function func(a, b) {}

      func(1, 2)
    `;

    expect(jmcc.compileToJson(source)).toMatchSnapshot();
  });

  test('с опциональными аргументами', () => {
    const source = `
      function func(a, b = 0) {}

      func(1)
    `;

    expect(jmcc.compileToJson(source)).toMatchSnapshot();
  });

  test('с именными аргументами', () => {
    const source = `
      function func(a, b) {}

      func(a = 1, b = 2)
    `;

    expect(jmcc.compileToJson(source)).toMatchSnapshot();
  });

  test('процессы', () => {
    const source = `
      process func(a, b) {}

      func(1, 2)
    `;

    expect(jmcc.compileToJson(source)).toMatchSnapshot();
  });

  test('поздние', () => {
    const source = `
      func(1, 2)

      function func(a, b) {}
    `;

    expect(jmcc.compileToJson(source)).toMatchSnapshot();
  });
});

describe('if-блоки', () => {
  test('обычные', () => {
    const source = `
      var a = 1

      if (variable::in_range(a, 1, 2)) {
        player::message("true")
      }
    `;

    expect(jmcc.compileToJson(source)).toMatchSnapshot();
  });

  test('not', () => {
    const source = `
      var a = 1

      if not (variable::in_range(a, 1, 2)) {
        player::message("false")
      }
    `;

    expect(jmcc.compileToJson(source)).toMatchSnapshot();
  });

  test('с else-блоком', () => {
    const source = `
      var a = 1

      if (variable::in_range(a, 1, 2)) {
        player::message("true")
      } else {
        player::message("false")
      }
    `;

    expect(jmcc.compileToJson(source)).toMatchSnapshot();
  });

  test('с одним выражением', () => {
    const source = `
      var a = 1

      if (variable::in_range(a, 1, 2))
        player::message("true")
      else
        player::message("false")
    `;

    expect(jmcc.compileToJson(source)).toMatchSnapshot();
  });
});
