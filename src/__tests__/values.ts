import JMCC from '../core';

const jmcc = new JMCC();

describe('значения', () => {
  describe('текст', () => {
    test('с двойными кавычками', () => {
      const source = `
        var a = "string"
      `;

      expect(jmcc.compileToJson(source)).toMatchSnapshot();
    });

    test('с одинарными кавычками', () => {
      const source = `
        var a = 'string'
      `;

      expect(jmcc.compileToJson(source)).toMatchSnapshot();
    });
  });

  describe('число', () => {
    test('целое', () => {
      const source = `
        var a = 1
      `;

      expect(jmcc.compileToJson(source)).toMatchSnapshot();
    });

    test('дробное', () => {
      const source = `
        var a = 0.1
      `;

      expect(jmcc.compileToJson(source)).toMatchSnapshot();
    });

    test('отрицательное', () => {
      const source = `
        var a = -1
      `;

      expect(jmcc.compileToJson(source)).toMatchSnapshot();
    });
  });

  describe('массив', () => {
    test('пустой', () => {
      const source = `
        var a = []
      `;

      expect(jmcc.compileToJson(source)).toMatchSnapshot();
    });

    test('с элементами', () => {
      const source = `
        var a = [1, 2, 3, 4, 5]
      `;

      expect(jmcc.compileToJson(source)).toMatchSnapshot();
    });

    test('с больше 21 элементов', () => {
      const source = `
        var a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
      `;

      expect(jmcc.compileToJson(source)).toMatchSnapshot();
    });

    test('вложенный', () => {
      const source = `
        var a = [[1]]
      `;

      expect(jmcc.compileToJson(source)).toMatchSnapshot();
    });
  });

  describe('переменные', () => {
    test('определённые', () => {
      const source = `
        var a = 0
        var b = a
      `;

      expect(jmcc.compileToJson(source)).toMatchSnapshot();
    });

    test('игровые', () => {
      const source = `
        var a = value::location
      `;

      expect(jmcc.compileToJson(source)).toMatchSnapshot();
    });
  });
});
