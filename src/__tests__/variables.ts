import JMCC from '../core';

const jmcc = new JMCC();

describe('переменные', () => {
  test('локальные', () => {
    const source = `
      var a = "string"
    `;

    expect(jmcc.compileToJson(source)).toMatchSnapshot();
  });

  test('игровые', () => {
    const source = `
      game var a = "string"
    `;

    expect(jmcc.compileToJson(source)).toMatchSnapshot();
  });

  test('сохранённые', () => {
    const source = `
      save var a = "string"
    `;

    expect(jmcc.compileToJson(source)).toMatchSnapshot();
  });

  describe('вписанные', () => {
    test('обычные', () => {
      const source = `
        inline var a = "string"
      `;

      expect(jmcc.compileToJson(source)).toMatchSnapshot();
    });

    test('с использованием', () => {
      const source = `
        inline var a = "string"

        player::message(a)
      `;

      expect(jmcc.compileToJson(source)).toMatchSnapshot();
    });
  });

  test('с нестандартным идентификатором', () => {
    const source = `
      var идентификатор = "string"
      var \`с пробелом\` = "string"
      var \`\${идентификатор}\` = "string"
      var \`\$идентификатор 2\` = "string"
    `;

    expect(jmcc.compileToJson(source)).toMatchSnapshot();
  });

  test('переопределение', () => {
    const source = `
      var a = "string"
      var a = 'string'
    `;

    expect(() => jmcc.compileToJson(source)).toThrowErrorMatchingSnapshot();
  });
});
