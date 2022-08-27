import JMCC from '../core';

const jmcc = new JMCC();

describe('вызовы', () => {
  describe('функций', () => {
    describe('встроенных объектов', () => {
      test('обычных', () => {
        const source = `
          var a = variable::create_list([1, 2])
          var c = variable::create_list(values = [1, 2])
          
          player::message("hello!", merging = "CONCATENATION")
        `;

        expect(jmcc.compileToJson(source)).toMatchSnapshot();
      });

      test('с аргументом массивом', () => {
        const source = `
          player::message(["hello", "world!"], merging = "SPACES")
        `;

        expect(jmcc.compileToJson(source)).toMatchSnapshot();
      });

      test('с неизвестным аргументом', () => {
        const source = `
          var a = variable::create_list(b = 1)
        `;

        expect(() => jmcc.compileToJson(source)).toThrowErrorMatchingSnapshot();
      });

      test('с неподходящим типом аргумента', () => {
        const source = `
          var a = variable::clamp(0, 1, "2")
        `;

        expect(() => jmcc.compileToJson(source)).toThrowErrorMatchingSnapshot();
      });

      test('проверяющих значение', () => {
        const source = `
          if (player::is_holding(item("stone"))) {
            player::message("hello")
          }
        `;

        expect(jmcc.compileToJson(source)).toMatchSnapshot();
      });

      test('повторений', () => {
        const source = `
          repeat::forever() {
            player::message("hello")
          }
        `;

        expect(jmcc.compileToJson(source)).toMatchSnapshot();
      });

      test('повторений с условием', () => {
        const source = `
          repeat::while(player::is_holding(item("stone"))) {
            player::message("hello")
          }
        `;

        expect(jmcc.compileToJson(source)).toMatchSnapshot();
      });

      test('повторений с лямбдами', () => {
        const source = `
          repeat::on_range(0, 2) { i ->
            player::message("idx: $i")
          }
        `;

        expect(jmcc.compileToJson(source)).toMatchSnapshot();
      });
    });

    describe('переменных', () => {
      test('обычных', () => {
        const source = `
          var a = 5
          a.increment(1)
          a.decrement(2)
        `;

        expect(jmcc.compileToJson(source)).toMatchSnapshot();
      });

      test('с установкой значения', () => {
        const source = `
          var a = 5
          var b = a.clamp(1, 2)
          var c = a.clamp(min = 1, max = 2)
        `;

        expect(jmcc.compileToJson(source)).toMatchSnapshot();
      });

      test('с неизвестным аргументом', () => {
        const source = `
          var a = 5
          var b = a.clamp(min = 1, min2 = 2)
        `;

        expect(() => jmcc.compileToJson(source)).toThrowErrorMatchingSnapshot();
      });

      test('с неподходящим типом аргумента', () => {
        const source = `
          var a = 5
          var b = a.clamp(1, "2")
        `;

        expect(() => jmcc.compileToJson(source)).toThrowErrorMatchingSnapshot();
      });
    });

    describe('фабрик', () => {
      test('обычных', () => {
        const source = `
          var a = location(1, 2, 3)
          var b = location(1, 2, 3, 4, 5)
        `;

        expect(jmcc.compileToJson(source)).toMatchSnapshot();
      });

      test('с неподходящим типом аргумента', () => {
        const source = `
          var a = location(1, 2, "3")
        `;

        expect(() => jmcc.compileToJson(source)).toThrowErrorMatchingSnapshot();
      });
    });
  });

  describe('массивов', () => {
    test('обычных', () => {
      const source = `
        var a = [1, 2]
        var b = a[0]
      `;

      expect(jmcc.compileToJson(source)).toMatchSnapshot();
    });

    test('с установкой', () => {
      const source = `
        var a = [1, 2]
        a[1] = 2
      `;

      expect(jmcc.compileToJson(source)).toMatchSnapshot();
    });
  });
});
